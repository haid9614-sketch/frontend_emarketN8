import { useState, useEffect, useRef, useLayoutEffect } from "react";
import BranchPopup from "./BranchPopup";
import logo from "../assets/logoDS.JPG";

/* ══════════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════════ */
const NAV_TABS = [
  { id: "home", label: "Trang chủ" },
  { id: "address", label: "Địa chỉ của bạn" },
  { id: "voucher", label: "Voucher" },
];

const CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "meat", label: "Thịt cá" },
  { id: "veggie", label: "Rau củ" },
  { id: "fruit", label: "Hoa quả" },
  { id: "household", label: "Đồ gia dụng" },
  { id: "snack", label: "Đồ ăn vặt" },
  { id: "packaged", label: "Đồ đóng gói sẵn" },
];

const BANNERS = [
  {
    id: 1,
    bg: "linear-gradient(120deg, #1E3932 0%, #006241 60%, #2b5148 100%)",
    discount: "20%",
    title: "MỌI MÓN ĐỀU NGON VỚI MEAT Deli",
    sub: "GIÁ TRỊ SẢN PHẨM",
    accent: "#cba258",
  },
  {
    id: 2,
    bg: "linear-gradient(120deg, #00754A 0%, #d4e9e2 100%)",
    discount: "15%",
    title: "RAU CỦ QUẢ TƯƠI SẠCH MỖI NGÀY",
    sub: "CHO ĐƠN HÀNG ĐẦU TIÊN",
    accent: "#1E3932",
  },
  {
    id: 3,
    bg: "linear-gradient(120deg, #cba258 0%, #1E3932 100%)",
    discount: "10%",
    title: "HOA QUẢ NHẬP KHẨU CAO CẤP",
    sub: "ƯU ĐÃI HỘI VIÊN",
    accent: "#fff",
  },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Trending Coffee",
    cat: "all",
    emoji: "☕",
    bg: "linear-gradient(135deg,#e8c9a0,#c8955a)",
    price: "65.000₫",
  },
  {
    id: 2,
    name: "Energy Refreshers",
    cat: "snack",
    emoji: "🧃",
    bg: "linear-gradient(135deg,#f5d8e8,#d888b8)",
    price: "75.000₫",
  },
  {
    id: 3,
    name: "Energy Refreshers",
    cat: "snack",
    emoji: "🍹",
    bg: "linear-gradient(135deg,#fde8a0,#f5b040)",
    price: "72.000₫",
  },
  {
    id: 4,
    name: "Thịt Bò Wagyu",
    cat: "meat",
    emoji: "🥩",
    bg: "linear-gradient(135deg,#e8a090,#c05040)",
    price: "320.000₫",
  },
  {
    id: 5,
    name: "Tôm Sú Tươi",
    cat: "meat",
    emoji: "🦐",
    bg: "linear-gradient(135deg,#f5c0a0,#e07050)",
    price: "180.000₫",
  },
  {
    id: 6,
    name: "Cá Hồi Na Uy",
    cat: "meat",
    emoji: "🐟",
    bg: "linear-gradient(135deg,#f0a0c0,#d04080)",
    price: "250.000₫",
  },
  {
    id: 7,
    name: "Cà Rốt Hữu Cơ",
    cat: "veggie",
    emoji: "🥕",
    bg: "linear-gradient(135deg,#fdc880,#e87820)",
    price: "25.000₫",
  },
  {
    id: 8,
    name: "Bông Cải Xanh",
    cat: "veggie",
    emoji: "🥦",
    bg: "linear-gradient(135deg,#a0e0a0,#40a040)",
    price: "30.000₫",
  },
  {
    id: 9,
    name: "Rau Cải Baby",
    cat: "veggie",
    emoji: "🥬",
    bg: "linear-gradient(135deg,#90e090,#409040)",
    price: "20.000₫",
  },
  {
    id: 10,
    name: "Táo Fuji Nhật",
    cat: "fruit",
    emoji: "🍎",
    bg: "linear-gradient(135deg,#f08080,#c03030)",
    price: "85.000₫",
  },
  {
    id: 11,
    name: "Xoài Cát Hòa Lộc",
    cat: "fruit",
    emoji: "🥭",
    bg: "linear-gradient(135deg,#fdc860,#e88010)",
    price: "60.000₫",
  },
  {
    id: 12,
    name: "Nho Đen Mỹ",
    cat: "fruit",
    emoji: "🍇",
    bg: "linear-gradient(135deg,#c0a0e0,#7040a0)",
    price: "120.000₫",
  },
  {
    id: 13,
    name: "Nồi Cơm Điện",
    cat: "household",
    emoji: "🍚",
    bg: "linear-gradient(135deg,#a0b0d0,#607090)",
    price: "450.000₫",
  },
  {
    id: 14,
    name: "Chảo Chống Dính",
    cat: "household",
    emoji: "🍳",
    bg: "linear-gradient(135deg,#b0c0c0,#607070)",
    price: "280.000₫",
  },
  {
    id: 15,
    name: "Snack Khoai Tây",
    cat: "snack",
    emoji: "🥔",
    bg: "linear-gradient(135deg,#f0d890,#c8a030)",
    price: "35.000₫",
  },
  {
    id: 16,
    name: "Mì Ăn Liền",
    cat: "packaged",
    emoji: "🍜",
    bg: "linear-gradient(135deg,#f5a870,#d06020)",
    price: "15.000₫",
  },
  {
    id: 17,
    name: "Chả Giò Hải Sản",
    cat: "packaged",
    emoji: "🥟",
    bg: "linear-gradient(135deg,#f0b0a0,#d05040)",
    price: "55.000₫",
  },
  {
    id: 18,
    name: "Cháo Ăn Liền",
    cat: "packaged",
    emoji: "🥣",
    bg: "linear-gradient(135deg,#f5e090,#c8a030)",
    price: "18.000₫",
  },
];

