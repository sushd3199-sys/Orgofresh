import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Contact = () => {
  const { axios } = useAppContext();

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [loading, setLoading]   = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ── Contact submit ──────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/contact", form);
      if (data.success) {
        toast.success("Message sent! We'll get back to you soon 🎉");
        setForm({ name: "", email: "", message: "" });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
      } else {
        toast.error("Failed to send message");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── Subscribe ───────────────────────────────────────────────────────────────
  const handleSubscribe = async () => {
    if (!subscribeEmail) return toast.error("Enter your email first");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(subscribeEmail)) return toast.error("Enter a valid email");

    try {
      setSubLoading(true);
      const { data } = await axios.post("/api/subscribe", { email: subscribeEmail });
      if (data.success) {
        toast.success("Subscribed! 🎉 Check your inbox");
        setSubscribeEmail("");
      } else {
        toast.error("Subscription failed");
      }
    } catch {
      toast.error("Error subscribing");
    } finally {
      setSubLoading(false);
    }
  };

  const S = {
    page: {
      marginTop: 40,
      marginBottom: 80,
      fontFamily: "'Outfit', 'Roboto', sans-serif",
    },

    // ── Page header ──
    pageHeader: {
      marginBottom: 48,
    },
    eyebrow: {
      fontSize: 12, fontWeight: 700, color: "#16A34A",
      textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10,
    },
    title: {
      fontSize: 36, fontWeight: 800, color: "#0F172A",
      margin: "0 0 12px", letterSpacing: "-0.5px",
    },
    titleAccent: { color: "#16A34A" },
    subtitle: { fontSize: 15, color: "#64748B", maxWidth: 480, lineHeight: 1.6 },

    // ── Main grid ──
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1.4fr",
      gap: 40,
      alignItems: "start",
    },

    // ── Info column ──
    infoCol: { display: "flex", flexDirection: "column", gap: 20 },

    infoCard: {
      background: "#fff",
      border: "1px solid #F1F5F9",
      borderRadius: 20,
      padding: "24px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    },

    infoItem: {
      display: "flex", alignItems: "flex-start", gap: 14,
      padding: "14px 0",
      borderBottom: "1px solid #F8FAFC",
    },
    infoItemLast: {
      display: "flex", alignItems: "flex-start", gap: 14,
      padding: "14px 0 0",
    },
    infoIcon: {
      width: 40, height: 40, borderRadius: 12,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 18, flexShrink: 0,
    },
    infoLabel: { fontSize: 11, fontWeight: 700, color: "#94A3B8",
      textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 },
    infoValue: { fontSize: 14, color: "#0F172A", fontWeight: 500, lineHeight: 1.5 },

    // Map
    mapWrapper: {
      borderRadius: 20, overflow: "hidden",
      border: "1px solid #F1F5F9",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      height: 200,
    },

    // ── Form column ──
    formCard: {
      background: "#fff",
      border: "1px solid #F1F5F9",
      borderRadius: 20,
      padding: "32px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    },
    formTitle: {
      fontSize: 20, fontWeight: 700, color: "#0F172A", margin: "0 0 24px",
    },

    label: {
      display: "block", fontSize: 12, fontWeight: 700,
      color: "#64748B", marginBottom: 8,
      textTransform: "uppercase", letterSpacing: "0.06em",
    },
    input: {
      width: "100%", padding: "12px 16px",
      border: "1px solid #E2E8F0", borderRadius: 12,
      fontSize: 14, color: "#0F172A", outline: "none",
      background: "#FAFAFA", boxSizing: "border-box",
      transition: "border-color 0.2s, background 0.2s",
      fontFamily: "inherit",
    },
    textarea: {
      width: "100%", padding: "12px 16px",
      border: "1px solid #E2E8F0", borderRadius: 12,
      fontSize: 14, color: "#0F172A", outline: "none",
      background: "#FAFAFA", boxSizing: "border-box",
      resize: "vertical", minHeight: 120,
      transition: "border-color 0.2s, background 0.2s",
      fontFamily: "inherit",
    },

    submitBtn: (loading) => ({
      width: "100%", padding: "14px",
      background: loading
        ? "#86EFAC"
        : "linear-gradient(135deg, #16A34A, #22C55E)",
      color: "#fff", border: "none", borderRadius: 12,
      fontSize: 15, fontWeight: 700,
      cursor: loading ? "not-allowed" : "pointer",
      boxShadow: loading ? "none" : "0 4px 14px rgba(22,163,74,0.35)",
      display: "flex", alignItems: "center",
      justifyContent: "center", gap: 8, transition: "all 0.2s",
      marginTop: 8,
    }),

    successBanner: {
      background: "#F0FDF4", border: "1px solid #BBF7D0",
      borderRadius: 12, padding: "14px 18px", marginBottom: 20,
      display: "flex", alignItems: "center", gap: 10,
    },

    // ── Subscribe section ──
    subscribeSec: {
      marginTop: 60,
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
      borderRadius: 24, padding: "48px 40px",
      textAlign: "center", position: "relative", overflow: "hidden",
    },
    subGlow1: {
      position: "absolute", top: -60, right: -60,
      width: 200, height: 200, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(22,163,74,0.15) 0%, transparent 70%)",
      pointerEvents: "none",
    },
    subGlow2: {
      position: "absolute", bottom: -40, left: -40,
      width: 160, height: 160, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(250,204,21,0.08) 0%, transparent 70%)",
      pointerEvents: "none",
    },
    subTitle: {
      fontSize: 28, fontWeight: 800, color: "#fff",
      margin: "0 0 10px", letterSpacing: "-0.3px",
      position: "relative", zIndex: 1,
    },
    subText: {
      fontSize: 15, color: "rgba(255,255,255,0.45)",
      margin: "0 auto 28px", maxWidth: 400,
      position: "relative", zIndex: 1,
    },
    subRow: {
      display: "flex", gap: 10, maxWidth: 460,
      margin: "0 auto", position: "relative", zIndex: 1,
    },
    subInput: {
      flex: 1, padding: "13px 18px",
      background: "rgba(255,255,255,0.07)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 12, fontSize: 14, color: "#fff",
      outline: "none", fontFamily: "inherit",
    },
    subBtn: (loading) => ({
      padding: "13px 24px", borderRadius: 12,
      background: loading
        ? "rgba(250,204,21,0.5)"
        : "linear-gradient(135deg, #FACC15, #EAB308)",
      color: "#0F172A", border: "none", fontWeight: 700,
      fontSize: 14, cursor: loading ? "not-allowed" : "pointer",
      whiteSpace: "nowrap", flexShrink: 0,
      boxShadow: loading ? "none" : "0 4px 14px rgba(250,204,21,0.3)",
    }),
  };

  const contactItems = [
    {
      icon: "📍", bg: "#F0FDF4", color: "#16A34A",
      label: "Our Office",
      value: "Orgofresh Pvt Ltd\nPithakowa, NH52 Tezpur-Mangaldoi Road\nTezpur, Assam 784001, India",
    },
    {
      icon: "📞", bg: "#EFF6FF", color: "#3B82F6",
      label: "Phone",
      value: "+91 9101903549",
    },
    {
      icon: "✉️", bg: "#FFF7ED", color: "#EA580C",
      label: "Email",
      value: "support@orgofresh.com",
    },
    {
      icon: "⏰", bg: "#F5F3FF", color: "#7C3AED",
      label: "Working Hours",
      value: "Mon – Sat: 8:00 AM – 8:00 PM\nSunday: 9:00 AM – 5:00 PM",
    },
  ];

  return (
    <div style={S.page}>

      {/* ── Page header ── */}
      <div style={S.pageHeader}>
        <p style={S.eyebrow}>Get in touch</p>
        <h1 style={S.title}>
          Contact <span style={S.titleAccent}>Us</span>
        </h1>
        <p style={S.subtitle}>
          Have a question, feedback, or need help with your order?
          We'd love to hear from you. Our team responds within 24 hours.
        </p>
      </div>

      {/* ── Main grid ── */}
      <div style={S.grid}>

        {/* LEFT — Info + Map */}
        <div style={S.infoCol}>
          <div style={S.infoCard}>
            {contactItems.map((item, i) => (
              <div
                key={i}
                style={i === contactItems.length - 1 ? S.infoItemLast : S.infoItem}
              >
                <div style={{ ...S.infoIcon, background: item.bg }}>
                  {item.icon}
                </div>
                <div>
                  <p style={S.infoLabel}>{item.label}</p>
                  {item.value.split("\n").map((line, j) => (
                    <p key={j} style={{ ...S.infoValue, margin: j === 0 ? 0 : "2px 0 0" }}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Map */}
          <div style={S.mapWrapper}>
            <iframe
              title="Orgofresh Location"
              src="https://maps.google.com/maps?q=tezpur+assam+india&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>

        {/* RIGHT — Form */}
        <div style={S.formCard}>

          {/* Success banner */}
          {submitted && (
            <div style={S.successBanner}>
              <span style={{ fontSize: 20 }}>✅</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: "#15803D", fontSize: 14 }}>
                  Message sent successfully!
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#16A34A" }}>
                  We'll get back to you within 24 hours.
                </p>
              </div>
            </div>
          )}

          <p style={S.formTitle}>Send us a message</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Name + Email row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={S.label}>Your Name</label>
                <input
                  type="text" name="name" placeholder="Rahul Sharma"
                  value={form.name} onChange={handleChange} required
                  style={S.input}
                  onFocus={e => { e.target.style.borderColor = "#16A34A"; e.target.style.background = "#fff"; }}
                  onBlur={e  => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#FAFAFA"; }}
                />
              </div>
              <div>
                <label style={S.label}>Email Address</label>
                <input
                  type="email" name="email" placeholder="rahul@email.com"
                  value={form.email} onChange={handleChange} required
                  style={S.input}
                  onFocus={e => { e.target.style.borderColor = "#16A34A"; e.target.style.background = "#fff"; }}
                  onBlur={e  => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#FAFAFA"; }}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label style={S.label}>Your Message</label>
              <textarea
                name="message" placeholder="Write your message here..."
                value={form.message} onChange={handleChange} required
                style={S.textarea}
                onFocus={e => { e.target.style.borderColor = "#16A34A"; e.target.style.background = "#fff"; }}
                onBlur={e  => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#FAFAFA"; }}
              />
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={S.submitBtn(loading)}>
              {loading ? (
                <>
                  <span style={{
                    width: 16, height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff", borderRadius: "50%",
                    display: "inline-block",
                    animation: "contactSpin 0.7s linear infinite",
                  }} />
                  Sending...
                </>
              ) : "Send Message →"}
            </button>

          </form>

          {/* Quick contact note */}
          <div style={{
            marginTop: 20, display: "flex", alignItems: "center",
            gap: 8, justifyContent: "center",
          }}>
            <span style={{ fontSize: 13 }}>⚡</span>
            <p style={{ margin: 0, fontSize: 12, color: "#94A3B8" }}>
              Usually responds within a few hours during business days
            </p>
          </div>

        </div>
      </div>

      {/* ── Subscribe section ── */}
      <div style={S.subscribeSec}>
        <div style={S.subGlow1} />
        <div style={S.subGlow2} />

        <p style={{ ...S.eyebrow, color: "#FACC15", position: "relative", zIndex: 1 }}>
          Stay Updated
        </p>
        <h2 style={S.subTitle}>Never Miss a Deal!</h2>
        <p style={S.subText}>
          Subscribe to get the latest offers, new arrivals, and exclusive discounts
          delivered straight to your inbox.
        </p>

        <div style={S.subRow}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={subscribeEmail}
            onChange={(e) => setSubscribeEmail(e.target.value)}
            style={S.subInput}
            onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
            onFocus={e => e.target.style.borderColor = "rgba(250,204,21,0.4)"}
            onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
          />
          <button
            onClick={handleSubscribe}
            disabled={subLoading}
            style={S.subBtn(subLoading)}
          >
            {subLoading ? "..." : "Subscribe"}
          </button>
        </div>

        <p style={{
          marginTop: 14, fontSize: 12,
          color: "rgba(255,255,255,0.25)",
          position: "relative", zIndex: 1,
        }}>
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>

      <style>{`
        @keyframes contactSpin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

    </div>
  );
};

export default Contact;