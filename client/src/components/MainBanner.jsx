import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const Mainbanner = () => {

  const banners = [
    {
      // SLIDES - 
      // desktop: assets.top_banner_bg,
      // mobile:  assets.top_banner_bg_sm,
      title:   "From Fresh Farms, Pure Goodness to Your Doorstep",
      offer:   null,
      offerColor: null,
      desktop: {
        img: assets.top_banner_bg,
        textSide: "left",           
        verticalAlign: "center",   
        textColor: "#1a1a1a",
        overlayGradient: "linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.4) 45%, transparent 70%)",
        mobileBg: assets.top_banner_bg_sm,
        mobileOverlay: "linear-gradient(0deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
        mobileTextColor: "#fff",
      },
    },
    {
      desktop: {
        img: assets.beverages,
        textSide: "right",
        verticalAlign: "center",
        textColor: "#1a1a1a",
        overlayGradient: "linear-gradient(270deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.45) 45%, transparent 70%)",
        mobileBg: assets.beverages_sm,
        mobileOverlay: "linear-gradient(0deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)",
        mobileTextColor: "#fff",
      },
      title: "Refresh Your Day",
      offer: "🥤 Flat 20% OFF on Summer Drinks",
      offerColor: "#7C3AED",
    },
    {
      desktop: {
        img: assets.instant,
        textSide: "right",
        verticalAlign: "center",
        textColor: "#1a1a1a",
        overlayGradient: "linear-gradient(270deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.4) 45%, transparent 70%)",
        mobileBg: assets.instant_sm,
        mobileOverlay: "linear-gradient(0deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)",
        mobileTextColor: "#fff",
      },
      title: "Instant Food for Busy Days",
      offer: "⚡ Save Your Time & Money",
      offerColor: "#EA580C",
    },
  ];

  return (
    <div className="relative w-full" style={{ marginTop: 0 }}>
      <Swiper
        modules={[Autoplay, Pagination]}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="w-full banner-swiper"
      >
        {banners.map((banner, index) => {
          const cfg = banner.desktop;
          const isLeft   = cfg.textSide === "left";
          const isRight  = cfg.textSide === "right";
          const isCenter = cfg.textSide === "center";

          return (
            <SwiperSlide key={index}>

              {/* ── DESKTOP ── */}
              <div className="hidden md:block relative w-full">
                <img
                  src={cfg.img}
                  alt={banner.title}
                  style={{ width: "100%", display: "block", maxHeight: 520, objectFit: "cover" }}
                />

                {/* Directional gradient overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: cfg.overlayGradient,
                }} />

                {/* Text block */}
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center",
                  justifyContent: isLeft ? "flex-start" : isRight ? "flex-end" : "center",
                  padding: isLeft ? "0 0 0 5%" : isRight ? "0 4% 0 0" : "0",
                }}>
                  <div style={{
                    maxWidth: 420,
                    textAlign: isLeft ? "left" : isRight ? "right" : "center",
                    padding: "24px 32px",
                  }}>

                    {/* Offer pill */}
                    {banner.offer && (
                      <div style={{
                        display: "inline-block",
                        fontSize: 13, fontWeight: 700,
                        color: banner.offerColor || "#7C3AED",
                        background: "rgba(255,255,255,0.85)",
                        border: `1.5px solid ${banner.offerColor || "#7C3AED"}30`,
                        padding: "5px 14px", borderRadius: 20,
                        marginBottom: 14, backdropFilter: "blur(4px)",
                      }}>
                        {banner.offer}
                      </div>
                    )}

                    {/* Title */}
                    <h1 style={{
                      fontSize: "clamp(22px, 2.8vw, 42px)",
                      fontWeight: 800,
                      color: cfg.textColor,
                      lineHeight: 1.2,
                      letterSpacing: "-0.5px",
                      margin: "0 0 20px",
                      fontFamily: "'Outfit', 'Roboto', sans-serif",
                      textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                    }}>
                      {banner.title}
                    </h1>

                    {/* Buttons */}
                    <div style={{
                      display: "flex", gap: 12, flexWrap: "wrap",
                      justifyContent: isLeft ? "flex-start" : isRight ? "flex-end" : "center",
                    }}>
                      <Link to="/products" style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "12px 24px",
                        background: "linear-gradient(135deg, #FACC15, #EAB308)",
                        color: "#1a1a1a", borderRadius: 10,
                        fontWeight: 700, fontSize: 15,
                        textDecoration: "none",
                        boxShadow: "0 4px 14px rgba(250,204,21,0.4)",
                        transition: "transform 0.2s",
                      }}>
                        Order now
                        <img src={assets.black_arrow_icon} className="w-4" alt="" />
                      </Link>

                      <Link to="/products" style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "12px 20px",
                        background: "rgba(255,255,255,0.7)",
                        backdropFilter: "blur(4px)",
                        color: "#374151", borderRadius: 10,
                        fontWeight: 600, fontSize: 14,
                        textDecoration: "none",
                        border: "1px solid rgba(0,0,0,0.08)",
                      }}>
                        Explore
                        <img src={assets.black_arrow_icon} alt="" className="w-3.5" />
                      </Link>
                    </div>

                  </div>
                </div>
              </div>

              {/* ── MOBILE ── */}
              <div className="md:hidden relative w-full">
                <img
                  src={cfg.mobileBg}
                  alt={banner.title}
                  style={{ width: "100%", display: "block", minHeight: 420, objectFit: "cover" }}
                />

                {/* Bottom-up gradient overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: cfg.mobileOverlay,
                }} />

                {/* Mobile text — always bottom-center */}
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column",
                  justifyContent: "flex-end", alignItems: "center",
                  padding: "0 20px 36px",
                  textAlign: "center",
                }}>

                  {/* Offer pill */}
                  {banner.offer && (
                    <div style={{
                      fontSize: 12, fontWeight: 700,
                      color: "#fff",
                      background: "rgba(124,58,237,0.85)",
                      padding: "4px 14px", borderRadius: 20,
                      marginBottom: 10,
                    }}>
                      {banner.offer}
                    </div>
                  )}

                  {/* Title */}
                  <h1 style={{
                    fontSize: "clamp(18px, 5.5vw, 26px)",
                    fontWeight: 800,
                    color: cfg.mobileTextColor,
                    lineHeight: 1.25,
                    letterSpacing: "-0.3px",
                    margin: "0 0 16px",
                    fontFamily: "'Outfit', 'Roboto', sans-serif",
                    textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                    maxWidth: 280,
                  }}>
                    {banner.title}
                  </h1>

                  {/* Mobile buttons */}
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <Link to="/products" style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "10px 20px",
                      background: "linear-gradient(135deg, #FACC15, #EAB308)",
                      color: "#1a1a1a", borderRadius: 10,
                      fontWeight: 700, fontSize: 13,
                      textDecoration: "none",
                      boxShadow: "0 3px 10px rgba(250,204,21,0.4)",
                    }}>
                      Order now →
                    </Link>

                    <Link to="/products" style={{
                      display: "flex", alignItems: "center",
                      padding: "10px 16px",
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(8px)",
                      color: "#fff", borderRadius: 10,
                      fontWeight: 600, fontSize: 13,
                      textDecoration: "none",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}>
                      Explore
                    </Link>
                  </div>

                </div>
              </div>

            </SwiperSlide>
          );
        })}
      </Swiper>

      <style>{`
        .banner-swiper .swiper-pagination {
          bottom: 10px !important;
        }
        .banner-swiper .swiper-pagination-bullet {
          background: #fff !important;
          opacity: 0.6;
          width: 8px;
          height: 8px;
        }
        .banner-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 22px;
          border-radius: 10px;
          background: #FACC15 !important;
        }
        @media (max-width: 768px) {
          .banner-swiper .swiper-pagination {
            bottom: 12px !important;
          }
        }
      `}
      </style>
    </div>
  );
};

export default Mainbanner;
