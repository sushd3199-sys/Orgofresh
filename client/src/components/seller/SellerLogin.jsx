import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

const SellerLogin = () => {
  const { IsSeller, setIsSeller, navigate, setUser, axios } = useAppContext();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/seller/login",
        { email, password },
        { withCredentials: true }
      );

      if (data.success) {
        setUser(data.seller);
        setIsSeller(true);
        toast.success(
          data.seller.role === "admin"
            ? `Welcome Admin ${data.seller.name} 👑`
            : `Welcome ${data.seller.name} 🛒`
        );
        navigate("/seller");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (IsSeller) navigate("/seller");
  }, [IsSeller]);

  if (IsSeller) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #F0FDF4 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Outfit', 'Roboto', sans-serif",
      padding: 20, position: "relative", overflow: "hidden",
    }}>

      {/* Background glow */}
      <div style={{
        position: "absolute", top: -100, right: -100,
        width: 350, height: 350, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -80, left: -80,
        width: 280, height: 280, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(250,204,21,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 400,
        background: "#fff",
        borderRadius: 24, overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        position: "relative", zIndex: 1,
      }}>

        {/* Green top bar with logo */}
        <div style={{
          background: "linear-gradient(135deg, #16A34A, #22C55E)",
          padding: "28px 32px 24px", textAlign: "center",
        }}>
          <img
            src={assets.logofavi}
            alt="Orgofresh"
            style={{ height: 52, margin: "0 auto 10px", display: "block" }}
          />
          <p style={{
            margin: 0, fontSize: 12, color: "rgba(255,255,255,0.75)",
            letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600,
          }}>
            Seller Portal
          </p>
        </div>

        {/* Form body */}
        <div style={{ padding: "28px 32px 32px" }}>
          <h2 style={{
            margin: "0 0 6px", fontSize: 20, fontWeight: 800, color: "#0F172A",
          }}>
            Seller Login
          </h2>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "#94A3B8" }}>
            Sign in to manage your products & orders
          </p>

          <form onSubmit={onSubmitHandler}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Email */}
            <div>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 700,
                color: "#64748B", marginBottom: 7,
                textTransform: "uppercase", letterSpacing: "0.07em",
              }}>
                Email Address
              </label>
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seller@orgofresh.com"
                required
                style={{
                  width: "100%", padding: "11px 14px",
                  border: "1.5px solid #E2E8F0", borderRadius: 10,
                  fontSize: 14, color: "#0F172A", outline: "none",
                  background: "#FAFAFA", boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                onFocus={e => { e.target.style.borderColor = "#16A34A"; e.target.style.background = "#fff"; }}
                onBlur={e  => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#FAFAFA"; }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 700,
                color: "#64748B", marginBottom: 7,
                textTransform: "uppercase", letterSpacing: "0.07em",
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
                    width: "100%", padding: "11px 50px 11px 14px",
                    border: "1.5px solid #E2E8F0", borderRadius: 10,
                    fontSize: 14, color: "#0F172A", outline: "none",
                    background: "#FAFAFA", boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#16A34A"; e.target.style.background = "#fff"; }}
                  onBlur={e  => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#FAFAFA"; }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: 12, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 12, color: "#94A3B8", fontWeight: 600,
                  }}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <button type="button"
              onClick={() => navigate("/seller/forgot-password")}
              style={{
                background: "none", border: "none",
                color: "#3B82F6", fontSize: 13,
                cursor: "pointer", textAlign: "left",
                padding: 0, fontFamily: "inherit",
              }}>
              Forgot Password?
            </button>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                padding: "13px",
                background: loading
                  ? "rgba(22,163,74,0.5)"
                  : "linear-gradient(135deg, #16A34A, #22C55E)",
                color: "#fff", border: "none", borderRadius: 12,
                fontSize: 15, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 14px rgba(22,163,74,0.35)",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8,
                fontFamily: "inherit",
              }}>
              {loading ? (
                <>
                  <span style={{
                    width: 16, height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff", borderRadius: "50%",
                    display: "inline-block",
                    animation: "sellerSpin 0.7s linear infinite",
                  }} />
                  Signing in...
                </>
              ) : "Sign In →"}
            </button>

          </form>

          {/* Back to store */}
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button type="button" onClick={() => navigate("/")}
              style={{
                background: "none", border: "none",
                color: "#94A3B8", fontSize: 13,
                cursor: "pointer", fontFamily: "inherit",
              }}>
              ← Back to store
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes sellerSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default SellerLogin;
