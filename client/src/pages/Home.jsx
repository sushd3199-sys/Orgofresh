import React from "react";
import MainBanner from "../components/MainBanner";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import BottomBanner from "../components/BottomBanner";
import NewsLetter from "../components/Newsletter";
import SaleBanner from "../components/SaleBanner";
import { useAppContext } from "../context/AppContext";

const StatsBar = () => {
  const stats = [
    { icon: "🚀", label: "30-Min Delivery",    sub: "In selected areas"      },
    { icon: "🌿", label: "100% Organic",        sub: "Certified fresh produce" },
    { icon: "🏪", label: "500+ Products",       sub: "Across 7 categories"    },
    { icon: "⭐", label: "10,000+ Customers",   sub: "Trust Orgofresh"        },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 0,
      background: "#fff",
      borderRadius: 16,
      border: "1px solid #F1F5F9",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      margin: "24px 0 0",
      overflow: "hidden",
    }}
      className="stats-bar">
      {stats.map((s, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "18px 20px",
          borderRight: i < stats.length - 1 ? "1px solid #F1F5F9" : "none",
        }}>
          <span style={{ fontSize: 28 }}>{s.icon}</span>
          <div>
            <p style={{
              margin: 0, fontSize: 14, fontWeight: 700, color: "#0F172A",
            }}>
              {s.label}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "#94A3B8" }}>
              {s.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};


const DealsSection = () => {
  const { navigate } = useAppContext();

  const deals = [
    {
      title: "Fresh Vegetables",
      sub: "Farm to table daily",
      badge: "Up to 25% OFF",
      bg: "linear-gradient(135deg, #DCFCE7, #BBF7D0)",
      accent: "#16A34A",
      emoji: "🥦",
      path: "/products/vegetables",
    },
    {
      title: "Exotic Fruits",
      sub: "Handpicked seasonal fruits",
      badge: "Starting ₹49",
      bg: "linear-gradient(135deg, #FEF9C3, #FDE68A)",
      accent: "#CA8A04",
      emoji: "🍎",
      path: "/products/fruits",
    },
    {
      title: "Instant Food",
      sub: "Ready in minutes",
      badge: "Buy 2 Get 1 Free",
      bg: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
      accent: "#7C3AED",
      emoji: "🍜",
      path: "/products/instant",
    },
  ];

  return (
    <div style={{ marginTop: 64, fontFamily: "'Outfit', 'Roboto', sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{
          margin: "0 0 6px", fontSize: 12, fontWeight: 700,
          color: "#16A34A", textTransform: "uppercase", letterSpacing: "0.12em",
        }}>
          🔥 Limited Time
        </p>
        <h2 style={{
          margin: 0, fontSize: 28, fontWeight: 800,
          color: "#0F172A", letterSpacing: "-0.3px",
        }}>
          Today's Deals
        </h2>
        <div style={{
          width: 48, height: 3, background: "#FACC15",
          borderRadius: 2, marginTop: 8,
        }} />
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
      }}
        className="deals-grid">
        {deals.map((deal, i) => (
          <div
            key={i}
            onClick={() => { navigate(deal.path); scrollTo(0, 0); }}
            style={{
              background: deal.bg,
              borderRadius: 20, padding: "28px 24px",
              cursor: "pointer", position: "relative", overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.04)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.1)";
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >

            <span style={{
              display: "inline-block", fontSize: 11, fontWeight: 700,
              color: "#fff", background: deal.accent,
              padding: "3px 10px", borderRadius: 20, marginBottom: 12,
            }}>
              {deal.badge}
            </span>

            <h3 style={{
              margin: "0 0 6px", fontSize: 18, fontWeight: 800,
              color: "#0F172A",
            }}>
              {deal.title}
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#475569" }}>
              {deal.sub}
            </p>

            <span style={{
              fontSize: 13, fontWeight: 700, color: deal.accent,
              display: "flex", alignItems: "center", gap: 4,
            }}>
              Shop Now →
            </span>

     
            <span style={{
              position: "absolute", right: 16, bottom: 10,
              fontSize: 56, opacity: 0.3, lineHeight: 1,
              pointerEvents: "none",
            }}>
              {deal.emoji}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .deals-grid { grid-template-columns: 1fr !important; }
          .stats-bar  { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
};

const Home = () => {
  return (
    <>
  
      <SaleBanner />

      <div style={{
        paddingLeft:  "clamp(16px, 5vw, 128px)",
        paddingRight: "clamp(16px, 5vw, 128px)",
      }}>

        <MainBanner />
        <StatsBar />
        <Categories />
        <DealsSection />
        <BestSeller />
        <BottomBanner />
        <NewsLetter />

      </div>
    </>
  );
};

export default Home;
