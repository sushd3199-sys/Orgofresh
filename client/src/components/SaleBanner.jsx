import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SaleBanner = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Set end time
  useEffect(() => {
    const getTarget = () => {
      const target = new Date();
      const day = target.getDay(); // 0=Sun, 6=Sat
      const daysUntilSunday = day === 0 ? 7 : 7 - day;
      target.setDate(target.getDate() + daysUntilSunday);
      target.setHours(23, 59, 59, 0);
      return target;
    };

    const target = getTarget();

    const interval = setInterval(() => {
      const now = new Date();
      const diff = target - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  // Single content block
  const content = (
    <div style={{
      display: "flex", alignItems: "center",
      gap: 28, paddingRight: 60, whiteSpace: "nowrap",
      fontSize: 13, fontWeight: 500,
    }}>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        🔥 <strong>Weekend Mega Sale!</strong>
      </span>

      <span style={{ color: "rgba(0,0,0,0.6)" }}>·</span>

      <span>
        Flat <strong>30% OFF</strong> on all Organic Products 🌿
      </span>

      <span style={{ color: "rgba(0,0,0,0.6)" }}>·</span>

      {/* Timer */}
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        ⏳ Ends in:
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 3,
          background: "rgba(0,0,0,0.12)", borderRadius: 6,
          padding: "2px 10px", fontWeight: 700, fontFamily: "monospace",
          fontSize: 13, letterSpacing: "0.05em",
        }}>
          {pad(timeLeft.hours)}h : {pad(timeLeft.minutes)}m : {pad(timeLeft.seconds)}s
        </span>
      </span>

      <span style={{ color: "rgba(0,0,0,0.6)" }}>·</span>

      <button
        onClick={() => navigate("/products")}
        style={{
          background: "#FACC15", color: "#1a1a1a",
          border: "none", borderRadius: 20,
          padding: "4px 16px", fontWeight: 700,
          fontSize: 12, cursor: "pointer",
          boxShadow: "0 2px 8px rgba(250,204,21,0.4)",
        }}
      >
        Shop Now →
      </button>
    </div>
  );
  
  return (
    <>
      <div style={{
        background: "linear-gradient(90deg, #a855f7 0%, #7c3aed 50%, #a855f7 100%)",
        color: "#fff", overflow: "hidden", position: "relative",
        height: 40, display: "flex", alignItems: "center",
      }}>
        {/* Duplicate content for seamless loop */}
        <div style={{
          display: "flex",
          animation: "salemarquee 22s linear infinite",
          willChange: "transform",
        }}>
          {content}
          {content}
          {content}
        </div>
      </div>

      <style>{`
        @keyframes salemarquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </>
  );
};

export default SaleBanner;
