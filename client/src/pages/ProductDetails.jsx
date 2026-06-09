import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

// ── Star Rating ───────────────────────────────────────────────────────────────
const StarRating = ({ rating = 4, count = 0 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <div style={{ display: "flex", gap: 2 }}>
      {Array(5).fill("").map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24"
          fill={i < Math.floor(rating) ? "#FACC15" : i < rating ? "#FACC15" : "none"}
          stroke="#FACC15" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
    <span style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>
      {rating.toFixed(1)} ({count} reviews)
    </span>
  </div>
);

// ── Trust Badge ───────────────────────────────────────────────────────────────
const TrustBadge = ({ icon, text }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 14px", background: "#F8FAFC",
    borderRadius: 10, border: "1px solid #F1F5F9", flex: 1,
  }}>
    <span style={{ fontSize: 18 }}>{icon}</span>
    <span style={{ fontSize: 12, color: "#475569", fontWeight: 500, lineHeight: 1.3 }}>{text}</span>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const ProductDetails = () => {
  const { products, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();

  const [selectedOption, setSelectedOption] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [qty, setQty] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [imgZoom, setImgZoom] = useState(false);

  const product = products.find((item) => item._id === id);

  useEffect(() => {
    if (products.length > 0 && product) {
      const filtered = products
        .filter((item) => item.category === product.category && item._id !== product._id)
        .slice(0, 5);
      setRelatedProducts(filtered);
    }
  }, [products, product]);

  useEffect(() => {
    if (product?.quantityOptions?.length > 0) {
      setSelectedOption(product.quantityOptions[0]);
    }
  }, [product]);

  useEffect(() => {
    if (product?.image?.length > 0) {
      setThumbnail(product.image[0]);
    }
  }, [product]);

  // scroll to top when product changes
  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  const handleAddToCart = () => {
    if (!selectedOption) return;
    for (let i = 0; i < qty; i++) addToCart(product, selectedOption);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedOption) return;
    addToCart(product, selectedOption);
    navigate("/cart");
  };

  // discount calc
  const discount = selectedOption?.originalPrice
    ? Math.round(((selectedOption.originalPrice - selectedOption.price) / selectedOption.originalPrice) * 100)
    : 0;

  if (!product) return (
    <div style={{ textAlign: "center", padding: "80px 20px", color: "#94A3B8" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
      <p style={{ fontSize: 18, fontWeight: 600, color: "#0F172A" }}>Product not found</p>
      <button onClick={() => navigate("/products")}
        style={{ marginTop: 16, padding: "10px 24px", background: "#16A34A",
          color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>
        Browse Products
      </button>
    </div>
  );

  return (
    <div style={{ marginTop: 24, marginBottom: 64, fontFamily: "'Outfit', 'Roboto', sans-serif" }}>

      {/* ── Breadcrumb ── */}
      <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13,
        color: "#94A3B8", marginBottom: 28, flexWrap: "wrap" }}>
        {[
          { label: "Home",     to: "/" },
          { label: "Products", to: "/products" },
          { label: product.category, to: `/products/${product.category.toLowerCase()}` },
        ].map((crumb, i) => (
          <React.Fragment key={i}>
            <Link to={crumb.to} style={{ color: "#94A3B8", textDecoration: "none",
              transition: "color 0.15s" }}
              onMouseOver={e => e.target.style.color = "#16A34A"}
              onMouseOut={e  => e.target.style.color = "#94A3B8"}>
              {crumb.label}
            </Link>
            <span style={{ color: "#E2E8F0" }}>/</span>
          </React.Fragment>
        ))}
        <span style={{ color: "#0F172A", fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* ── Main product section ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 48, alignItems: "start",
      }}
        className="product-detail-grid">

        {/* ── LEFT: Image gallery ── */}
        <div style={{ display: "flex", gap: 14 }}>

          {/* Thumbnails */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {product.image.map((img, i) => (
              <div key={i} onClick={() => setThumbnail(img)}
                style={{
                  width: 68, height: 68, borderRadius: 12, overflow: "hidden",
                  cursor: "pointer", flexShrink: 0,
                  border: thumbnail === img
                    ? "2px solid #16A34A"
                    : "2px solid #F1F5F9",
                  transition: "border-color 0.2s",
                  background: "#F8FAFC",
                }}>
                <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>

          {/* Main image */}
          <div style={{
            flex: 1, borderRadius: 20, overflow: "hidden",
            background: "#F8FAFC", border: "1px solid #F1F5F9",
            position: "relative", cursor: "zoom-in",
            aspectRatio: "1/1",
          }}
            onClick={() => setImgZoom(!imgZoom)}>
            <img src={thumbnail} alt={product.name}
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                transition: "transform 0.3s",
                transform: imgZoom ? "scale(1.08)" : "scale(1)",
              }} />

            {/* Discount badge on image */}
            {discount > 0 && (
              <div style={{
                position: "absolute", top: 14, left: 14,
                background: "#EF4444", color: "#fff",
                fontSize: 12, fontWeight: 700,
                padding: "4px 10px", borderRadius: 20,
              }}>
                {discount}% OFF
              </div>
            )}

            {/* Organic badge */}
            <div style={{
              position: "absolute", top: 14, right: 14,
              background: "rgba(255,255,255,0.92)",
              border: "1px solid #BBF7D0",
              fontSize: 11, fontWeight: 600, color: "#16A34A",
              padding: "4px 10px", borderRadius: 20,
              display: "flex", alignItems: "center", gap: 4,
            }}>
              🌿 Fresh
            </div>
          </div>
        </div>

        {/* ── RIGHT: Product info ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

          {/* Category tag */}
          <span style={{
            display: "inline-block", fontSize: 11, fontWeight: 700,
            color: "#16A34A", background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            padding: "3px 10px", borderRadius: 20,
            marginBottom: 12, width: "fit-content",
            textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            {product.category}
          </span>

          {/* Product name */}
          <h1 style={{
            fontSize: 30, fontWeight: 800, color: "#0F172A",
            margin: "0 0 12px", letterSpacing: "-0.5px", lineHeight: 1.2,
          }}>
            {product.name}
          </h1>

          {/* Star rating */}
          <div style={{ marginBottom: 18 }}>
            <StarRating rating={4.2} count={28} />
          </div>

          {/* Price block */}
          <div style={{
            background: "#F8FAFC", borderRadius: 16, padding: "16px 20px",
            border: "1px solid #F1F5F9", marginBottom: 20,
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: "#0F172A" }}>
                {currency}{selectedOption?.price}
              </span>
              {selectedOption?.originalPrice && (
                <span style={{ fontSize: 16, color: "#94A3B8",
                  textDecoration: "line-through" }}>
                  {currency}{selectedOption.originalPrice}
                </span>
              )}
              {discount > 0 && (
                <span style={{
                  fontSize: 13, fontWeight: 700, color: "#16A34A",
                  background: "#DCFCE7", padding: "2px 8px", borderRadius: 20,
                }}>
                  Save {currency}{selectedOption.originalPrice - selectedOption.price}
                </span>
              )}
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "#94A3B8" }}>
              Inclusive of all taxes
            </p>
          </div>

          {/* Quantity options */}
          {product.quantityOptions?.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <p style={{
                fontSize: 12, fontWeight: 700, color: "#64748B",
                textTransform: "uppercase", letterSpacing: "0.08em",
                marginBottom: 10,
              }}>
                Select Size / Weight
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {product.quantityOptions.map((opt) => {
                  const isSelected =
                    selectedOption?.value === opt.value &&
                    selectedOption?.unit === opt.unit;
                  const optDiscount = opt.originalPrice
                    ? Math.round(((opt.originalPrice - opt.price) / opt.originalPrice) * 100)
                    : 0;
                  return (
                    <div key={`${opt.value}-${opt.unit}`}
                      onClick={() => { setSelectedOption(opt); setQty(1); }}
                      style={{
                        position: "relative", cursor: "pointer",
                        padding: "10px 14px", borderRadius: 12, minWidth: 80,
                        border: isSelected
                          ? "2px solid #16A34A"
                          : "2px solid #E2E8F0",
                        background: isSelected ? "#F0FDF4" : "#fff",
                        transition: "all 0.15s", textAlign: "center",
                      }}>
                      {optDiscount > 0 && (
                        <span style={{
                          position: "absolute", top: -8, left: "50%",
                          transform: "translateX(-50%)",
                          background: "#3B82F6", color: "#fff",
                          fontSize: 9, fontWeight: 700,
                          padding: "2px 6px", borderRadius: 10,
                          whiteSpace: "nowrap",
                        }}>
                          {optDiscount}% OFF
                        </span>
                      )}
                      <p style={{
                        margin: 0, fontSize: 13, fontWeight: 700,
                        color: isSelected ? "#16A34A" : "#0F172A",
                      }}>
                        {opt.value} {opt.unit}
                      </p>
                      <p style={{
                        margin: "3px 0 0", fontSize: 13, fontWeight: 800,
                        color: isSelected ? "#16A34A" : "#0F172A",
                      }}>
                        ₹{opt.price}
                      </p>
                      {opt.originalPrice && (
                        <p style={{
                          margin: "1px 0 0", fontSize: 11,
                          color: "#94A3B8", textDecoration: "line-through",
                        }}>
                          ₹{opt.originalPrice}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Qty counter + Add to cart */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>

            {/* Qty stepper */}
            <div style={{
              display: "flex", alignItems: "center",
              border: "1px solid #E2E8F0", borderRadius: 12,
              overflow: "hidden", background: "#fff",
            }}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{
                  width: 40, height: 44, border: "none", background: "none",
                  cursor: "pointer", fontSize: 18, color: "#374151",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>−</button>
              <span style={{
                width: 40, textAlign: "center", fontWeight: 700,
                fontSize: 15, color: "#0F172A",
              }}>{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                style={{
                  width: 40, height: 44, border: "none", background: "none",
                  cursor: "pointer", fontSize: 18, color: "#374151",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>+</button>
            </div>

            {/* Add to cart */}
            <button onClick={handleAddToCart}
              style={{
                flex: 1, height: 44, borderRadius: 12,
                border: "2px solid #16A34A",
                background: addedFeedback ? "#16A34A" : "#fff",
                color: addedFeedback ? "#fff" : "#16A34A",
                fontWeight: 700, fontSize: 14, cursor: "pointer",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
              {addedFeedback ? "✓ Added!" : "Add to Cart"}
            </button>

            {/* Buy now */}
            <button onClick={handleBuyNow}
              style={{
                flex: 1, height: 44, borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #16A34A, #22C55E)",
                color: "#fff", fontWeight: 700, fontSize: 14,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
                transition: "all 0.2s",
              }}>
              Buy Now →
            </button>
          </div>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            <TrustBadge icon="🚚" text="Fast delivery in 30–60 min" />
            <TrustBadge icon="🌿" text="100% Fresh & Organic" />
            <TrustBadge icon="↩️" text="Easy returns within 24h" />
          </div>

          {/* Tabs — About / Delivery */}
          <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 20 }}>
            <div style={{ display: "flex", gap: 0, marginBottom: 16,
              borderBottom: "1px solid #F1F5F9" }}>
              {["about", "delivery"].map((tab) => (
                <button key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "8px 20px", border: "none", background: "none",
                    cursor: "pointer", fontSize: 13, fontWeight: 600,
                    color: activeTab === tab ? "#16A34A" : "#94A3B8",
                    borderBottom: activeTab === tab
                      ? "2px solid #16A34A" : "2px solid transparent",
                    marginBottom: -1, textTransform: "capitalize",
                    transition: "all 0.15s",
                  }}>
                  {tab === "about" ? "About Product" : "Delivery Info"}
                </button>
              ))}
            </div>

            {activeTab === "about" && (
              <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
                {product.description.map((desc, i) => (
                  <li key={i} style={{
                    fontSize: 14, color: "#475569", lineHeight: 1.7,
                    marginBottom: 4,
                  }}>
                    {desc}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "delivery" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: "⏱", title: "Express Delivery", desc: "30–60 minutes in selected areas" },
                  { icon: "📍", title: "Delivery Areas",   desc: "Tezpur and nearby areas" },
                  { icon: "💰", title: "Free Delivery",    desc: "On orders above ₹499" },
                  { icon: "↩️", title: "Easy Returns",     desc: "Within 24h for damaged items" },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 12, alignItems: "flex-start",
                    padding: "10px 14px", background: "#F8FAFC",
                    borderRadius: 10, border: "1px solid #F1F5F9",
                  }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
                        {item.title}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748B" }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: 64 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
            <h2 style={{
              fontSize: 26, fontWeight: 800, color: "#0F172A",
              margin: 0, letterSpacing: "-0.3px",
            }}>
              Related Products
            </h2>
            <div style={{
              width: 48, height: 3, background: "#16A34A",
              borderRadius: 2, marginTop: 8,
            }} />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 16,
          }}>
            {relatedProducts
              .filter((p) => p.inStock !== false)
              .map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button
              onClick={() => { navigate("/products"); scrollTo(0, 0); }}
              style={{
                padding: "12px 32px", border: "1.5px solid #16A34A",
                borderRadius: 10, background: "#fff", color: "#16A34A",
                fontWeight: 700, fontSize: 14, cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "#F0FDF4"; }}
              onMouseOut={e  => { e.currentTarget.style.background = "#fff"; }}>
              See All Products →
            </button>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>

    </div>
  );
};

export default ProductDetails;