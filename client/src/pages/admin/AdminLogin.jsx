import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

const AdminLogin = () => {
  const { axios, navigate, setAdmin, admin } = useAppContext();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  // If already logged in as admin redirect
  useEffect(() => {
    if (admin) navigate("/admin/sellers");
  }, [admin]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Fill in all fields");
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/seller/admin/login",
        { email, password },
        { withCredentials: true }
      );
      if (data.success) {
        setAdmin(data.admin);
        toast.success(`Welcome back, ${data.admin.name} 👑`);
        navigate("/admin/sellers");
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Outfit', 'Roboto', sans-serif",
      padding: 20, position: "relative", overflow: "hidden",
    }}>

      {/* Background glow circles */}
      <div style={{
        position: "absolute", top: -120, right: -120,
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -100, left: -100,
        width: 350, height: 350, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(250,204,21,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 420,
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24, padding: "40px 40px 36px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        position: "relative", zIndex: 1,
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img
            src={assets.logofavi}
            alt="Orgofresh"
            style={{ height: 56, margin: "0 auto 12px", display: "block",
              filter: "brightness(0) invert(1)" }}
          />
          <p style={{
            margin: 0, fontSize: 12, color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600,
          }}>
            Admin Portal
          </p>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#fff" }}>
            Sign in to continue
          </h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
            Restricted to authorized personnel only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmitHandler} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Email field */}
          <div>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 700,
              color: "rgba(255,255,255,0.45)", marginBottom: 8,
              textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@orgofresh.com"
              required
              style={{
                width: "100%", padding: "12px 16px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, fontSize: 14, color: "#fff",
                outline: "none", boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(22,163,74,0.7)"}
              onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          {/* Password field */}
          <div>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 700,
              color: "rgba(255,255,255,0.45)", marginBottom: 8,
              textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%", padding: "12px 52px 12px 16px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12, fontSize: 14, color: "#fff",
                  outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(22,163,74,0.7)"}
                onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute", right: 14, top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "rgba(255,255,255,0.35)", fontSize: 12,
                  fontWeight: 600, padding: 0,
                }}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8, padding: "14px",
              background: loading
                ? "rgba(22,163,74,0.4)"
                : "linear-gradient(135deg, #16A34A, #22C55E)",
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: 15, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 16px rgba(22,163,74,0.45)",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8, transition: "all 0.2s",
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: 16, height: 16,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff", borderRadius: "50%",
                  display: "inline-block",
                  animation: "adminSpin 0.7s linear infinite",
                }} />
                Signing in...
              </>
            ) : "Sign In →"}
          </button>

        </form>

        {/* Security note */}
        <div style={{
          marginTop: 28, padding: "12px 16px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 10, display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>🔒</span>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.28)", lineHeight: 1.5 }}>
            Secure admin area. All activity is monitored and logged.
          </p>
        </div>

        {/* Back to store */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.28)", fontSize: 13,
              textDecoration: "underline", textUnderlineOffset: 3,
            }}
          >
            ← Back to store
          </button>
        </div>

      </div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes adminSpin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.2) !important; }
      `}</style>

    </div>
  );
};

export default AdminLogin;
