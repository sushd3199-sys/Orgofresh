import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  sellers:   "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  orders:    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2 M9 12h6 M9 16h4",
  logout:    "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  plus:      "M12 5v14 M5 12h14",
  trash:     "M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6",
  check:     "M20 6L9 17l-5-5",
  eye:       "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8 M12 9a3 3 0 100 6 3 3 0 000-6",
  package:   "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  rupee:     "M6 3h12 M6 8h12 M6 13l8.5 8 M6 13h3a4 4 0 000-8",
};

// ─── Status badge ─────────────────────────────────────────────────────────────
const statusConfig = {
  "Order Placed":     { bg: "#EEF2FF", color: "#4F46E5", dot: "#4F46E5" },
  "Order Confirmed":  { bg: "#F0FDF4", color: "#16A34A", dot: "#16A34A" },
  "Out for Delivery": { bg: "#FFF7ED", color: "#EA580C", dot: "#EA580C" },
  "Delivered":        { bg: "#F0FDF4", color: "#15803D", dot: "#15803D" },
  "Cancelled":        { bg: "#FFF1F2", color: "#E11D48", dot: "#E11D48" },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { bg: "#F3F4F6", color: "#6B7280", dot: "#6B7280" };
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      display: "inline-flex", alignItems: "center", gap: 5,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {status}
    </span>
  );
};

