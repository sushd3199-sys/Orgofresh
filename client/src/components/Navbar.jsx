import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import DeliveryInfo from "./DeliveryInfo";

const Navbar = () => {
  const [open, setOpen]               = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const {
    user, setUser, setShowUserLogin,
    navigate, setSearchQuery, searchQuery,
    getCartCount, axios,
  } = useAppContext();

  const logOut = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success("Logged out successfully");
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) navigate("/products");
  }, [searchQuery]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-dropdown-wrap")) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const animatedTexts = [
    "Search Apples 🍎", "Search Almond milk 🥛", "Search Soy milk 🥛",
    "Search Bread 🍞", "Search Noodles 🍜", "Search Mango 🥭",
    "Search Garlic🧄", "Search Grapes 🍇", "Search Kidney beans 🫘",
    "Search lettuce 🥬", "Search Potato 🥔", "Search green pea 🫛",
    "Search Banana 🍌", "Search Tomato 🍅", "Search Cold drink 🥤",
  ];

  // ── Profile menu items ────────────────────────────────────────────────────
  const profileMenuItems = [
    {
      icon: "📦",
      label: "My Orders",
      sub: "Track your orders",
      action: () => { navigate("/my-orders"); setProfileOpen(false); },
    },
    {
      icon: "📞",
      label: "Help & Support",
      sub: "Call or chat with us",
      action: () => { navigate("/contact"); setProfileOpen(false); },
    },
    {
      icon: "🔍",
      label: "Order Status",
      sub: "Check delivery status",
      action: () => { navigate("/my-orders"); setProfileOpen(false); },
    },
    {
      icon: "↩️",
      label: "Return & Refund",
      sub: "Easy returns within 24h",
      action: () => { navigate("/return-refund"); setProfileOpen(false); },
    },
  ];

  return (
    <nav className="relative z-50 bg-linear-to-r from-gray-100 via-yellow-300 to-gray-200 border-gray-200">

      {/* ── TOP ROW ── */}
      <div className="flex items-center px-6 md:px-16 lg:px-24 xl:px-32 py-4">

        {/* LEFT — Logo + Delivery */}
        <div className="flex items-center gap-4">
          <NavLink to="/">
            <img className="h-9" src={assets.logofavi} alt="Orgofresh" />
          </NavLink>
          <div className="hidden md:block">
            <DeliveryInfo />
          </div>
        </div>

        {/* DESKTOP SEARCH */}
        <div className="hidden md:flex flex-1 mx-10">
          <div className="relative w-full max-w-2xl">
            <input
              type="text" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-md py-3 px-4 pr-12 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-purple-200"
            />
            {!searchQuery && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none overflow-hidden h-6">
                <div className="animate-slide-vertical text-gray-400 text-sm">
                  {[...animatedTexts, ...animatedTexts].map((text, i) => (
                    <div key={i} className="h-6 flex items-center">{text}</div>
                  ))}
                </div>
              </div>
            )}
            <img src={assets.search_icon} alt="search"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60" />
          </div>
        </div>

        {/* RIGHT — Nav + Cart + Profile */}
        <div className="ml-auto flex items-center gap-6">

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/products">All Products</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>

          {/* Cart */}
          <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
            <img src={assets.cart_green} alt="cart" className="w-8 h-8 opacity-80" />
            <button className="absolute -top-2 left-5 text-xs text-white bg-yellow-500 w-[18px] h-[18px] rounded-full">
              {getCartCount()}
            </button>
          </div>

          {/* Login / Profile */}
          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className="hidden md:block px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md font-medium transition"
            >
              Login
            </button>
          ) : (
            // ── Profile dropdown ──────────────────────────────────────────
            <div className="relative profile-dropdown-wrap">
              <img
                src={assets.profile_icon_img}
                className="w-9 h-9 cursor-pointer rounded-full"
                alt="profile"
                onClick={() => setProfileOpen(!profileOpen)}
              />

              {/* Dropdown */}
              {profileOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 10px)", right: 0,
                  background: "#fff", borderRadius: 16,
                  border: "1px solid #F1F5F9",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                  width: 220, zIndex: 50, overflow: "hidden",
                  fontFamily: "'Outfit','Roboto',sans-serif",
                }}>

                  {/* User info header */}
                  <div style={{
                    background: "linear-gradient(135deg,#16A34A,#22C55E)",
                    padding: "14px 16px",
                  }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff" }}>
                      {user.name}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: "rgba(255,255,255,0.75)" }}>
                      {user.email}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: "8px 0" }}>
                    {profileMenuItems.map((item, i) => (
                      <button
                        key={i}
                        onClick={item.action}
                        style={{
                          width: "100%", textAlign: "left",
                          padding: "10px 16px", border: "none",
                          background: "none", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 10,
                          transition: "background 0.15s",
                          fontFamily: "inherit",
                        }}
                        onMouseOver={e => e.currentTarget.style.background = "#F8FAFC"}
                        onMouseOut={e  => e.currentTarget.style.background = "none"}
                      >
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                        <div>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
                            {item.label}
                          </p>
                          <p style={{ margin: 0, fontSize: 11, color: "#94A3B8" }}>
                            {item.sub}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Quick help strip */}
                  <div style={{
                    margin: "0 12px 8px",
                    background: "#F0FDF4", border: "1px solid #BBF7D0",
                    borderRadius: 10, padding: "10px 12px",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span style={{ fontSize: 16 }}>📞</span>
                    <div>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#16A34A" }}>
                        Need help?
                      </p>
                      <a
                        href="tel:+919101903549"
                        style={{ fontSize: 12, color: "#0F172A", fontWeight: 600,
                          textDecoration: "none" }}
                      >
                        +91 9101903549
                      </a>
                    </div>
                  </div>

                  {/* Divider + Logout */}
                  <div style={{ borderTop: "1px solid #F1F5F9", padding: "8px 0 6px" }}>
                    <button
                      onClick={() => { logOut(); setProfileOpen(false); }}
                      style={{
                        width: "100%", textAlign: "left",
                        padding: "10px 16px", border: "none",
                        background: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 10,
                        color: "#E11D48", fontFamily: "inherit",
                        transition: "background 0.15s",
                      }}
                      onMouseOver={e => e.currentTarget.style.background = "#FFF1F2"}
                      onMouseOut={e  => e.currentTarget.style.background = "none"}
                    >
                      <span style={{ fontSize: 18 }}>🚪</span>
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Logout</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#FDA4AF" }}>
                          Sign out of your account
                        </p>
                      </div>
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button onClick={() => setOpen(!open)}>
              <img src={assets.menu_icon} alt="menu" />
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE SEARCH ── */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <input
            type="text" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md py-2.5 px-4 pr-10 text-sm outline-none focus:border-green-600"
          />
          {!searchQuery && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none overflow-hidden h-6">
              <div className="animate-slide-vertical text-gray-400 text-sm">
                {[...animatedTexts, ...animatedTexts].map((text, i) => (
                  <div key={i} className="h-6 flex items-center">{text}</div>
                ))}
              </div>
            </div>
          )}
          <img src={assets.search_icon} alt="search"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60" />
        </div>
      </div>

      {/* ── MOBILE DROPDOWN ── */}
      {open && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 flex flex-col gap-3 text-sm">
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>All Products</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>
          <NavLink to="/my-orders" onClick={() => setOpen(false)}>My Orders</NavLink>
          <NavLink to="/return-refund" onClick={() => setOpen(false)}>Return & Refund</NavLink>

          <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 10 }}>
            {!user ? (
              <button
                onClick={() => { setOpen(false); setShowUserLogin(true); }}
                className="w-full px-4 py-2 bg-yellow-500 text-white rounded-md font-medium"
              >
                Login / Sign Up
              </button>
            ) : (
              <>
                <div style={{
                  background: "#F0FDF4", borderRadius: 10, padding: "10px 12px",
                  marginBottom: 10, display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ fontSize: 16 }}>📞</span>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#16A34A" }}>Need help?</p>
                    <a href="tel:+919101903549"
                      style={{ fontSize: 12, color: "#0F172A", fontWeight: 600, textDecoration: "none" }}>
                      +91 9101903549
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => { logOut(); setOpen(false); }}
                  className="w-full px-4 py-2 bg-red-50 text-red-500 rounded-md font-medium border border-red-100"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
