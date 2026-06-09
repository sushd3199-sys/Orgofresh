import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

//Status steps 
const STATUS_STEPS = [
  { key: "Order Confirmed", label: "Confirmed",    emoji: "✅" },
  { key: "Out for Delivery", label: "On the Way",  emoji: "🚚" },
  { key: "Delivered",        label: "Delivered",   emoji: "🎉" },
];

const getStepIndex = (status) => {
  if (status === "Cancelled") return -1;
  return STATUS_STEPS.findIndex((s) => s.key === status);
};

//Status Timeline-
const StatusTimeline = ({ status }) => {
  const currentIdx = getStepIndex(status);

  if (status === "Cancelled") {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 16px", background: "#FFF1F2",
        borderRadius: 10, marginTop: 12,
      }}>
        <span style={{ fontSize: 18 }}>❌</span>
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: "#E11D48", fontSize: 14 }}>Order Cancelled</p>
          <p style={{ margin: 0, fontSize: 12, color: "#FB7185" }}>This order has been cancelled</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16, padding: "14px 0 6px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {STATUS_STEPS.map((step, i) => {
          const done    = i <= currentIdx;
          const active  = i === currentIdx;
          const isLast  = i === STATUS_STEPS.length - 1;

          return (
            <React.Fragment key={step.key}>
              {/* Step dot */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: done ? "#16A34A" : "#F1F5F9",
                  border: active ? "3px solid #BBF7D0" : "2px solid " + (done ? "#16A34A" : "#E2E8F0"),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: done ? 14 : 12,
                  boxShadow: active ? "0 0 0 4px #DCFCE7" : "none",
                  transition: "all 0.3s",
                }}>
                  {done ? <span>✓</span> : <span style={{ color: "#CBD5E1" }}>○</span>}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: active ? 700 : 500,
                  color: done ? "#16A34A" : "#94A3B8",
                  whiteSpace: "nowrap",
                }}>
                  {step.emoji} {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div style={{
                  flex: 1, height: 3, marginBottom: 22,
                  background: i < currentIdx ? "#16A34A" : "#E2E8F0",
                  borderRadius: 2, transition: "background 0.3s",
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

//Payment badge-
const PaymentBadge = ({ isPaid, paymentType }) => (
  <span style={{
    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
    background: isPaid ? "#F0FDF4" : "#FFFBEB",
    color:      isPaid ? "#16A34A" : "#D97706",
  }}>
    {isPaid ? "✓ Paid" : "⏳ Pending"} · {paymentType || "COD"}
  </span>
);

//Main Component-
const MyOrders = () => {
  const { currency, axios, user, navigate } = useAppContext();
  const [myOrders, setMyOrders]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [filter, setFilter]       = useState("All");

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/order/user");
      if (data.success) setMyOrders(data.orders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyOrders();
  }, [user]);

  //Cancel order-
  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      setCancelling(orderId);
      const { data } = await axios.post("/api/order/cancel", { orderId });
      if (data.success) {
        toast.success("Order cancelled");
        setMyOrders((prev) =>
          prev.map((o) => o._id === orderId ? { ...o, status: "Cancelled" } : o)
        );
      } else {
        toast.error(data.message || "Cannot cancel this order");
      }
    } catch {
      toast.error("Error cancelling order");
    } finally {
      setCancelling(null);
    }
  };

  //Filter-
  const FILTERS = ["All", "Order Confirmed", "Out for Delivery", "Delivered", "Cancelled"];
  const filtered = filter === "All"
    ? myOrders
    : myOrders.filter((o) => o.status === filter);

  // Format date-
  const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  //Styles-
  const S = {
    page:  { marginTop: 32, paddingBottom: 64, fontFamily: "'Outfit', 'Roboto', sans-serif" },
    topRow: { display: "flex", alignItems: "flex-end", justifyContent: "space-between",
              flexWrap: "wrap", gap: 12, marginBottom: 24 },
    title: { fontSize: 28, fontWeight: 800, color: "#0F172A", margin: 0 },
    titleAccent: { color: "#16A34A" },
    sub:   { fontSize: 13, color: "#94A3B8", margin: "4px 0 0" },

    filterBar: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 },
    filterBtn: (active) => ({
      padding: "6px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer",
      border: "1px solid " + (active ? "#16A34A" : "#E2E8F0"),
      background: active ? "#F0FDF4" : "#fff",
      color:      active ? "#16A34A" : "#64748B",
      fontWeight: active ? 600 : 400, transition: "all 0.15s",
    }),

    empty: {
      textAlign: "center", padding: "80px 20px",
      background: "#fff", borderRadius: 20, border: "1px solid #F1F5F9",
    },

    card: {
      background: "#fff", borderRadius: 20, marginBottom: 20,
      border: "1px solid #F1F5F9", overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.2s",
    },
    cardHead: {
      padding: "14px 20px", background: "#FAFAFA",
      borderBottom: "1px solid #F1F5F9",
      display: "flex", alignItems: "center",
      justifyContent: "space-between", flexWrap: "wrap", gap: 8,
    },
    orderId: { fontFamily: "monospace", fontSize: 12, color: "#94A3B8" },
    cardBody: { padding: "20px" },

    itemRow: {
      display: "flex", alignItems: "center", gap: 14,
      padding: "12px 0", borderBottom: "1px solid #F8FAFC",
    },
    itemImg: { width: 56, height: 56, borderRadius: 12, objectFit: "cover",
               background: "#F1F5F9", flexShrink: 0 },
    itemName: { fontWeight: 600, fontSize: 15, color: "#0F172A" },
    itemSub:  { fontSize: 12, color: "#94A3B8", marginTop: 2 },
    itemPrice: { marginLeft: "auto", fontWeight: 700, fontSize: 15, color: "#0F172A" },

    divider: { height: 1, background: "#F1F5F9", margin: "16px 0" },

    footer: {
      display: "flex", alignItems: "center",
      justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      paddingTop: 8,
    },
    total: { fontSize: 16, fontWeight: 700, color: "#0F172A" },
    totalSub: { fontSize: 12, color: "#94A3B8" },

    cancelBtn: (loading) => ({
      padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
      cursor: loading ? "not-allowed" : "pointer",
      background: "#FFF1F2", color: "#E11D48",
      border: "1px solid #FECDD3", opacity: loading ? 0.6 : 1,
    }),
    reorderBtn: {
      padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
      cursor: "pointer", background: "#F0FDF4", color: "#16A34A",
      border: "1px solid #BBF7D0",
    },
  };

  if (loading) return (
    <div style={{ ...S.page, textAlign: "center", paddingTop: 80 }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🛒</div>
      <p style={{ color: "#94A3B8" }}>Loading your orders...</p>
    </div>
  );

  return (
    <div style={S.page}>
      {/* ── Header ── */}
      <div style={S.topRow}>
        <div>
          <h1 style={S.title}>
            My <span style={S.titleAccent}>Orders</span>
          </h1>
          <p style={S.sub}>{myOrders.length} order{myOrders.length !== 1 ? "s" : ""} placed</p>
        </div>
        <button
          onClick={() => { navigate("/products"); scrollTo(0, 0); }}
          style={{ ...S.reorderBtn, fontSize: 14, padding: "10px 22px" }}
        >
          + Shop More
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div style={S.filterBar}>
        {FILTERS.map((f) => (
          <button key={f} style={S.filterBtn(filter === f)} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div style={S.empty}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>📦</div>
          <p style={{ fontWeight: 700, fontSize: 18, color: "#0F172A", margin: "0 0 8px" }}>
            {filter === "All" ? "No orders yet" : `No ${filter} orders`}
          </p>
          <p style={{ color: "#94A3B8", margin: "0 0 24px" }}>
            {filter === "All" ? "Your order history will appear here" : "Try a different filter"}
          </p>
          {filter === "All" && (
            <button
              onClick={() => { navigate("/products"); scrollTo(0, 0); }}
              style={{ ...S.reorderBtn, padding: "12px 28px", fontSize: 15 }}
            >
              Start Shopping →
            </button>
          )}
        </div>
      )}

      {/* ── Order cards ── */}
      {filtered.map((order) => {
        const canCancel = !["Delivered", "Cancelled", "Out for Delivery"].includes(order.status);
        const orderTotal = order.items?.reduce(
          (sum, item) => sum + (item.option?.price || 0) * item.quantity, 0
        ) || order.amount;

        return (
          <div key={order._id} style={S.card}>
            {/* Card header */}
            <div style={S.cardHead}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div>
                  <span style={S.orderId}>Order #{order._id.slice(-10).toUpperCase()}</span>
                  <span style={{ margin: "0 8px", color: "#E2E8F0" }}>·</span>
                  <span style={{ fontSize: 12, color: "#64748B" }}>{fmtDate(order.createdAt)}</span>
                </div>
              </div>
              <PaymentBadge isPaid={order.isPaid} paymentType={order.paymentType} />
            </div>

            {/* Card body */}
            <div style={S.cardBody}>
              {/* Items list */}
              {order.items?.map((item, i) => (
                <div
                  key={i}
                  style={{
                    ...S.itemRow,
                    borderBottom: i === order.items.length - 1 ? "none" : "1px solid #F8FAFC",
                  }}
                >
                  {item.product?.image?.[0] ? (
                    <img src={item.product.image[0]} alt={item.product?.name} style={S.itemImg} />
                  ) : (
                    <div style={{ ...S.itemImg, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 24 }}>🛒</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ ...S.itemName, margin: 0 }}>{item.product?.name || "Product"}</p>
                    <p style={{ ...S.itemSub, margin: 0 }}>
                      {item.option?.value}{item.option?.unit} · Qty: {item.quantity}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ ...S.itemPrice, margin: 0 }}>
                      ₹{(item.option?.price || 0) * item.quantity}
                    </p>
                    <p style={{ fontSize: 11, color: "#94A3B8", margin: "2px 0 0" }}>
                      ₹{item.option?.price} each
                    </p>
                  </div>
                </div>
              ))}

              {/* Status timeline */}
              <StatusTimeline status={order.status} />

              <div style={S.divider} />

              {/* Footer row */}
              <div style={S.footer}>
                <div>
                  <p style={{ ...S.totalSub, margin: "0 0 2px" }}>Order Total</p>
                  <p style={{ ...S.total, margin: 0 }}>
                    ₹{order.amount?.toFixed(2)}
                    <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 400, marginLeft: 6 }}>
                      (incl. tax & delivery)
                    </span>
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  {/* Cancel button — only for cancellable orders */}
                  {canCancel && (
                    <button
                      style={S.cancelBtn(cancelling === order._id)}
                      disabled={cancelling === order._id}
                      onClick={() => handleCancel(order._id)}
                    >
                      {cancelling === order._id ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}

                  {/* Reorder button — only for delivered orders */}
                  {order.status === "Delivered" && (
                    <button
                      style={S.reorderBtn}
                      onClick={() => { navigate("/products"); scrollTo(0, 0); }}
                    >
                      🔁 Reorder
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;