// ─── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, accent }) => (
  <div style={{
    background: "#fff", borderRadius: 16, padding: "20px 24px",
    border: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 12,
      background: accent + "18", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icon d={icon} color={accent} size={22} />
    </div>
    <div>
      <p style={{ fontSize: 13, color: "#94A3B8", margin: 0, fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 700, color: "#0F172A", margin: "2px 0 0" }}>{value}</p>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminSellers = () => {
  const { axios, setAdmin, navigate } = useAppContext();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sellers, setSellers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  // ── Fetch sellers ──────────────────────────────────────────────────────────
  const fetchSellers = async () => {
    try {
      const { data } = await axios.get("/api/seller/admin/all-sellers");
      if (data.success) setSellers(data.sellers);
    } catch { toast.error("Error loading sellers"); }
  };

  // ── Fetch orders ───────────────────────────────────────────────────────────
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const { data } = await axios.get("/api/order/seller");
      if (data.success) setOrders(data.orders);
    } catch { toast.error("Error loading orders"); }
    finally { setLoadingOrders(false); }
  };

  useEffect(() => {
    fetchSellers();
    fetchOrders();
  }, []);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalRevenue = orders.filter(o => o.isPaid || o.paymentType === "COD")
    .reduce((sum, o) => sum + (o.amount || 0), 0);
  const pendingOrders = orders.filter(o =>
    !["Delivered", "Cancelled"].includes(o.status)).length;
  const deliveredOrders = orders.filter(o => o.status === "Delivered").length;

  // ── Create seller ──────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password)
      return toast.error("Fill all fields");
    try {
      const { data } = await axios.post("/api/seller/admin/create-seller", form);
      if (data.success) {
        toast.success("Seller created");
        setForm({ name: "", email: "", password: "" });
        fetchSellers();
      } else { toast.error(data.message || "Error"); }
    } catch { toast.error("Error creating seller"); }
  };

  // ── Delete seller ──────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this seller?")) return;
    try {
      const { data } = await axios.post("/api/seller/admin/delete-seller", { sellerId: id });
      if (data.success) { toast.success("Deleted"); fetchSellers(); }
      else toast.error(data.message);
    } catch { toast.error("Error"); }
  };

  // ── Update order status ────────────────────────────────────────────────────
  const handleStatusChange = async (orderId, status) => {
    setUpdatingOrder(orderId);
    try {
      const { data } = await axios.post("/api/order/update-status", { orderId, status });
      if (data.success) {
        toast.success("Status updated");
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      } else { toast.error(data.message); }
    } catch { toast.error("Error updating status"); }
    finally { setUpdatingOrder(null); }
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    const { data } = await axios.get("/api/seller/admin/logout");
    if (data.success) { setAdmin(false); navigate("/admin/login"); }
  };

  // ── Format address ─────────────────────────────────────────────────────────
  const formatAddress = (addr) => {
    if (!addr || typeof addr === "string") return addr || "—";
    const { firstName, lastName, street, city, state, country } = addr;
    return [firstName && `${firstName} ${lastName}`, street, city, state, country]
      .filter(Boolean).join(", ");
  };

  // ── Sidebar nav items ──────────────────────────────────────────────────────
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: icons.dashboard },
    { id: "sellers",   label: "Sellers",   icon: icons.sellers },
    { id: "orders",    label: "Orders",    icon: icons.orders,
      badge: pendingOrders > 0 ? pendingOrders : null },
  ];

  const S = {
    wrap: { display: "flex", minHeight: "100vh", fontFamily: "'Outfit', sans-serif", background: "#F8FAFC" },

    sidebar: {
      width: 220, background: "#0F172A", display: "flex", flexDirection: "column",
      padding: "28px 0", flexShrink: 0,
    },
    logo: { padding: "0 24px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)" },
    logoText: { color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" },
    logoSub: { color: "#64748B", fontSize: 11, marginTop: 2 },

    nav: { padding: "16px 12px", flex: 1 },
    navItem: (active) => ({
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 12px", borderRadius: 10, marginBottom: 4, cursor: "pointer",
      background: active ? "rgba(255,255,255,0.08)" : "transparent",
      color: active ? "#fff" : "#64748B",
      fontSize: 14, fontWeight: active ? 600 : 400,
      transition: "all 0.15s", border: "none", width: "100%", textAlign: "left",
    }),
    navBadge: {
      marginLeft: "auto", background: "#EF4444", color: "#fff",
      fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 20,
    },

    logoutBtn: {
      margin: "0 12px 8px", display: "flex", alignItems: "center", gap: 10,
      padding: "10px 12px", borderRadius: 10, cursor: "pointer",
      background: "transparent", color: "#64748B", fontSize: 14, border: "none",
      width: "calc(100% - 24px)", textAlign: "left",
    },

    main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
    header: {
      background: "#fff", borderBottom: "1px solid #F1F5F9",
      padding: "16px 32px", display: "flex", alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: { fontSize: 20, fontWeight: 700, color: "#0F172A" },
    headerSub: { fontSize: 13, color: "#94A3B8", marginTop: 2 },

    content: { padding: 32, flex: 1, overflowY: "auto" },

    grid3: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 },

    card: {
      background: "#fff", borderRadius: 16, border: "1px solid #F1F5F9",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    },
    cardHeader: {
      padding: "18px 24px", borderBottom: "1px solid #F8FAFC",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    },
    cardTitle: { fontSize: 15, fontWeight: 700, color: "#0F172A" },
    cardBody: { padding: 24 },

    input: {
      width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0",
      borderRadius: 10, fontSize: 14, outline: "none", color: "#0F172A",
      background: "#F8FAFC", boxSizing: "border-box",
    },
    label: { fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 6, display: "block" },

    btn: (variant = "primary") => ({
      padding: "10px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600,
      cursor: "pointer", border: "none", display: "inline-flex", alignItems: "center", gap: 6,
      ...(variant === "primary" ? { background: "#16A34A", color: "#fff" } :
          variant === "danger"  ? { background: "#FFF1F2", color: "#E11D48" } :
          { background: "#F1F5F9", color: "#475569" }),
    }),

    table: { width: "100%", borderCollapse: "collapse" },
    th: { padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700,
          color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em",
          borderBottom: "1px solid #F1F5F9" },
    td: { padding: "14px 16px", fontSize: 14, color: "#374151",
          borderBottom: "1px solid #F8FAFC", verticalAlign: "middle" },

    orderCard: {
      background: "#fff", border: "1px solid #F1F5F9", borderRadius: 14,
      marginBottom: 16, overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    },
    orderHeader: {
      padding: "12px 20px", background: "#F8FAFC",
      borderBottom: "1px solid #F1F5F9", display: "flex",
      alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
    },
    orderBody: { padding: "16px 20px" },
    select: {
      padding: "6px 12px", border: "1px solid #E2E8F0", borderRadius: 8,
      fontSize: 13, outline: "none", cursor: "pointer", background: "#fff", color: "#374151",
    },
  };

  const pageTitle = { dashboard: "Dashboard", sellers: "Seller Management", orders: "Orders" };
  const pageSub   = {
    dashboard: "Overview of your store",
    sellers:   "Manage seller accounts",
    orders:    `${orders.length} total orders`,
  };

  return (
    <div style={S.wrap}>
      {/* ── SIDEBAR ── */}
      <div style={S.sidebar}>
        <div style={S.logo}>
          <div style={S.logoText}>🥬 Orgofresh</div>
          <div style={S.logoSub}>Admin Panel</div>
        </div>

        <nav style={S.nav}>
          {navItems.map(item => (
            <button key={item.id} style={S.navItem(activeTab === item.id)}
              onClick={() => setActiveTab(item.id)}>
              <Icon d={item.icon} size={16} color={activeTab === item.id ? "#fff" : "#64748B"} />
              {item.label}
              {item.badge && <span style={S.navBadge}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <button style={S.logoutBtn} onClick={handleLogout}>
          <Icon d={icons.logout} size={16} color="#64748B" />
          Logout
        </button>
      </div>

      {/* ── MAIN ── */}
      <div style={S.main}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <div style={S.headerTitle}>{pageTitle[activeTab]}</div>
            <div style={S.headerSub}>{pageSub[activeTab]}</div>
          </div>
          <div style={{ fontSize: 13, color: "#94A3B8" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>

        <div style={S.content}>

          {/* ══════════════════════════════════════════════════════════════
              DASHBOARD TAB
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "dashboard" && (
            <>
              {/* Stats */}
              <div style={S.grid3}>
                <StatCard label="Total Orders"     value={orders.length}    icon={icons.orders}   accent="#4F46E5" />
                <StatCard label="Pending Orders"   value={pendingOrders}    icon={icons.package}  accent="#EA580C" />
                <StatCard label="Delivered"        value={deliveredOrders}  icon={icons.check}    accent="#16A34A" />
              </div>
              <div style={{ ...S.grid3, gridTemplateColumns: "1fr 1fr", marginBottom: 28 }}>
                <StatCard label="Total Revenue"    value={`₹${totalRevenue.toLocaleString("en-IN")}`} icon={icons.rupee}   accent="#0EA5E9" />
                <StatCard label="Active Sellers"   value={sellers.length}   icon={icons.sellers}  accent="#8B5CF6" />
              </div>

              {/* Recent orders preview */}
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <div style={S.cardTitle}>Recent Orders</div>
                  <button style={S.btn("secondary")} onClick={() => setActiveTab("orders")}>
                    View all →
                  </button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={S.table}>
                    <thead>
                      <tr>
                        {["Order ID", "Customer", "Amount", "Payment", "Status"].map(h => (
                          <th key={h} style={S.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order._id}>
                          <td style={{ ...S.td, fontFamily: "monospace", fontSize: 12, color: "#94A3B8" }}>
                            #{order._id.slice(-8).toUpperCase()}
                          </td>
                          <td style={S.td}>{formatAddress(order.address)?.split(",")[0] || "—"}</td>
                          <td style={{ ...S.td, fontWeight: 600 }}>₹{order.amount}</td>
                          <td style={S.td}>
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{
                                width: 6, height: 6, borderRadius: "50%",
                                background: order.isPaid ? "#16A34A" : "#F59E0B",
                                display: "inline-block",
                              }} />
                              {order.isPaid ? "Paid" : "Pending"}
                            </span>
                          </td>
                          <td style={S.td}><StatusBadge status={order.status} /></td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr><td colSpan={5} style={{ ...S.td, textAlign: "center", color: "#94A3B8", padding: 32 }}>
                          No orders yet
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ══════════════════════════════════════════════════════════════
              SELLERS TAB
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "sellers" && (
            <div style={S.grid2}>
              {/* Create seller */}
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <div style={S.cardTitle}>Add New Seller</div>
                </div>
                <div style={S.cardBody}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                      { label: "Full Name", key: "name", type: "text", ph: "John Doe" },
                      { label: "Email",     key: "email", type: "email", ph: "john@example.com" },
                      { label: "Password",  key: "password", type: "password", ph: "••••••••" },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={S.label}>{f.label}</label>
                        <input
                          type={f.type} placeholder={f.ph}
                          value={form[f.key]}
                          onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                          style={S.input}
                        />
                      </div>
                    ))}
                    <button style={{ ...S.btn("primary"), marginTop: 4 }} onClick={handleCreate}>
                      <Icon d={icons.plus} size={15} color="#fff" />
                      Create Seller
                    </button>
                  </div>
                </div>
              </div>

              {/* Seller list */}
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <div style={S.cardTitle}>All Sellers ({sellers.length})</div>
                </div>
                <div style={S.cardBody}>
                  {sellers.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8" }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>👤</div>
                      No sellers yet
                    </div>
                  ) : sellers.map(s => (
                    <div key={s._id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 0", borderBottom: "1px solid #F8FAFC",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%",
                          background: "#F0FDF4", display: "flex", alignItems: "center",
                          justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#16A34A",
                        }}>
                          {s.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{s.name}</div>
                          <div style={{ fontSize: 12, color: "#94A3B8" }}>{s.email}</div>
                        </div>
                      </div>
                      <button style={S.btn("danger")} onClick={() => handleDelete(s._id)}>
                        <Icon d={icons.trash} size={13} color="#E11D48" />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              ORDERS TAB
          ══════════════════════════════════════════════════════════════ */}
          {activeTab === "orders" && (
            <>
              {/* Filter bar */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {["All", "Order Confirmed", "Out for Delivery", "Delivered", "Cancelled"].map(f => (
                  <button key={f} onClick={() => {}} style={{
                    padding: "6px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                    border: "1px solid #E2E8F0", background: "#fff", color: "#475569",
                  }}>
                    {f}
                  </button>
                ))}
              </div>

              {loadingOrders ? (
                <div style={{ textAlign: "center", padding: 60, color: "#94A3B8" }}>Loading orders...</div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: 60, color: "#94A3B8" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                  No orders yet
                </div>
              ) : orders.map(order => (
                <div key={order._id} style={S.orderCard}>
                  {/* Order header */}
                  <div style={S.orderHeader}>
                    <div>
                      <span style={{ fontFamily: "monospace", fontSize: 12, color: "#94A3B8" }}>
                        #{order._id.slice(-10).toUpperCase()}
                      </span>
                      <span style={{ marginLeft: 12, fontSize: 12, color: "#64748B" }}>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        fontSize: 12, color: order.isPaid ? "#16A34A" : "#F59E0B",
                        fontWeight: 600,
                        background: order.isPaid ? "#F0FDF4" : "#FFFBEB",
                        padding: "3px 10px", borderRadius: 20,
                      }}>
                        {order.isPaid ? "✓ Paid" : "⏳ Payment Pending"}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>
                        ₹{order.amount}
                      </span>
                    </div>
                  </div>

                  {/* Order body */}
                  <div style={S.orderBody}>
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                      {/* Items */}
                      <div style={{ flex: 2, minWidth: 220 }}>
                        {order.items?.map((item, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                            {item.product?.image?.[0] && (
                              <img src={item.product.image[0]} alt=""
                                style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} />
                            )}
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 14 }}>
                                {item.product?.name || "Product"}
                              </div>
                              <div style={{ fontSize: 12, color: "#94A3B8" }}>
                                {item.option?.value}{item.option?.unit} × {item.quantity}
                                {" "}· ₹{(item.option?.price || 0) * item.quantity}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Address */}
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8",
                          textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                          Delivery Address
                        </div>
                        <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>
                          {formatAddress(order.address) || "—"}
                        </div>
                        <div style={{ marginTop: 4, fontSize: 12, color: "#64748B" }}>
                          Method: {order.paymentType || "—"}
                        </div>
                      </div>

                      {/* Status control */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                        <StatusBadge status={order.status} />
                        <select
                          value={order.status}
                          disabled={updatingOrder === order._id || order.status === "Delivered"}
                          onChange={e => handleStatusChange(order._id, e.target.value)}
                          style={S.select}
                        >
                          <option value="Order Confirmed">Order Confirmed</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        {updatingOrder === order._id && (
                          <span style={{ fontSize: 11, color: "#94A3B8" }}>Updating...</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminSellers;