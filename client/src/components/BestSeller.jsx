import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {
  const { products, navigate } = useAppContext();

  const bestSellers = products.filter((p) => p.inStock).slice(0, 5);

  if (bestSellers.length === 0) return null;

  return (
    <div style={{ marginTop: 64 }}>

      <div style={{
        display: "flex", alignItems: "flex-end",
        justifyContent: "space-between", marginBottom: 24,
        flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <p style={{
            margin: "0 0 6px", fontSize: 12, fontWeight: 700,
            color: "#16A34A", textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}>
            🏆 Top Picks
          </p>
          <h2 style={{
            margin: 0, fontSize: 28, fontWeight: 800,
            color: "#0F172A", letterSpacing: "-0.3px",
          }}>
            Best Sellers
          </h2>
          <div style={{
            width: 48, height: 3, background: "#FACC15",
            borderRadius: 2, marginTop: 8,
          }} />
        </div>

        <button
          onClick={() => { navigate("/products"); scrollTo(0, 0); }}
          style={{
            padding: "9px 20px", borderRadius: 10,
            border: "1.5px solid #E2E8F0",
            background: "#fff", color: "#374151",
            fontWeight: 600, fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.15s", fontFamily: "inherit",
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = "#16A34A";
            e.currentTarget.style.color = "#16A34A";
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = "#E2E8F0";
            e.currentTarget.style.color = "#374151";
          }}
        >
          View All →
        </button>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 16,
      }}
        className="bestseller-grid">
        {bestSellers.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .bestseller-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .bestseller-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
};

export default BestSeller;
