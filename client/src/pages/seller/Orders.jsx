import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  "Order Confirmed":  { bg: "#FEF9C3", color: "#A16207", dot: "#CA8A04"  },
  "Out for Delivery": { bg: "#DBEAFE", color: "#1D4ED8", dot: "#3B82F6"  },
  "Delivered":        { bg: "#DCFCE7", color: "#15803D", dot: "#22C55E"  },
  "Cancelled":        { bg: "#FFE4E6", color: "#BE123C", dot: "#F43F5E"  },
  "Order Placed":     { bg: "#F3F4F6", color: "#374151", dot: "#6B7280"  },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Order Placed"];
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      padding: "4px 12px", borderRadius: 20,
      fontSize: 12, fontWeight: 600,
      display: "inline-flex", alignItems: "center", gap: 5,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: cfg.dot, display: "inline-block",
      }} />
      {status}
    </span>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Orders = () => {
  const { currency, axios } = useAppContext();

  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [updating, setUpdating]   = useState(null);
  const [filter, setFilter]       = useState("All");
  const [search, setSearch]       = useState("");
  const [expanded, setExpanded]   = useState({});

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // ── Update status ───────────────────────────────────────────────────────────
  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      const { data } = await axios.post("/api/order/update-status", {
        orderId,
        status: newStatus,
      });
      if (data.success) {
        toast.success("Status updated");
        // update locally — no need to refetch
        setOrders((prev) =>
          prev.map((o) => o._id === orderId ? { ...o, status: newStatus } : o)
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdating(null);
    }
  };

  // ── Filter + search ─────────────────────────────────────────────────────────
  const FILTERS = ["All", "Order Confirmed", "Out for Delivery", "Delivered", "Cancelled"];

  const filtered = orders.filter((o) => {
    const matchFilter = filter === "All" || o.status === filter;
    const name = `${o.address?.firstName || ""} ${o.address?.lastName || ""}`.toLowerCase();
    const id   = o._id?.toLowerCase() || "";
    const matchSearch = !search ||
      name.includes(search.toLowerCase()) ||
      id.includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // ── Stats ────────────────────────────────────────────────────────────────────
  const stats = {
    total:    orders.length,
    pending:  orders.filter(o => o.status === "Order Confirmed").length,
    transit:  orders.filter(o => o.status === "Out for Delivery").length,
    delivered:orders.filter(o => o.status === "Delivered").length,
  };

  // ── Format address ───────────────────────────────────────────────────────────
  const hasAddress = (addr) =>
    addr && typeof addr === "object" && addr.firstName;

  const S = {
    wrap: {
      flex: 1, height: "95vh", overflowY: "scroll",
      fontFamily: "'Outfit', 'Roboto', sans-serif",
      background: "#F8FAFC",
    },
    inner: { padding: "28px 32px", maxWidth: 1100, margin: "0 auto" },

    // header
    header: { marginBottom: 24 },
    title: { fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0 },
    sub:   { fontSize: 13, color: "#94A3B8", margin: "4px 0 0" },

    // stats row
    statsRow: {
      display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
      gap: 14, marginBottom: 24,
    },
    statCard: (accent) => ({
      background: "#fff", borderRadius: 14, padding: "16px 20px",
      border: "1px solid #F1F5F9",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      borderLeft: `4px solid ${accent}`,
    }),
    statNum:   { fontSize: 24, fontWeight: 800, color: "#0F172A", margin: 0 },
    statLabel: { fontSize: 12, color: "#94A3B8", margin: "2px 0 0", fontWeight: 500 },

    // toolbar
    toolbar: {
      display: "flex", gap: 12, alignItems: "center",
      marginBottom: 20, flexWrap: "wrap",
    },
    searchBox: {
      flex: 1, minWidth: 200, padding: "9px 14px",
      border: "1px solid #E2E8F0", borderRadius: 10,
      fontSize: 13, outline: "none", background: "#fff",
      fontFamily: "inherit",
    },
    filterBtn: (active) => ({
      padding: "8px 16px", borderRadius: 20, fontSize: 12,
      fontWeight: active ? 700 : 500, cursor: "pointer",
      border: "1px solid " + (active ? "#16A34A" : "#E2E8F0"),
      background: active ? "#F0FDF4" : "#fff",
      color:      active ? "#16A34A" : "#64748B",
      whiteSpace: "nowrap",
    }),

    // order card
    card: {
      background: "#fff", borderRadius: 16, marginBottom: 14,
      border: "1px solid #F1F5F9",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      overflow: "hidden",
    },
    cardHead: {
      padding: "12px 20px", background: "#FAFAFA",
      borderBottom: "1px solid #F1F5F9",
      display: "flex", alignItems: "center",
      justifyContent: "space-between", flexWrap: "wrap", gap: 8,
    },
    cardBody: {
      padding: "18px 20px",
      display: "grid",
      gridTemplateColumns: "2fr 1.4fr 0.8fr 1fr",
      gap: 20, alignItems: "start",
    },

    // items
    itemRow: {
      display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
    },
    itemImg: {
      width: 48, height: 48, borderRadius: 10,
      objectFit: "cover", background: "#F1F5F9", flexShrink: 0,
    },
    itemName: { fontSize: 13, fontWeight: 600, color: "#0F172A", margin: 0 },
    itemSub:  { fontSize: 12, color: "#94A3B8", margin: "2px 0 0" },

    // address
    addrLabel: {
      fontSize: 10, fontWeight: 700, color: "#94A3B8",
      textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6,
    },
    addrLine: { fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 },

    // amount
    amount: { fontSize: 18, fontWeight: 800, color: "#0F172A" },

    // status col
    statusCol: { display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" },
    select: {
      padding: "7px 12px", border: "1px solid #E2E8F0",
      borderRadius: 9, fontSize: 12, outline: "none",
      cursor: "pointer", background: "#fff", color: "#374151",
      width: "100%", fontFamily: "inherit",
    },

    // empty
    empty: {
      textAlign: "center", padding: "60px 20px",
      background: "#fff", borderRadius: 16,
      border: "1px solid #F1F5F9",
    },
  };

  return (
    <div className="no-scrollbar" style={S.wrap}>
      <div style={S.inner}>

        {/* ── Header ── */}
        <div style={S.header}>
          <h2 style={S.title}>Orders</h2>
          <p style={S.sub}>{orders.length} total orders</p>
        </div>

        {/* ── Stats row ── */}
        <div style={S.statsRow}>
          {[
            { label: "Total Orders",    num: stats.total,     accent: "#6366F1" },
            { label: "Confirmed",       num: stats.pending,   accent: "#F59E0B" },
            { label: "Out for Delivery",num: stats.transit,   accent: "#3B82F6" },
            { label: "Delivered",       num: stats.delivered, accent: "#22C55E" },
          ].map((s) => (
            <div key={s.label} style={S.statCard(s.accent)}>
              <p style={S.statNum}>{s.num}</p>
              <p style={S.statLabel}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div style={S.toolbar}>
          <input
            type="text"
            placeholder="Search by customer name or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={S.searchBox}
          />
          {FILTERS.map((f) => (
            <button key={f} style={S.filterBtn(filter === f)}
              onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div style={S.empty}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>⏳</div>
            <p style={{ color: "#94A3B8" }}>Loading orders...</p>
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && filtered.length === 0 && (
          <div style={S.empty}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
            <p style={{ fontWeight: 700, color: "#0F172A", fontSize: 16, margin: "0 0 6px" }}>
              {filter === "All" && !search ? "No orders yet" : "No orders found"}
            </p>
            <p style={{ color: "#94A3B8", margin: 0, fontSize: 13 }}>
              {search ? `No results for "${search}"` : "Orders will appear here once placed"}
            </p>
          </div>
        )}

        {/* ── Order cards ── */}
        {!loading && filtered.map((order) => (
          <div key={order._id} style={S.card}>

            {/* Card header */}
            <div style={S.cardHead}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                  fontFamily: "monospace", fontSize: 12, color: "#94A3B8",
                }}>
                  #{order._id?.slice(-10).toUpperCase()}
                </span>
                <span style={{ color: "#E2E8F0" }}>·</span>
                <span style={{ fontSize: 12, color: "#64748B" }}>
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </span>
                <span style={{ color: "#E2E8F0" }}>·</span>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color:      order.isPaid ? "#16A34A" : "#D97706",
                  background: order.isPaid ? "#F0FDF4"  : "#FFFBEB",
                  padding: "2px 8px", borderRadius: 20,
                }}>
                  {order.isPaid ? "✓ Paid" : "⏳ Pending"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>
                  {order.paymentType || "COD"}
                </span>
                <span style={{ fontWeight: 800, fontSize: 16, color: "#0F172A" }}>
                  {currency}{order.amount}
                </span>
              </div>
            </div>

            {/* Card body */}
            <div style={S.cardBody}>

              {/* ── Items ── */}
              <div>
                <p style={S.addrLabel}>Items ordered</p>
                {order.items?.map((item, i) => (
                  <div key={i} style={{
                    ...S.itemRow,
                    paddingBottom: i < order.items.length - 1 ? 10 : 0,
                    borderBottom: i < order.items.length - 1
                      ? "1px dashed #F1F5F9" : "none",
                  }}>
                    <img
                      src={item.product?.image?.[0] || assets.box_icon}
                      alt={item.product?.name}
                      style={S.itemImg}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={S.itemName}>
                        {item.product?.name || "Product"}
                      </p>
                      <p style={S.itemSub}>
                        {item.option?.value}{item.option?.unit}
                        {" · "}Qty: {item.quantity}
                        {" · "}₹{(item.option?.price || 0) * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Address ── */}
              <div>
                <p style={S.addrLabel}>Delivery address</p>
                {hasAddress(order.address) ? (
                  <>
                    <p style={{ ...S.addrLine, fontWeight: 600 }}>
                      {order.address.firstName} {order.address.lastName}
                    </p>
                    <p style={S.addrLine}>{order.address.street}</p>
                    {order.address.landmark && (
                      <p style={S.addrLine}>Near: {order.address.landmark}</p>
                    )}
                    <p style={S.addrLine}>
                      {order.address.city}, {order.address.state} {order.address.zipcode}
                    </p>
                    <p style={S.addrLine}>{order.address.country}</p>
                    {order.address.phone && (
                      <p style={{ ...S.addrLine, marginTop: 4, color: "#16A34A", fontWeight: 600 }}>
                        📞 {order.address.phone}
                      </p>
                    )}
                  </>
                ) : (
                  <p style={{ ...S.addrLine, color: "#94A3B8", fontStyle: "italic" }}>
                    Address not available
                    <br />
                    <span style={{ fontSize: 11 }}>
                      (Fix: populate address in orderController)
                    </span>
                  </p>
                )}
              </div>

              {/* ── Amount ── */}
              <div>
                <p style={S.addrLabel}>Order total</p>
                <p style={S.amount}>{currency}{order.amount}</p>
                <p style={{ fontSize: 11, color: "#94A3B8", margin: "4px 0 0" }}>
                  incl. tax & delivery
                </p>
              </div>

              {/* ── Status control ── */}
              <div style={S.statusCol}>
                <p style={S.addrLabel}>Order status</p>
                <StatusBadge status={order.status} />
                <select
                  value={order.status}
                  disabled={
                    updating === order._id ||
                    order.status === "Delivered" ||
                    order.status === "Cancelled"
                  }
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  style={{
                    ...S.select,
                    opacity: (order.status === "Delivered" || order.status === "Cancelled") ? 0.5 : 1,
                    cursor:  (order.status === "Delivered" || order.status === "Cancelled") ? "not-allowed" : "pointer",
                  }}
                >
                  <option value="Order Confirmed">Order Confirmed</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                {updating === order._id && (
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>
                    Updating...
                  </span>
                )}
                {(order.status === "Delivered" || order.status === "Cancelled") && (
                  <span style={{ fontSize: 11, color: "#94A3B8", fontStyle: "italic" }}>
                    Status locked
                  </span>
                )}
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Orders;