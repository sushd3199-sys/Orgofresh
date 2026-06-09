import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase.js";
import { assets } from "../assets/assets";

const Login = () => {
  const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

  const [state, setState]             = useState("login");
  const [step, setStep]               = useState("form");
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [otp, setOtp]                 = useState(Array(6).fill(""));
  const [timer, setTimer]             = useState(0);
  const inputRefs                     = useRef([]);
  const timerRef                      = useRef(null);

  // ── Timer logic ─────────────────────────────────────────────────────────────
  const startTimer = () => {
    setTimer(30);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  // ── OTP handlers ─────────────────────────────────────────────────────────────
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(paste)) return;
    const newOtp = paste.split("");
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
    newOtp.forEach((digit, i) => {
      if (inputRefs.current[i]) inputRefs.current[i].value = digit;
    });
    inputRefs.current[Math.min(newOtp.length, 5)]?.focus();
  };

  // ── Google login ─────────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user   = result.user;

      const { data } = await axios.post("/api/user/google-login", {
        name:  user.displayName,
        email: user.email,
      });

      if (data.success) {
        setUser(data.user);
        toast.success(data.isNewUser
          ? `Welcome to Orgofresh, ${data.user.name}! 🎉`
          : `Welcome back, ${data.user.name}! 👋`
        );
        navigate("/");
        setShowUserLogin(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user") {
        toast.error("Google login failed. Try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── Submit (login / register) ────────────────────────────────────────────────
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/user/${state}`, { name, email, password });
      if (data.success) {
        if (state === "register") {
          toast.success("OTP sent to your email");
          setStep("otp");
          startTimer();
        } else {
          setUser(data.user);
          navigate("/");
          setShowUserLogin(false);
          toast.success(`Welcome back! 👋`);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Verify OTP ───────────────────────────────────────────────────────────────
  const verifyOtpHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/user/verify-otp", {
        email, otp: otp.join(""),
      });
      if (data.success) {
        toast.success("Account verified! Please login.");
        setStep("form"); setState("login");
        setOtp(Array(6).fill(""));
      } else { toast.error(data.message); }
    } catch (error) { toast.error(error.message); }
    finally { setLoading(false); }
  };

  // ── Forgot password ──────────────────────────────────────────────────────────
  const forgotHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/user/forgot-password", { email });
      if (data.success) {
        toast.success("OTP sent to your email");
        setStep("reset"); startTimer();
      } else { toast.error(data.message); }
    } catch (error) { toast.error(error.message); }
    finally { setLoading(false); }
  };

  // ── Reset password ───────────────────────────────────────────────────────────
  const resetHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/user/reset-password", {
        email, otp: otp.join(""), password,
      });
      if (data.success) {
        toast.success("Password updated! Please login.");
        setStep("form"); setState("login");
        setOtp(Array(6).fill(""));
      } else { toast.error(data.message); }
    } catch (error) { toast.error(error.message); }
    finally { setLoading(false); }
  };

  // ── Resend OTP ───────────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    try {
      const url  = step === "otp" ? "/api/user/register" : "/api/user/forgot-password";
      const { data } = await axios.post(url, { name, email, password });
      if (data.success) { toast.success("OTP resent"); startTimer(); }
      else toast.error(data.message);
    } catch (error) { toast.error(error.message); }
  };

  // ── Page titles ──────────────────────────────────────────────────────────────
  const getTitle = () => {
    if (step === "otp")    return { title: "Verify Email",      sub: `OTP sent to ${email}` };
    if (step === "forgot") return { title: "Forgot Password",   sub: "Enter your email to get OTP" };
    if (step === "reset")  return { title: "Reset Password",    sub: "Enter OTP and new password" };
    if (state === "login") return { title: "Welcome back!",     sub: "Sign in to your account" };
    return                        { title: "Create Account",    sub: "Join Orgofresh today" };
  };
  const { title, sub } = getTitle();

  const S = {
    overlay: {
      position: "fixed", inset: 0, zIndex: 50,
      background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(3px)",
      fontFamily: "'Outfit', 'Roboto', sans-serif",
    },
    card: {
      background: "#fff", borderRadius: 24,
      width: "100%", maxWidth: 380,
      boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
      overflow: "hidden", position: "relative",
    },
    topBar: {
      background: "linear-gradient(135deg, #16A34A, #22C55E)",
      padding: "24px 28px 20px",
      textAlign: "center",
    },
    logo: {
      fontSize: 28, marginBottom: 4,
    },
    brand: {
      color: "#fff", fontSize: 18, fontWeight: 800,
      letterSpacing: "-0.3px", margin: 0,
    },
    body: { padding: "24px 28px 28px" },
    titleText: {
      fontSize: 18, fontWeight: 800, color: "#0F172A",
      margin: "0 0 4px", textAlign: "center",
    },
    subText: {
      fontSize: 12, color: "#94A3B8", textAlign: "center",
      margin: "0 0 20px",
    },
    label: {
      display: "block", fontSize: 11, fontWeight: 700,
      color: "#64748B", marginBottom: 6,
      textTransform: "uppercase", letterSpacing: "0.07em",
    },
    input: {
      width: "100%", padding: "11px 14px",
      border: "1.5px solid #E2E8F0", borderRadius: 10,
      fontSize: 14, color: "#0F172A", outline: "none",
      background: "#FAFAFA", boxSizing: "border-box",
      fontFamily: "inherit", transition: "border-color 0.2s",
    },
    primaryBtn: {
      width: "100%", padding: "13px",
      background: loading
        ? "rgba(22,163,74,0.5)"
        : "linear-gradient(135deg, #16A34A, #22C55E)",
      color: "#fff", border: "none", borderRadius: 12,
      fontSize: 14, fontWeight: 700,
      cursor: loading ? "not-allowed" : "pointer",
      display: "flex", alignItems: "center",
      justifyContent: "center", gap: 8,
      fontFamily: "inherit",
      boxShadow: loading ? "none" : "0 4px 14px rgba(22,163,74,0.35)",
    },
    googleBtn: {
      width: "100%", padding: "12px",
      background: "#fff", border: "1.5px solid #E2E8F0",
      borderRadius: 12, fontSize: 14, fontWeight: 600,
      cursor: googleLoading ? "not-allowed" : "pointer",
      display: "flex", alignItems: "center",
      justifyContent: "center", gap: 10,
      color: "#374151", fontFamily: "inherit",
      transition: "border-color 0.2s, background 0.2s",
    },
    divider: {
      display: "flex", alignItems: "center", gap: 10,
      margin: "16px 0",
    },
    dividerLine: { flex: 1, height: 1, background: "#F1F5F9" },
    dividerText: { fontSize: 12, color: "#CBD5E1", fontWeight: 500 },
    closeBtn: {
      position: "absolute", top: 14, right: 16,
      background: "rgba(255,255,255,0.2)", border: "none",
      color: "#fff", width: 28, height: 28, borderRadius: "50%",
      cursor: "pointer", fontSize: 16, display: "flex",
      alignItems: "center", justifyContent: "center",
    },
    otpWrap: {
      display: "flex", justifyContent: "center", gap: 8,
    },
    otpInput: {
      width: 42, height: 48, textAlign: "center",
      border: "2px solid #E2E8F0", borderRadius: 10,
      fontSize: 18, fontWeight: 700, color: "#0F172A",
      outline: "none", background: "#FAFAFA",
      transition: "border-color 0.2s",
    },
  };

  const focusIn  = (e) => { e.target.style.borderColor = "#16A34A"; e.target.style.background = "#fff"; };
  const focusOut = (e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#FAFAFA"; };

  const Spinner = () => (
    <span style={{
      width: 16, height: 16,
      border: "2px solid rgba(255,255,255,0.3)",
      borderTopColor: "#fff", borderRadius: "50%",
      display: "inline-block",
      animation: "loginSpin 0.7s linear infinite",
    }} />
  );

  return (
    <div style={S.overlay} onClick={() => setShowUserLogin(false)}>
      <div style={S.card} onClick={(e) => e.stopPropagation()}>

        {/* ── Top green bar ── */}
        <div style={S.topBar}>
          <button style={S.closeBtn} onClick={() => setShowUserLogin(false)}>✕</button>
          <img
            src={assets.logofavi}
            alt="Orgofresh"
            style={{ height: 48, margin: "0 auto 8px", display: "block" }}
          />
        </div>

        {/* ── Body ── */}
        <div style={S.body}>
          <p style={S.titleText}>{title}</p>
          <p style={S.subText}>{sub}</p>

          <form
            onSubmit={
              step === "otp"    ? verifyOtpHandler :
              step === "reset"  ? resetHandler     :
              step === "forgot" ? forgotHandler    :
              onSubmitHandler
            }
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >

            {/* Name — register only */}
            {state === "register" && step === "form" && (
              <div>
                <label style={S.label}>Full Name</label>
                <input
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Your name" required style={S.input}
                  onFocus={focusIn} onBlur={focusOut}
                />
              </div>
            )}

            {/* Email — not shown during otp verify */}
            {step !== "otp" && (
              <div>
                <label style={S.label}>Email Address</label>
                <input
                  type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com" required style={S.input}
                  onFocus={focusIn} onBlur={focusOut}
                />
              </div>
            )}

            {/* Password */}
            {(step === "form" || step === "reset") && (
              <div>
                <label style={S.label}>
                  {step === "reset" ? "New Password" : "Password"}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" required
                    style={{ ...S.input, paddingRight: 52 }}
                    onFocus={focusIn} onBlur={focusOut}
                  />
                  <button type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute", right: 12, top: "50%",
                      transform: "translateY(-50%)",
                      background: "none", border: "none",
                      cursor: "pointer", fontSize: 12,
                      color: "#94A3B8", fontWeight: 600,
                    }}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            )}

            {/* OTP boxes */}
            {(step === "otp" || step === "reset") && (
              <div>
                <label style={{ ...S.label, textAlign: "center", display: "block" }}>
                  Enter 6-digit OTP
                </label>
                <div style={S.otpWrap} onPaste={handlePaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text" maxLength="1" value={digit}
                      onChange={(e) => handleOtpChange(e, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      style={S.otpInput}
                      onFocus={(e) => { e.target.style.borderColor = "#16A34A"; e.target.style.background = "#fff"; }}
                      onBlur={(e)  => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#FAFAFA"; }}
                    />
                  ))}
                </div>

                {/* Timer / Resend */}
                <div style={{ textAlign: "center", marginTop: 10 }}>
                  {timer > 0 ? (
                    <p style={{ fontSize: 12, color: "#94A3B8" }}>
                      Resend OTP in <strong>{timer}s</strong>
                    </p>
                  ) : (
                    <button type="button" onClick={handleResendOtp}
                      style={{
                        background: "none", border: "none",
                        color: "#16A34A", fontSize: 12,
                        fontWeight: 700, cursor: "pointer",
                      }}>
                      Resend OTP →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Forgot password link */}
            {step === "form" && state === "login" && (
              <button type="button"
                onClick={() => setStep("forgot")}
                style={{
                  background: "none", border: "none",
                  color: "#3B82F6", fontSize: 13,
                  cursor: "pointer", textAlign: "left",
                  padding: 0, fontFamily: "inherit",
                }}>
                Forgot Password?
              </button>
            )}

            {/* Submit button */}
            <button type="submit" disabled={loading} style={S.primaryBtn}>
              {loading ? <Spinner /> : null}
              {loading ? "Please wait..." :
                step === "otp"    ? "Verify OTP"      :
                step === "forgot" ? "Send OTP"        :
                step === "reset"  ? "Reset Password"  :
                state === "register" ? "Create Account" : "Sign In"
              }
            </button>

            {/* Toggle login/register */}
            {step === "form" && (
              <p style={{ fontSize: 13, textAlign: "center", color: "#64748B", margin: 0 }}>
                {state === "login" ? "Don't have an account? " : "Already have an account? "}
                <button type="button"
                  onClick={() => setState(state === "login" ? "register" : "login")}
                  style={{
                    background: "none", border: "none",
                    color: "#16A34A", fontWeight: 700,
                    cursor: "pointer", fontSize: 13,
                    fontFamily: "inherit",
                  }}>
                  {state === "login" ? "Sign Up" : "Login"}
                </button>
              </p>
            )}

            {/* Back link for forgot/reset */}
            {(step === "forgot" || step === "reset") && (
              <button type="button"
                onClick={() => { setStep("form"); setOtp(Array(6).fill("")); }}
                style={{
                  background: "none", border: "none",
                  color: "#94A3B8", fontSize: 12,
                  cursor: "pointer", textAlign: "center",
                  fontFamily: "inherit",
                }}>
                ← Back to Login
              </button>
            )}

          </form>

          {/* Divider */}
          {step === "form" && (
            <>
              <div style={S.divider}>
                <div style={S.dividerLine} />
                <span style={S.dividerText}>or</span>
                <div style={S.dividerLine} />
              </div>

              {/* Google button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                style={S.googleBtn}
                onMouseOver={(e) => {
                  if (!googleLoading) {
                    e.currentTarget.style.borderColor = "#16A34A";
                    e.currentTarget.style.background  = "#F0FDF4";
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#E2E8F0";
                  e.currentTarget.style.background  = "#fff";
                }}
              >
                {googleLoading ? (
                  <>
                    <span style={{
                      width: 16, height: 16,
                      border: "2px solid #E2E8F0",
                      borderTopColor: "#16A34A",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "loginSpin 0.7s linear infinite",
                    }} />
                    Signing in with Google...
                  </>
                ) : (
                  <>
                    {/* Google G icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes loginSpin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;
