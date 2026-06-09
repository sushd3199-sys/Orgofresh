import React, { useState, useEffect } from "react";
import { assets, categories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios } = useAppContext();
  const isEdit = Boolean(id);

  const [files, setFiles]               = useState([null, null, null, null]);
  const [existingImages, setExistingImages] = useState([]);
  const [name, setName]                 = useState("");
  const [description, setDescription]  = useState("");
  const [category, setCategory]         = useState("");
  const [loading, setLoading]           = useState(false);
  const [quantities, setQuantities]     = useState([
    { value: "", unit: "g", price: "", originalPrice: "" },
  ]);

  // ── Fetch product for edit mode ─────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/product/id/${id}`);
        if (data.success) {
          const p = data.product;
          setName(p.name || "");
          setDescription(p.description?.join("\n") || "");
          setCategory(p.category || "");
          setExistingImages(p.image || []);
          setQuantities(
            p.quantityOptions?.length
              ? p.quantityOptions
              : [{ value: "", unit: "g", price: "", originalPrice: "" }]
          );
        }
      } catch (err) {
        toast.error("Failed to load product");
      }
    };
    fetchProduct();
  }, [id]);

  // ── Update quantity row ─────────────────────────────────────────────────────
  const updateQty = (index, field, value) => {
    const updated = [...quantities];
    updated[index] = { ...updated[index], [field]: value };
    setQuantities(updated);
  };

  const addQtyRow = () =>
    setQuantities([...quantities, { value: "", unit: "g", price: "", originalPrice: "" }]);

  const removeQtyRow = (index) =>
    setQuantities(quantities.filter((_, i) => i !== index));

  // ── Submit ──────────────────────────────────────────────────────────────────
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validate quantities
    for (let i = 0; i < quantities.length; i++) {
      const q = quantities[i];
      if (!q.value || !q.price) {
        toast.error(`Fill value and price for option ${i + 1}`);
        return;
      }
      if (Number(q.price) <= 0) {
        toast.error(`Price must be greater than 0 for option ${i + 1}`);
        return;
      }
      if (q.originalPrice && Number(q.originalPrice) < Number(q.price)) {
        toast.error(`MRP cannot be less than selling price for option ${i + 1}`);
        return;
      }
    }

    const formattedQuantities = quantities.map((q) => ({
      value:         Number(q.value),
      unit:          q.unit,
      price:         Number(q.price),
      originalPrice: Number(q.originalPrice || q.price),
    }));

    const productData = {
      name,
      description: description.split("\n").filter((d) => d.trim()),
      category,
      quantityOptions: formattedQuantities,
    };

    try {
      setLoading(true);
      let response;

      if (isEdit) {
        response = await axios.post("/api/product/update", { id, ...productData });
      } else {
        // Validate at least 1 image
        const hasImage = files.some((f) => f !== null);
        if (!hasImage) {
          toast.error("Upload at least one product image");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("productData", JSON.stringify(productData));
        files.forEach((file) => { if (file) formData.append("images", file); });

        response = await axios.post("/api/product/add", formData);
      }

      if (response.data.success) {
        toast.success(isEdit ? "Product updated!" : "Product added!");
        if (!isEdit) {
          setFiles([null, null, null, null]);
          setName(""); setDescription(""); setCategory("");
          setQuantities([{ value: "", unit: "g", price: "", originalPrice: "" }]);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Styles ──────────────────────────────────────────────────────────────────
  const S = {
    wrap: {
      flex: 1, height: "95vh", overflowY: "scroll",
      background: "#F8FAFC",
      fontFamily: "'Outfit', 'Roboto', sans-serif",
    },
    inner: { padding: "28px 32px", maxWidth: 760 },

    // header
    header:   { marginBottom: 28 },
    title:    { fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0 },
    sub:      { fontSize: 13, color: "#94A3B8", margin: "4px 0 0" },

    // section card
    card: {
      background: "#fff", borderRadius: 16,
      border: "1px solid #F1F5F9",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      padding: "24px", marginBottom: 16,
    },
    cardTitle: {
      fontSize: 14, fontWeight: 700, color: "#0F172A",
      marginBottom: 16, display: "flex", alignItems: "center", gap: 8,
    },

    // label
    label: {
      display: "block", fontSize: 12, fontWeight: 700,
      color: "#64748B", marginBottom: 8,
      textTransform: "uppercase", letterSpacing: "0.06em",
    },

    // input
    input: {
      width: "100%", padding: "11px 14px",
      border: "1px solid #E2E8F0", borderRadius: 10,
      fontSize: 14, color: "#0F172A", outline: "none",
      background: "#FAFAFA", boxSizing: "border-box",
      fontFamily: "inherit", transition: "border-color 0.2s",
    },
    textarea: {
      width: "100%", padding: "11px 14px",
      border: "1px solid #E2E8F0", borderRadius: 10,
      fontSize: 14, color: "#0F172A", outline: "none",
      background: "#FAFAFA", boxSizing: "border-box",
      resize: "vertical", minHeight: 100,
      fontFamily: "inherit", transition: "border-color 0.2s",
    },
    select: {
      width: "100%", padding: "11px 14px",
      border: "1px solid #E2E8F0", borderRadius: 10,
      fontSize: 14, color: "#0F172A", outline: "none",
      background: "#FAFAFA", boxSizing: "border-box",
      fontFamily: "inherit", cursor: "pointer",
    },

    // image upload
    imgGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 },
    imgBox: (hasImg) => ({
      aspectRatio: "1/1", borderRadius: 12,
      border: `2px dashed ${hasImg ? "#16A34A" : "#E2E8F0"}`,
      background: hasImg ? "#F0FDF4" : "#FAFAFA",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      cursor: "pointer", overflow: "hidden",
      position: "relative", transition: "all 0.2s",
    }),

    // qty row
    qtyRow: {
      display: "grid",
      gridTemplateColumns: "80px 130px 1fr 1fr 36px",
      gap: 10, alignItems: "center",
      padding: "14px", borderRadius: 12,
      background: "#F8FAFC", border: "1px solid #F1F5F9",
      marginBottom: 10,
    },
    qtyInput: {
      width: "100%", padding: "9px 12px",
      border: "1px solid #E2E8F0", borderRadius: 8,
      fontSize: 13, outline: "none", background: "#fff",
      boxSizing: "border-box", fontFamily: "inherit",
    },
    qtyLabel: {
      fontSize: 10, fontWeight: 700, color: "#94A3B8",
      textTransform: "uppercase", letterSpacing: "0.06em",
      marginBottom: 4, display: "block",
    },
    priceInput: {
      width: "100%", padding: "9px 12px 9px 28px",
      border: "1px solid #E2E8F0", borderRadius: 8,
      fontSize: 13, outline: "none", background: "#fff",
      boxSizing: "border-box", fontFamily: "inherit",
    },
    priceWrap: { position: "relative" },
    rupee: {
      position: "absolute", left: 10, top: "50%",
      transform: "translateY(-50%)",
      fontSize: 13, color: "#94A3B8", fontWeight: 600,
      pointerEvents: "none",
    },

    // submit
    submitBtn: {
      width: "100%", padding: "14px",
      background: loading
        ? "rgba(22,163,74,0.5)"
        : "linear-gradient(135deg, #16A34A, #22C55E)",
      color: "#fff", border: "none", borderRadius: 12,
      fontSize: 15, fontWeight: 700,
      cursor: loading ? "not-allowed" : "pointer",
      boxShadow: loading ? "none" : "0 4px 14px rgba(22,163,74,0.35)",
      display: "flex", alignItems: "center",
      justifyContent: "center", gap: 8,
      fontFamily: "inherit", marginTop: 4,
    },
  };

  const focusStyle = (e) => { e.target.style.borderColor = "#16A34A"; e.target.style.background = "#fff"; };
  const blurStyle  = (e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.background = "#FAFAFA"; };

  const unitOptions = [
    { value: "g",      label: "gm"           },
    { value: "kg",     label: "kg"           },
    { value: "ml",     label: "ml"           },
    { value: "l",      label: "litre"        },
    { value: "bunch",  label: "bunch (mutha)"},
    { value: "piece",  label: "piece"        },
  ];

  return (
    <div className="no-scrollbar" style={S.wrap}>
      <div style={S.inner}>

        {/* Header */}
        <div style={S.header}>
          <h2 style={S.title}>
            {isEdit ? "✏️ Edit Product" : "➕ Add New Product"}
          </h2>
          <p style={S.sub}>
            {isEdit ? "Update product details below" : "Fill in the details to add a new product"}
          </p>
        </div>

        <form onSubmit={onSubmitHandler}>

          {/* ── Image Upload ── */}
          <div style={S.card}>
            <div style={S.cardTitle}>
              🖼️ Product Images
              <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 400 }}>
                (up to 4 images, first image is the main one)
              </span>
            </div>
            <div style={S.imgGrid}>
              {Array(4).fill("").map((_, i) => {
                const hasFile  = files[i] !== null;
                const hasExist = existingImages[i];
                const src      = hasFile
                  ? URL.createObjectURL(files[i])
                  : hasExist ? hasExist : null;

                return (
                  <label key={i} htmlFor={`image${i}`} style={S.imgBox(src)}>
                    <input
                      type="file" id={`image${i}`} hidden accept="image/*"
                      onChange={(e) => {
                        const updated = [...files];
                        updated[i] = e.target.files[0];
                        setFiles(updated);
                      }}
                    />
                    {src ? (
                      <>
                        <img src={src} alt=""
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        {i === 0 && (
                          <span style={{
                            position: "absolute", bottom: 6, left: "50%",
                            transform: "translateX(-50%)",
                            background: "#16A34A", color: "#fff",
                            fontSize: 9, fontWeight: 700,
                            padding: "2px 8px", borderRadius: 10,
                            whiteSpace: "nowrap",
                          }}>
                            MAIN
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: 24, marginBottom: 6 }}>📷</span>
                        <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>
                          {i === 0 ? "Main Photo" : `Photo ${i + 1}`}
                        </span>
                        <span style={{ fontSize: 10, color: "#CBD5E1", marginTop: 2 }}>
                          Click to upload
                        </span>
                      </>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* ── Product Info ── */}
          <div style={S.card}>
            <div style={S.cardTitle}>📋 Product Details</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Name */}
              <div>
                <label style={S.label}>Product Name *</label>
                <input
                  type="text" placeholder="e.g. Fresh Organic Tomatoes"
                  value={name} onChange={(e) => setName(e.target.value)}
                  required style={S.input}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
              </div>

              {/* Description */}
              <div>
                <label style={S.label}>
                  Description *
                  <span style={{ fontSize: 10, color: "#94A3B8", fontWeight: 400,
                    marginLeft: 8, textTransform: "none" }}>
                    (each line = one bullet point)
                  </span>
                </label>
                <textarea
                  placeholder={"Rich in vitamins\nFarm fresh quality\nPerfect for salads"}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={S.textarea}
                  onFocus={focusStyle} onBlur={blurStyle}
                />
                <p style={{ fontSize: 11, color: "#94A3B8", margin: "4px 0 0", textAlign: "right" }}>
                  {description.split("\n").filter((l) => l.trim()).length} bullet points
                </p>
              </div>

              {/* Category */}
              <div>
                <label style={S.label}>Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required style={S.select}
                  onFocus={focusStyle} onBlur={blurStyle}
                >
                  <option value="">Select Category</option>
                  {categories.map((item, i) => (
                    <option key={i} value={item.path}>{item.path}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* ── Quantity & Pricing ── */}
          <div style={S.card}>
            <div style={S.cardTitle}>⚖️ Quantity & Pricing</div>

            {/* Column headers */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "80px 130px 1fr 1fr 36px",
              gap: 10, marginBottom: 8, padding: "0 14px",
            }}>
              {["Value", "Unit", "Selling Price ₹", "MRP ₹ (optional)", ""].map((h, i) => (
                <span key={i} style={{
                  fontSize: 10, fontWeight: 700, color: "#94A3B8",
                  textTransform: "uppercase", letterSpacing: "0.06em",
                }}>
                  {h}
                </span>
              ))}
            </div>

            {quantities.map((q, index) => {
              const discount = q.originalPrice && q.price &&
                Number(q.originalPrice) > Number(q.price)
                ? Math.round(((Number(q.originalPrice) - Number(q.price)) / Number(q.originalPrice)) * 100)
                : 0;

              return (
                <div key={index} style={S.qtyRow}>

                  {/* Value */}
                  <input
                    type="number" placeholder="500" min="0"
                    value={q.value}
                    onChange={(e) => updateQty(index, "value", e.target.value)}
                    style={S.qtyInput}
                    required
                  />

                  {/* Unit */}
                  <select
                    value={q.unit}
                    onChange={(e) => updateQty(index, "unit", e.target.value)}
                    style={S.qtyInput}
                  >
                    {unitOptions.map((u) => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>

                  {/* Selling Price */}
                  <div style={S.priceWrap}>
                    <span style={S.rupee}>₹</span>
                    <input
                      type="number" placeholder="Price" min="0"
                      value={q.price}
                      onChange={(e) => updateQty(index, "price", e.target.value)}
                      style={S.priceInput}
                      required
                    />
                  </div>

                  {/* MRP */}
                  <div style={{ position: "relative" }}>
                    <span style={S.rupee}>₹</span>
                    <input
                      type="number" placeholder="MRP" min="0"
                      value={q.originalPrice}
                      onChange={(e) => updateQty(index, "originalPrice", e.target.value)}
                      style={S.priceInput}
                    />
                    {discount > 0 && (
                      <span style={{
                        position: "absolute", top: -8, right: 6,
                        fontSize: 9, fontWeight: 700,
                        background: "#DCFCE7", color: "#16A34A",
                        padding: "1px 6px", borderRadius: 10,
                      }}>
                        {discount}% off
                      </span>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeQtyRow(index)}
                    disabled={quantities.length === 1}
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      border: "1px solid #FECDD3",
                      background: quantities.length === 1 ? "#F8FAFC" : "#FFF1F2",
                      color: quantities.length === 1 ? "#CBD5E1" : "#E11D48",
                      cursor: quantities.length === 1 ? "not-allowed" : "pointer",
                      fontSize: 14, display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}
                  >
                    ✕
                  </button>

                </div>
              );
            })}

            <button
              type="button" onClick={addQtyRow}
              style={{
                marginTop: 4, background: "none", border: "none",
                color: "#16A34A", fontSize: 13, fontWeight: 700,
                cursor: "pointer", padding: "6px 0",
                display: "flex", alignItems: "center", gap: 4,
                fontFamily: "inherit",
              }}
            >
              + Add another size option
            </button>
          </div>

          {/* ── Submit ── */}
          <button type="submit" disabled={loading} style={S.submitBtn}>
            {loading ? (
              <>
                <span style={{
                  width: 16, height: 16,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff", borderRadius: "50%",
                  display: "inline-block",
                  animation: "addprodSpin 0.7s linear infinite",
                }} />
                {isEdit ? "Updating..." : "Adding Product..."}
              </>
            ) : (
              isEdit ? "✓ Update Product" : "✓ Add Product"
            )}
          </button>

        </form>
      </div>

      <style>{`
        @keyframes addprodSpin { to { transform: rotate(360deg); } }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.5; }
      `}</style>
    </div>
  );
};

export default AddProduct;