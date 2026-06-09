import React from "react";
import { assets, features } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const BottomBanner = () => {
  const { navigate } = useAppContext();

  const highlights = [
    {
      icon: "🚀",
      title: "30-Min Delivery",
      desc: "Lightning fast delivery to your doorstep",
      accent: "#EDE9FE",
      color: "#7C3AED",
    },
    {
      icon: "🌿",
      title: "100% Organic",
      desc: "Sourced directly from certified local farms",
      accent: "#DCFCE7",
      color: "#16A34A",
    },
    {
      icon: "💰",
      title: "Best Prices",
      desc: "Unbeatable prices with no hidden charges",
      accent: "#FEF9C3",
      color: "#CA8A04",
    },
    {
      icon: "❤️",
      title: "Trusted by 10K+",
      desc: "Thousands of happy customers every month",
      accent: "#FFE4E6",
      color: "#E11D48",
    },
  ];

  return (
    <div style={{
      marginTop: 72,
      fontFamily: "'Outfit', 'Roboto', sans-serif",
    }}>

      <div style={{ position: "relative", borderRadius: 24, overflow: "hidden" }}>
        <img
          src={assets.bottom_banner_image}
          alt="Fresh organic groceries"
          className="bottom-banner-desktop"
          style={{ width: "100%", display: "block", maxHeight: 420, objectFit: "cover" }}
        />
        <img
          src={assets.bottom_banner_image_sm}
          alt="Fresh organic groceries"
          className="bottom-banner-mobile"
          style={{ width: "100%", display: "none" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, transparent 60%)",
          display: "flex", alignItems: "center",
          padding: "0 48px",
        }}>
          <div style={{ maxWidth: 380 }}>
            <p style={{
              margin: "0 0 10px", fontSize: 12, fontWeight: 700,
              color: "#FACC15", textTransform: "uppercase", letterSpacing: "0.12em",
            }}>
              🌱 Farm to Table
            </p>
            <h2 style={{
              margin: "0 0 14px", fontSize: 32, fontWeight: 800,
              color: "#fff", lineHeight: 1.25, letterSpacing: "-0.5px",
            }}>
              Fresh. Organic.<br />Delivered Fast.
            </h2>
            <p style={{
              margin: "0 0 24px", fontSize: 14,
              color: "rgba(255,255,255,0.75)", lineHeight: 1.6,
            }}>
              Chemical-free produce sourced directly from local
              farmers — pure, safe, and truly fresh.
            </p>
            <button
              onClick={() => { navigate("/products"); scrollTo(0, 0); }}
              style={{
                padding: "12px 28px",
                background: "linear-gradient(135deg, #16A34A, #22C55E)",
                color: "#fff", border: "none", borderRadius: 12,
                fontWeight: 700, fontSize: 14, cursor: "pointer",
                boxShadow: "0 4px 16px rgba(22,163,74,0.4)",
                fontFamily: "inherit",
              }}
            >
              Shop Now →
            </button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 48 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{
            margin: "0 0 8px", fontSize: 12, fontWeight: 700,
            color: "#16A34A", textTransform: "uppercase", letterSpacing: "0.12em",
          }}>
            Why Orgofresh?
          </p>
          <h2 style={{
            margin: 0, fontSize: 28, fontWeight: 800,
            color: "#0F172A", letterSpacing: "-0.3px",
          }}>
            Why Choose Us
          </h2>
          <div style={{
            width: 48, height: 3, background: "#FACC15",
            borderRadius: 2, margin: "10px auto 0",
          }} />
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
        }}
          className="why-choose-grid">
          {highlights.map((item, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                border: "1px solid #F1F5F9",
                borderRadius: 20,
                padding: "28px 24px",
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "default",
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: item.accent,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, margin: "0 auto 16px",
              }}>
                {item.icon}
              </div>

              <h3 style={{
                margin: "0 0 8px", fontSize: 16, fontWeight: 700,
                color: "#0F172A",
              }}>
                {item.title}
              </h3>
              <p style={{
                margin: 0, fontSize: 13, color: "#64748B", lineHeight: 1.6,
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .bottom-banner-desktop { display: none !important; }
          .bottom-banner-mobile  { display: block !important; }
          .why-choose-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
};

export default BottomBanner;
