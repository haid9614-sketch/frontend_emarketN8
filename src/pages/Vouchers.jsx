import { useState, useEffect } from "react";
import bigBran from "../assets/voucher/banDvaC.png"; // Link ảnh banner to
import cardBg1 from "../assets/voucher/card1test.png"; // Ảnh nền local 1
import cardBg2 from "../assets/voucher/card2test.png"; // Ảnh nền local 2
import cardBg3 from "../assets/voucher/card3test.jpg";
/* ─── ICONS ────────────────────────────────────────────── */
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

// Hàm IconStarbucksLogoWhite cũ đã được xóa bỏ để code gọn gàng sạch sẽ

/* ─── MOCK DATA ────────────────────────────────────────── */
const MOCK_VOUCHERS = [
  { idVoucher: 1, discount: 50000, quantity: 150 },
  { idVoucher: 2, discount: 20000, quantity: 50 },
  { idVoucher: 3, discount: 100000, quantity: 15 },
  { idVoucher: 4, discount: 30000, quantity: 80 },
  { idVoucher: 5, discount: 15000, quantity: 200 },
  { idVoucher: 6, discount: 250000, quantity: 5 },
];

// Mảng tự động bốc ảnh cục bộ lặp lại làm nền
const BG_IMAGES = [cardBg1, cardBg2, cardBg3];

/* ─── COMPONENT ────────────────────────────────────────── */
export default function Vouchers({ onBack }) {
  // Luôn cuộn lên trên cùng khi mở 
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--neutral-warm)",
        display: "flex",
        flexDirection: "column",
        paddingBottom: "6rem",
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
            Voucher
          </span>
        </p>
      </header>

      {/* ── ẢNH HERO TRÀN VIỀN ── */}
      <div
        style={{
          width: "100%",
          height: "480px",
          position: "relative",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          marginBottom: "4rem",
        }}
      >
        <img
          src={bigBran}
          alt="Voucher Banner"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.05)",
          }}
        />
      </div>

      {/* ── KHU VỰC LƯỚI VOUCHER ── */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
          padding: "0 2.4rem",
        }}
      >
        <h2
          style={{
            fontSize: "2.8rem",
            fontWeight: 800,
            color: "var(--text-black)",
            marginBottom: "2.4rem",
            letterSpacing: "-0.02em",
          }}
        >
          Voucher của bạn:
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2.4rem",
          }}
        >
          {MOCK_VOUCHERS.map((v, index) => {
            const bgImg = BG_IMAGES[index % BG_IMAGES.length];

            return (
              <div
                key={v.idVoucher}
                style={{
                  position: "relative",
                  height: "210px",
                  borderRadius: "1.6rem",
                  overflow: "hidden",
                  boxShadow: "var(--card-shadow)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "2.4rem",
                }}
              >
                {/* Background Blur */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `url(${bgImg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(3px)",
                    transform: "scale(1)",
                    zIndex: 0,
                  }}
                />
                {/* Lớp Overlay xanh đậm */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(30, 57, 50, 0.40)",
                    zIndex: 1,
                  }}
                />

                {/* Nội dung Card - Đã loại bỏ hoàn toàn khối lồng Icon Logo cũ */}
                <div style={{ position: "relative", zIndex: 2, color: "#fff" }}>
                  <p
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginBottom: "0.4rem",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    eMarket Reward
                  </p>

                  <h3
                    style={{
                      fontSize: "3.2rem",
                      fontWeight: 800,
                      lineHeight: 1.2,
                      marginBottom: "1.6rem",
                      textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    }}
                  >
                    Giảm {v.discount.toLocaleString("vi-VN")} ₫
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: 600,
                        background: "rgba(0,0,0,0.35)",
                        padding: "0.4rem 1.2rem",
                        borderRadius: "20px",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      Còn lại: {v.quantity}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
