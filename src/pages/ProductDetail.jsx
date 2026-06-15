import { useState } from "react";

/* ══════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════ */
function IconArrowLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M11 14L6 9l5-5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLeaf() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M2 13C4 10 6 7 12 3C12 3 11 9 7 11C5 12 3.5 12.5 2 13Z"
        fill="rgba(255,255,255,0.7)"
        stroke="none"
      />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path
        d="M7.5 1.5L2 4v4c0 3 2.5 5.5 5.5 6 3-0.5 5.5-3 5.5-6V4L7.5 1.5z"
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.3"
      />
      <path
        d="M5 7.5l1.8 1.8 3.2-3.2"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconTruck() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect
        x="1"
        y="4"
        width="9"
        height="6"
        rx="1"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.2"
      />
      <path
        d="M10 6h2.5l1.5 2.5V10h-4V6z"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.2"
      />
      <circle cx="4" cy="11.5" r="1.2" fill="rgba(255,255,255,0.7)" />
      <circle cx="11.5" cy="11.5" r="1.2" fill="rgba(255,255,255,0.7)" />
    </svg>
  );
}

const FEATURES = [
  { icon: <IconLeaf />, text: "Chọn lọc kỹ càng" },
  { icon: <IconShield />, text: "Vệ sinh an toàn" },
  { icon: <IconTruck />, text: "Giao hàng nhanh" },
];

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function ProductDetail({ product, onBack, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onBack();
    }, 900);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--neutral-warm)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Manrope','Helvetica Neue',Helvetica,Arial,sans-serif",
        paddingBottom: "5.6rem", // Thêm padding đáy để không bị thanh footer đè lên nội dung
      }}
    >
      {/* ── HEADER ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
          padding: "1.6rem 4rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "var(--green-accent)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--btn-radius)",
            padding: "0.7rem 1.8rem 0.7rem 1.2rem",
            fontSize: "1.4rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            letterSpacing: "-0.01em",
            boxShadow: "0 2px 6px rgba(0,117,74,0.22)",
            transition: "transform 0.15s, background 0.15s",
            width: "fit-content",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#006241")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--green-accent)")
          }
        >
          <IconArrowLeft />
          Quay lại
        </button>

        {/* Breadcrumb - Tự động nội suy Tên sản phẩm */}
        <p
          style={{
            fontSize: "1.3rem",
            color: "var(--text-black-soft)",
            letterSpacing: "-0.01em",
          }}
        >
          <span
            style={{
              color: "var(--green-accent)",
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={onBack}
          >
            eMarket
          </span>
          <span style={{ margin: "0 0.5rem", opacity: 0.4 }}>/</span>
          <span style={{ color: "var(--text-black-soft)" }}>
            Chất lượng &amp; Dịch vụ
          </span>
          <span style={{ margin: "0 0.5rem", opacity: 0.4 }}>/</span>
          <span style={{ color: "var(--text-black)", fontWeight: 600 }}>
            {product.name}
          </span>
        </p>
      </header>

      {/* ── HERO BAND ── */}
      <section
        style={{
          width: "100%",
          background: "var(--green-house)",
          padding: "5.6rem 4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            right: "-8rem",
            top: "-8rem",
            width: "40rem",
            height: "40rem",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "30%",
            bottom: "-10rem",
            width: "28rem",
            height: "28rem",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.025)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1040px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "6rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Product image */}
          <div style={{ flexShrink: 0 }}>
            <div
              style={{
                width: "38rem",
                height: "38rem",
                borderRadius: "2rem",
                background: "rgba(255,255,255,0.07)",
                padding: "1.2rem",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "1.4rem",
                  background: product.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11rem",
                  boxShadow:
                    "0 32px 64px rgba(0,0,0,0.6), 0 16px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              >
                {product.emoji}
              </div>
            </div>
          </div>

          {/* Text + feature pills (Đã xóa tag Category Nổi Bật) */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "2.4rem",
            }}
          >
            {/* Description - Map với DTO nếu có, không thì lấy text tĩnh */}
            <div>
              <p
                style={{
                  color: "var(--text-white)",
                  fontSize: "1.75rem",
                  lineHeight: 1.7,
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  marginBottom: "1.6rem",
                }}
              >
                {product.description ||
                  "Sản phẩm tươi ngon, được hệ thống eMarket chọn lọc kỹ càng để mang đến chất lượng tốt nhất cho bạn và gia đình."}
              </p>
              <p
                style={{
                  color: "var(--text-white-soft)",
                  fontSize: "1.55rem",
                  lineHeight: 1.65,
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                }}
              >
                Đóng gói cẩn thận, đảm bảo vệ sinh an toàn thực phẩm. Bảo quản
                đúng cách giúp giữ trọn hương vị tự nhiên.
              </p>
            </div>

            {/* Feature pills */}
            <div style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap" }}>
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.65rem 1.4rem",
                    borderRadius: "var(--btn-radius)",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.13)",
                  }}
                >
                  {f.icon}
                  <span
                    style={{
                      color: "rgba(255,255,255,0.75)",
                      fontSize: "1.3rem",
                      fontWeight: 600,
                    }}
                  >
                    {f.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INFO SECTION ── */}
      <main
        style={{
          flex: 1,
          background: "var(--neutral-warm)",
          padding: "5rem 4rem",
        }}
      >
        <div
          style={{
            maxWidth: "1040px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "4rem",
            flexWrap: "wrap",
          }}
        >
          {/* LEFT: Name + Price + Unit */}
          <div style={{ flex: "1 1 300px" }}>
            <h1
              style={{
                fontSize: "3.2rem",
                fontWeight: 800,
                color: "var(--text-black)",
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
                marginBottom: "1.4rem",
              }}
            >
              {product.name}
            </h1>

            <div
              style={{
                height: "3px",
                width: "7rem",
                background: "var(--green-accent)",
                borderRadius: "3px",
                marginBottom: "2rem",
              }}
            />

            {/* Cụm Giá + Đơn vị */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}
            >
              <p
                style={{
                  fontSize: "3rem",
                  fontWeight: 800,
                  color: "var(--green-starbucks)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {product.price}
              </p>
              {/* Thẻ Đơn vị - Ánh xạ thẳng vào product.unit */}
              <span
                style={{
                  padding: "0.4rem 1.2rem",
                  background: "rgba(0,0,0,0.05)",
                  borderRadius: "var(--btn-radius)",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "var(--text-black-soft)",
                }}
              >
                {product.unit || "500g / gói"}
              </span>
            </div>
          </div>

          {/* RIGHT: Stepper + CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              flexShrink: 0,
              flexWrap: "wrap",
            }}
          >
            {/* Quantity stepper */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#fff",
                borderRadius: "var(--btn-radius)",
                border: "1.5px solid rgba(0,0,0,0.13)",
                overflow: "hidden",
                boxShadow: "var(--card-shadow)",
              }}
            >
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{
                  width: "4.4rem",
                  height: "4.4rem",
                  fontSize: "2rem",
                  fontWeight: 500,
                  color:
                    quantity > 1 ? "var(--green-accent)" : "rgba(0,0,0,0.25)",
                  background: "none",
                  border: "none",
                  cursor: quantity > 1 ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  if (quantity > 1)
                    e.currentTarget.style.background = "#f5f5f4";
                }}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                −
              </button>

              <div
                style={{
                  width: "1px",
                  height: "2.4rem",
                  background: "rgba(0,0,0,0.1)",
                }}
              />

              <span
                style={{
                  width: "5.2rem",
                  textAlign: "center",
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  color: "var(--text-black)",
                  userSelect: "none",
                }}
              >
                {quantity}
              </span>

              <div
                style={{
                  width: "1px",
                  height: "2.4rem",
                  background: "rgba(0,0,0,0.1)",
                }}
              />

              <button
                onClick={() => setQuantity((q) => q + 1)}
                style={{
                  width: "4.4rem",
                  height: "4.4rem",
                  fontSize: "2rem",
                  fontWeight: 500,
                  color: "var(--green-accent)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f5f5f4")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                +
              </button>
            </div>

            {/* CTA button */}
            <button
              onClick={handleAdd}
              style={{
                padding: "1.4rem 3.8rem",
                borderRadius: "var(--btn-radius)",
                background: added
                  ? "var(--green-starbucks)"
                  : "var(--green-accent)",
                color: "#fff",
                fontSize: "1.6rem",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                letterSpacing: "-0.01em",
                boxShadow: "0 4px 14px rgba(0,117,74,0.28)",
                transition: "transform 0.15s, background 0.2s, box-shadow 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.95)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseEnter={(e) => {
                if (!added) e.currentTarget.style.background = "#006241";
              }}
              onMouseLeave={(e) => {
                if (!added)
                  e.currentTarget.style.background = "var(--green-accent)";
              }}
            >
              {added ? "✓ Đã thêm vào giỏ!" : "Thêm vào giỏ hàng"}
            </button>
          </div>
        </div>
      </main>

      {/* ── STICKY FOOTER BAND ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 90, 
          height: "5.6rem",
          background: "var(--green-house)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.15)", 
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "1.3rem",
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}
        >
          eMarket — Chất lượng &amp; Dịch vụ
        </p>
      </div>
    </div>
  );
}