/* ══════════════════════════════════════════════════════════
   ICONS (inline SVG)
══════════════════════════════════════════════════════════ */
function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle
        cx="7.5"
        cy="7.5"
        r="5.5"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="1.6"
      />
      <path
        d="M11.5 11.5L16 16"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconOrder({ color = "white" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );
}

function IconCart({ color = "white" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M2 2h2.5l2.2 11h9.8l2-8H5.8"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="18.5" r="1.5" fill={color} />
      <circle cx="16" cy="18.5" r="1.5" fill={color} />
    </svg>
  );
}

function IconPin({ color = "currentColor" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1C4.79 1 3 2.79 3 5c0 3.5 4 8 4 8s4-4.5 4-8c0-2.21-1.79-4-4-4z"
        fill={color}
      />
      <circle cx="7" cy="5" r="1.5" fill="white" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   HOME PAGE COMPONENT
══════════════════════════════════════════════════════════ */
export default function Home({
  user,
  onLoginClick,
  onLogout,
  onProductClick,
  onCartClick,
  onVoucherClick,
}) {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCat, setSelectedCat] = useState("all");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [cartCount, setCartCount] = useState(2);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef({});

  useLayoutEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeTab]);

  useEffect(() => {
    const t = setInterval(
      () => setBannerIdx((i) => (i + 1) % BANNERS.length),
      5000,
    );
    return () => clearInterval(t);
  }, []);

  const visibleProducts = PRODUCTS.filter((p) => {
    const matchCat = selectedCat === "all" || p.cat === selectedCat;
    const matchQ =
      appliedQuery === "" ||
      p.name.toLowerCase().includes(appliedQuery.toLowerCase());
    return matchCat && matchQ;
  });

  const addToCart = () => setCartCount((c) => c + 1);
  const branchLabel = selectedBranch?.name ?? null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--neutral-warm)",
        paddingBottom: "6rem",
      }}
    >
      {/* ── STICKY TOP NAVBAR ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#fff",
          boxShadow: "var(--nav-shadow)",
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            padding: "0 2.4rem",
            height: "7.2rem",
          }}
        >
          {/* Logo */}
          <div style={{ flexShrink: 0 }}>
            <img
              src={logo}
              alt="Logo"
              style={{ width: "60px", height: "60px", borderRadius: "50%" }}
            />
          </div>

          {/* Nav tabs + sliding indicator */}
          <div style={{ position: "relative", display: "flex" }}>
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                ref={(el) => (tabRefs.current[tab.id] = el)}
                onClick={() => {
                  if (tab.id === "voucher") {
                    onVoucherClick(); // Chuyển sang trang Voucher độc lập
                  } else {
                    setActiveTab(tab.id); // Đổi tab bình thường
                  }
                }}
                style={{
                  padding: "0 1.6rem",
                  height: "7.2rem",
                  fontSize: "1.5rem",
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: "var(--text-black)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                  letterSpacing: "-0.01em",
                }}
              >
                {tab.label}
              </button>
            ))}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                height: "3px",
                background: "var(--green-accent)",
                borderRadius: "3px 3px 0 0",
                left: indicatorStyle.left + "px",
                width: indicatorStyle.width + "px",
                transition:
                  "left 0.28s cubic-bezier(.4,0,.2,1), width 0.28s cubic-bezier(.4,0,.2,1)",
              }}
            />
          </div>

          {/* Search bar */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAppliedQuery(searchQuery);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                background: "var(--green-house)",
                borderRadius: "var(--btn-radius)",
                padding: "0.85rem 1.8rem",
                margin: 0,
              }}
            >
              <button
                type="submit"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <IconSearch />
              </button>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: "1.5rem",
                  fontFamily: "inherit",
                  letterSpacing: "-0.01em",
                  "::placeholder": { color: "rgba(255,255,255,0.55)" },
                }}
              />
            </form>
          </div>

          {/* Branch / location button */}
          <button
            onClick={() => setShowPopup(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.8rem 1.4rem",
              borderRadius: "var(--btn-radius)",
              background: showPopup ? "var(--green-house)" : "transparent",
              border: `1px solid ${showPopup ? "var(--green-house)" : "rgba(0,0,0,0.25)"}`,
              color: showPopup ? "#fff" : "var(--text-black)",
              fontSize: "1.4rem",
              fontWeight: showPopup ? 700 : 500,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <IconPin color={showPopup ? "#fff" : "var(--green-accent)"} />
            {branchLabel ? (
              <span style={{ fontWeight: showPopup ? 800 : 600 }}>
                {branchLabel}
              </span>
            ) : (
              <span
                style={{ color: showPopup ? "#fff" : "var(--text-black-soft)" }}
              >
                Chọn chi nhánh
              </span>
            )}
          </button>

          {/* Auth area */}
          {user ? (
            <button
              onClick={onLogout}
              title="Nhấn để đăng xuất"
              style={{
                padding: "0.7rem 1.8rem",
                borderRadius: "var(--btn-radius)",
                background: "var(--green-accent)",
                color: "#fff",
                fontSize: "1.4rem",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                letterSpacing: "-0.01em",
                flexShrink: 0,
                transition: "transform 0.15s",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.95)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {user.name}
            </button>
          ) : (
            <div style={{ display: "flex", gap: "0.8rem", flexShrink: 0 }}>
              <button
                onClick={onLoginClick}
                style={{
                  padding: "0.7rem 1.6rem",
                  borderRadius: "var(--btn-radius)",
                  background: "transparent",
                  border: "1px solid rgba(0,0,0,0.87)",
                  color: "var(--text-black)",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "transform 0.15s",
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.95)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Sign in
              </button>
              <button
                onClick={onLoginClick}
                style={{
                  padding: "0.7rem 1.6rem",
                  borderRadius: "var(--btn-radius)",
                  background: "#000",
                  color: "#fff",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  border: "1px solid #000",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "transform 0.15s",
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.95)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Join now
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ── PAGE BODY ── */}
      {activeTab === "home" && (
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          {/* LEFT SIDEBAR: categories */}
          <aside
            style={{
              width: "22rem",
              flexShrink: 0,
              padding: "3.2rem 2.4rem",
              position: "sticky",
              top: "7.2rem",
              alignSelf: "flex-start",
            }}
          >
            <h2
              style={{
                fontSize: "2.4rem",
                fontWeight: 800,
                color: "var(--text-black)",
                marginBottom: "2rem",
                letterSpacing: "-0.02em",
              }}
            >
              Danh Mục
            </h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {CATEGORIES.map((cat, i) => (
                <div key={cat.id}>
                  <button
                    onClick={() => setSelectedCat(cat.id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "1rem 0",
                      background: "none",
                      border: "none",
                      color:
                        selectedCat === cat.id
                          ? "var(--green-accent)"
                          : "var(--text-black)",
                      fontSize: "1.5rem",
                      fontWeight: selectedCat === cat.id ? 700 : 400,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      letterSpacing: "-0.01em",
                      transition: "color 0.15s",
                    }}
                  >
                    {cat.label}
                  </button>
                  {i < CATEGORIES.length - 1 && (
                    <div
                      style={{ height: "1px", background: "rgba(0,0,0,0.09)" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </aside>

          {/* RIGHT: banner + grid */}
          <main
            style={{ flex: 1, minWidth: 0, padding: "2.4rem 2.4rem 2.4rem 0" }}
          >
            {/* Banner carousel */}
            <div
              style={{
                position: "relative",
                borderRadius: "1.4rem",
                overflow: "hidden",
                height: "18rem",
                marginBottom: "2.4rem",
                boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
              }}
            >
              {BANNERS.map((b, i) => (
                <div
                  key={b.id}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: b.bg,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 5rem",
                    opacity: bannerIdx === i ? 1 : 0,
                    transition: "opacity 0.8s ease",
                    pointerEvents: bannerIdx === i ? "auto" : "none",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "6rem",
                        fontWeight: 800,
                        lineHeight: 1,
                        color: b.accent,
                        textShadow: "0 2px 12px rgba(0,0,0,0.25)",
                      }}
                    >
                      {b.discount}
                    </div>
                    <div
                      style={{
                        fontSize: "1.9rem",
                        fontWeight: 700,
                        color: "#fff",
                        marginTop: "0.8rem",
                        textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                      }}
                    >
                      {b.title}
                    </div>
                    <div
                      style={{
                        fontSize: "1.4rem",
                        color: "rgba(255,255,255,0.8)",
                        marginTop: "0.4rem",
                      }}
                    >
                      {b.sub}
                    </div>
                  </div>
                </div>
              ))}
              {[
                { dir: "prev", icon: "‹" },
                { dir: "next", icon: "›" },
              ].map(({ dir, icon }) => (
                <button
                  key={dir}
                  onClick={() =>
                    setBannerIdx((i) =>
                      dir === "prev"
                        ? (i - 1 + BANNERS.length) % BANNERS.length
                        : (i + 1) % BANNERS.length,
                    )
                  }
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    [dir === "prev" ? "left" : "right"]: "1.6rem",
                    width: "3.6rem",
                    height: "3.6rem",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.25)",
                    color: "#fff",
                    fontSize: "2.4rem",
                    lineHeight: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(255,255,255,0.4)",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.45)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.25)")
                  }
                >
                  {icon}
                </button>
              ))}
              {/* Dot indicators */}
              <div
                style={{
                  position: "absolute",
                  bottom: "1.2rem",
                  right: "2rem",
                  display: "flex",
                  gap: "0.6rem",
                }}
              >
                {BANNERS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setBannerIdx(i)}
                    style={{
                      height: "0.8rem",
                      width: bannerIdx === i ? "2.4rem" : "0.8rem",
                      borderRadius: "var(--btn-radius)",
                      background:
                        bannerIdx === i ? "#fff" : "rgba(255,255,255,0.5)",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Product grid */}
            {visibleProducts.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "6rem 0",
                  color: "var(--text-black-soft)",
                  fontSize: "1.6rem",
                }}
              >
                Không tìm thấy sản phẩm nào.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "1.6rem",
                }}
              >
                {visibleProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onAdd={addToCart}
                    onClick={() => onProductClick(p)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      )}

      {activeTab === "address" && (
        <div
          style={{
            maxWidth: "1440px",
            margin: "8rem auto",
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: 600,
            color: "var(--text-black-soft)",
          }}
        >
          Tính năng Quản lý địa chỉ giao hàng đang được phát triển...
        </div>
      )}

      {/* ── STICKY BOTTOM CART BAR ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 90,
          background: "var(--green-house)",
          height: "5.6rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2.4rem",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <span style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 500 }}>
          Sẵn trong giỏ hàng của bạn:{" "}
          <strong style={{ fontSize: "1.9rem", fontWeight: 800 }}>
            {cartCount}
          </strong>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1.6rem" }}>
          <button
            onClick={() => console.log("Sau này sẽ mở trang Quản lý đơn hàng")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              padding: "0.6rem 1.6rem",
              borderRadius: "var(--btn-radius)",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.4)",
              color: "#fff",
              fontSize: "1.4rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.95)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <IconOrder /> Đơn hàng của bạn
          </button>
          <button
            onClick={onCartClick}
            style={{
              width: "4rem",
              height: "4rem",
              borderRadius: "50%",
              background: "var(--green-accent)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 0 6px rgba(0,0,0,0.24), 0 8px 12px rgba(0,0,0,0.14)",
              transition: "transform 0.15s",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.95)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            title="Xem giỏ hàng"
          >
            <IconCart />
          </button>
        </div>
      </div>

      {showPopup && (
        <BranchPopup
          selectedBranch={selectedBranch}
          onClose={() => setShowPopup(false)}
          onSelectBranch={(branch) => {
            setSelectedBranch(branch);
            setShowPopup(false);
          }}
        />
      )}
    </div>
  );
}

/* ── Product Card Component ── */
function ProductCard({ product, onAdd, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: "#fff",
        borderRadius: "var(--card-radius)",
        boxShadow: hovered
          ? "0 4px 16px rgba(0,0,0,0.13)"
          : "var(--card-shadow)",
        overflow: "hidden",
        cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          paddingBottom: "100%",
          position: "relative",
          background: product.bg,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "5.5rem",
          }}
        >
          {product.emoji}
        </div>
      </div>
      <div style={{ padding: "1.2rem 1.4rem 1.4rem" }}>
        <p
          style={{
            fontSize: "1.45rem",
            fontWeight: 600,
            color: "var(--text-black)",
            marginBottom: "0.4rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.name}
        </p>
        <p
          style={{
            fontSize: "1.3rem",
            color: "var(--green-starbucks)",
            fontWeight: 700,
            marginBottom: "1rem",
          }}
        >
          {product.price}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          style={{
            width: "100%",
            padding: "0.6rem 0",
            borderRadius: "var(--btn-radius)",
            background: "var(--green-accent)",
            color: "#fff",
            fontSize: "1.3rem",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "transform 0.15s, background 0.15s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#006241")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--green-accent)")
          }
        >
          + Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
