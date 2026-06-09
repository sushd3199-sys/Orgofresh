import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const NewsLetter = () => {
  const { axios } = useAppContext();
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Enter your email first");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return toast.error("Enter a valid email address");

    try {
      setLoading(true);
      const { data } = await axios.post("/api/subscribe", { email });

      if (data.success) {
        toast.success("Subscribed! 🎉 Check your inbox");
        setSubscribed(true);
        setEmail("");
      } else {
        toast.error(data.message || "Subscription failed");
      }
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      marginTop: 80, marginBottom: 20,
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
      borderRadius: 28, padding: "56px 40px",
      textAlign: "center", position: "relative", overflow: "hidden",
      fontFamily: "'Outfit', 'Roboto', sans-serif",
    }}>

      {/* Background glow */}
      <div style={{
        position: "absolute", top: -80, right: -80, width: 280, height: 280,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(22,163,74,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: -60, width: 220, height: 220,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(250,204,21,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Eyebrow */}
        <p style={{
          margin: "0 0 12px", fontSize: 12, fontWeight: 700,
          color: "#FACC15", textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}>
          📬 Stay in the loop
        </p>

        {subscribed ? (
          /* Success state */
          <div style={{ padding: "20px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
            <h2 style={{
              margin: "0 0 10px", fontSize: 28, fontWeight: 800,
              color: "#fff", letterSpacing: "-0.3px",
            }}>
              You're subscribed!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, margin: 0 }}>
              Welcome to the Orgofresh family. Check your inbox for a welcome gift 🎁
            </p>
          </div>
        ) : (
          <>
            <h2 style={{
              margin: "0 0 12px", fontSize: 30, fontWeight: 800,
              color: "#fff", letterSpacing: "-0.4px",
            }}>
              Never Miss a Deal!
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.45)", fontSize: 15,
              margin: "0 auto 32px", maxWidth: 440, lineHeight: 1.6,
            }}>
              Subscribe to get the latest offers, new arrivals, and exclusive
              discounts delivered straight to your inbox.
            </p>

            {/* Input row */}
            <form
              onSubmit={handleSubscribe}
              style={{
                display: "flex", gap: 10,
                maxWidth: 460, margin: "0 auto",
              }}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                style={{
                  flex: 1, padding: "14px 18px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12, fontSize: 14, color: "#fff",
                  outline: "none", fontFamily: "inherit",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(250,204,21,0.5)"}
                onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "14px 24px", borderRadius: 12,
                  background: loading
                    ? "rgba(250,204,21,0.4)"
                    : "linear-gradient(135deg, #FACC15, #EAB308)",
                  color: "#0F172A", border: "none",
                  fontWeight: 700, fontSize: 14,
                  cursor: loading ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap", flexShrink: 0,
                  boxShadow: loading ? "none" : "0 4px 14px rgba(250,204,21,0.3)",
                  fontFamily: "inherit",
                }}
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </form>

            <p style={{
              marginTop: 14, fontSize: 12,
              color: "rgba(255,255,255,0.22)",
            }}>
              No spam, ever. Unsubscribe anytime.
            </p>
          </>
        )}

      </div>
    </div>
  );
};

export default NewsLetter;
