import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const navigate = useNavigate();
  const { products, currency, axios, fetchProducts } = useAppContext();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ── Filter + Search ─────────────────────────────────────────────────────────
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchCat    = filter === "All" || p.category === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const inStockCount  = products.filter((p) => p.inStock).length;
  const outStockCount = products.filter((p) => !p.inStock).length;

  const S = {
    wrap: {
      flex: 1, height: "95vh", overflowY: "scroll",
      background: "#F8FAFC",
      fontFamily: "'Outfit', 'Roboto', sans-serif",
    },
    inner: { padding: "28px 32px" },

    // header row
    headerRow: {
      display: "flex", alignItems: "flex-end",
      justifyContent: "space-between",
      marginBottom: 24, flexWrap: "wrap", gap: 12,
    },
    title:  { fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0 },
    sub:    { fontSize: 13, color: "#94A3B8", margin: "4px 0 0" },

    // stat pills
    statRow: { display: "flex", gap: 10, marginBottom: 20 },
    statPill: (color) => ({
      padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: color === "green" ? "#F0FDF4" :
                  color === "red"   ? "#FFF1F2" : "#F1F5F9",
      color:      color === "green" ? "#16A34A" :
                  color === "red"   ? "#E11D48" : "#475569",
      border: `1px solid ${
                  color === "green" ? "#BBF7D0" :
                  color === "red"   ? "#FECDD3" : "#E2E8F0"}`,
    }),

    // toolbar
    toolbar: {
      display: "flex", gap: 10, marginBottom: 18,
      alignItems: "center", flexWrap: "wrap",
    },
    searchBox: {
      flex: 1, minWidth: 180, padding: "9px 14px",
      border: "1px solid #E2E8F0", borderRadius: 10,
      fontSize: 13, outline: "none", background: "#fff",
      fontFamily: "inherit", color: "#0F172A",
    },
    filterBtn: (active) => ({
      padding: "8px 16px", borderRadius: 20, fontSize: 12,
      fontWeight: active ? 700 : 500, cursor: "pointer",
      border: "1px solid " + (active ? "#16A34A" : "#E2E8F0"),
      background: active ? "#F0FDF4" : "#fff",
      color:      active ? "#16A34A" : "#64748B",
      whiteSpace: "nowrap", fontFamily: "inherit",
    }),

    // table card
    tableCard: {
      background: "#fff", borderRadius: 16,
      border: "1px solid #F1F5F9",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      overflow: "hidden",
    },

    th: {
      padding: "12px 16px", textAlign: "left",
      fontSize: 11, fontWeight: 700, color: "#94A3B8",
      textTransform: "uppercase", letterSpacing: "0.06em",
      background: "#FAFAFA", borderBottom: "1px solid #F1F5F9",
    },
    td: {
      padding: "14px 16px",
      borderBottom: "1px solid #F8FAFC",
      fontSize: 14, color: "#374151",
      verticalAlign: "middle",
    },

    // product cell
    productCell: { display: "flex", alignItems: "center", gap: 12 },
    productImg: {
      width: 52, height: 52, borderRadius: 10,
      objectFit: "cover", background: "#F1F5F9", flexShrink: 0,
      border: "1px solid #F1F5F9",
    },
    productName: { fontWeight: 600, fontSize: 14, color: "#0F172A", margin: 0 },
    productSub:  { fontSize: 12, color: "#94A3B8", margin: "2px 0 0" },

    // category pill
    catPill: {
      display: "inline-block", padding: "3px 10px",
      borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: "#F1F5F9", color: "#475569",
    },

    // price cell
    priceCell: { display: "flex", flexDirection: "column", gap: 2 },
    priceMain: { fontSize: 15, fontWeight: 800, color: "#0F172A" },
    priceMrp:  { fontSize: 12, color: "#94A3B8", textDecoration: "line-through" },
    priceSave: {
      fontSize: 11, fontWeight: 700, color: "#16A34A",
      background: "#F0FDF4", padding: "1px 6px",
      borderRadius: 10, width: "fit-content",
    },
    priceOptions: { fontSize: 11, color: "#94A3B8", marginTop: 2 },

    // toggle
    toggleWrap: { display: "flex", alignItems: "center", gap: 10 },

    // edit btn
    editBtn: {
      padding: "6px 14px", borderRadius: 8,
      background: "#F1F5F9", color: "#374151",
      border: "1px solid #E2E8F0",
      fontSize: 12, fontWeight: 600, cursor: "pointer",
      transition: "all 0.15s", fontFamily: "inherit",
    },

    // empty
    empty: {
      textAlign: "center", padding: "48px 20px", color: "#94A3B8",
    },
  };

  return (
    <div className="no-scrollbar" style={S.wrap}>
      <div style={S.inner}>

        {/* ── Header ── */}
        <div style={S.headerRow}>
          <div>
            <h2 style={S.title}>Product List</h2>
            <p style={S.sub}>{products.length} products total</p>
          </div>
          <button
            onClick={() => navigate("/seller")}
            style={{
              padding: "9px 20px", borderRadius: 10,
              background: "linear-gradient(135deg, #16A34A, #22C55E)",
              color: "#fff", border: "none",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
              boxShadow: "0 4px 12px rgba(22,163,74,0.3)",
              fontFamily: "inherit",
            }}
          >
            + Add Product
          </button>
        </div>

        {/* ── Stat pills ── */}
        <div style={S.statRow}>
          <span style={S.statPill("default")}>
            📦 Total: {products.length}
          </span>
          <span style={S.statPill("green")}>
            ✅ In Stock: {inStockCount}
          </span>
          <span style={S.statPill("red")}>
            ❌ Out of Stock: {outStockCount}
          </span>
        </div>

        {/* ── Toolbar ── */}
        <div style={S.toolbar}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={S.searchBox}
          />
          {categories.map((cat) => (
            <button
              key={cat}
              style={S.filterBtn(filter === cat)}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Table ── */}
        <div style={S.tableCard}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
              <thead>
                <tr>
                  {["Product", "Category", "Price & Options", "In Stock", "Action"].map((h) => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ ...S.td, ...S.empty }}>
                      <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
                      <p style={{ margin: 0, fontWeight: 600, color: "#0F172A" }}>
                        No products found
                      </p>
                      <p style={{ margin: "4px 0 0", fontSize: 13 }}>
                        {search ? `No results for "${search}"` : "Add your first product"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((product) => {
                    // Price calculations
                    const options    = product.quantityOptions || [];
                    const minPrice   = options.length > 0
                      ? Math.min(...options.map((q) => q.price)) : 0;
                    const minMrp     = options.length > 0
                      ? Math.min(...options.map((q) => q.originalPrice || q.price)) : 0;
                    const maxDiscount = options.length > 0
                      ? Math.max(...options.map((q) =>
                          q.originalPrice
                            ? Math.round(((q.originalPrice - q.price) / q.originalPrice) * 100)
                            : 0
                        ))
                      : 0;

                    return (
                      <tr
                        key={product._id}
                        style={{ transition: "background 0.15s" }}
                        onMouseOver={e => e.currentTarget.style.background = "#FAFAFA"}
                        onMouseOut={e  => e.currentTarget.style.background = "transparent"}
                      >
                        {/* Product */}
                        <td style={S.td}>
                          <div style={S.productCell}>
                            <img
                              src={product.image?.[0]}
                              alt={product.name}
                              style={S.productImg}
                            />
                            <div>
                              <p style={S.productName}>{product.name}</p>
                              <p style={S.productSub}>
                                {options.length} size option{options.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td style={S.td}>
                          <span style={S.catPill}>{product.category}</span>
                        </td>

                        {/* Price */}
                        <td style={S.td}>
                          <div style={S.priceCell}>
                            {/* Starting price */}
                            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                              <span style={S.priceMain}>
                                {currency}{minPrice}
                              </span>
                              {minMrp > minPrice && (
                                <span style={S.priceMrp}>
                                  {currency}{minMrp}
                                </span>
                              )}
                            </div>

                            {/* Discount badge */}
                            {maxDiscount > 0 && (
                              <span style={S.priceSave}>
                                Up to {maxDiscount}% OFF
                              </span>
                            )}

                            {/* Size options summary */}
                            {options.length > 0 && (
                              <span style={S.priceOptions}>
                                {options.map((o) => `${o.value}${o.unit}`).join(" · ")}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* In Stock toggle */}
                        <td style={S.td}>
                          <div style={S.toggleWrap}>
                            <label style={{ position: "relative", display: "inline-block",
                              width: 44, height: 24, cursor: "pointer" }}>
                              <input
                                type="checkbox"
                                checked={product.inStock}
                                onChange={() => toggleStock(product._id, !product.inStock)}
                                style={{ opacity: 0, width: 0, height: 0 }}
                              />
                              <span style={{
                                position: "absolute", inset: 0,
                                background: product.inStock ? "#16A34A" : "#D1D5DB",
                                borderRadius: 24, transition: "0.3s",
                              }} />
                              <span style={{
                                position: "absolute",
                                left: product.inStock ? 22 : 2,
                                top: 2, width: 20, height: 20,
                                background: "#fff", borderRadius: "50%",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                                transition: "left 0.3s",
                              }} />
                            </label>
                            <span style={{
                              fontSize: 12, fontWeight: 600,
                              color: product.inStock ? "#16A34A" : "#EF4444",
                            }}>
                              {product.inStock ? "In Stock" : "Out"}
                            </span>
                          </div>
                        </td>

                        {/* Edit */}
                        <td style={S.td}>
                          <button
                            onClick={() => navigate(`/seller/edit-product/${product._id}`)}
                            style={S.editBtn}
                            onMouseOver={e => {
                              e.currentTarget.style.background = "#E0F2FE";
                              e.currentTarget.style.color = "#0284C7";
                              e.currentTarget.style.borderColor = "#BAE6FD";
                            }}
                            onMouseOut={e => {
                              e.currentTarget.style.background = "#F1F5F9";
                              e.currentTarget.style.color = "#374151";
                              e.currentTarget.style.borderColor = "#E2E8F0";
                            }}
                          >
                            ✏️ Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductList;