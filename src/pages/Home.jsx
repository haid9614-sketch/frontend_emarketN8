import { useState, useEffect, useRef, useLayoutEffect } from "react";
import BranchPopup from "./BranchPopup";
import logo from "../assets/logoDS.JPG";
import banner1 from "../assets/banHome1.jpg";
import banner2 from "../assets/banHome2.png";
import banner3 from "../assets/banHome3.jpg";

/* ══════════════════════════════════════════════════════════
  map ID với Database
══════════════════════════════════════════════════════════ */
const NAV_TABS = [
  { id: "home", label: "Trang chủ" },
  { id: "address", label: "Địa chỉ của bạn" },
  { id: "voucher", label: "Voucher" },
];

const CATEGORIES = [
  { id: "all", label: "Tất cả", dbId: null },
  { id: "meat", label: "Thịt cá", dbId: 1 },
  { id: "veggie", label: "Rau củ", dbId: 2 },
  { id: "fruit", label: "Hoa quả", dbId: 3 },
  { id: "household", label: "Đồ gia dụng", dbId: 4 },
  { id: "snack", label: "Đồ ăn vặt", dbId: 5 },
  { id: "packaged", label: "Đồ đóng gói sẵn", dbId: 6 },
];

const BANNERS = [
  { id: 1, image: banner1 },
  { id: 2, image: banner2 },
  { id: 3, image: banner3 },
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
  savedScroll,
  onLoginClick,
  onLogout,
  onProductClick,
  onCartClick,
  onVoucherClick,
  onAddressClick,
  onOrderHistoryClick,
  onRegisterClick,
  selectedCat,
  setSelectedCat,
  searchQuery,
  setSearchQuery,
  appliedQuery,
  setAppliedQuery,
}) {
  const [activeTab, setActiveTab] = useState("home");
  const [showPopup, setShowPopup] = useState(false);

  // Lấy cả ID lẫn Tên chi nhánh từ bộ nhớ
  const [selectedBranch, setSelectedBranch] = useState(() => {
    const savedId = localStorage.getItem("idBranch");
    const savedName = localStorage.getItem("branchName");

    if (savedId && savedId !== "undefined" && savedId !== "null") {
      return { idBranch: parseInt(savedId), name: savedName || "eMarket" };
    }
    return null;
  });

  const [cartCount, setCartCount] = useState(0);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef({});

  // STATE HỨNG DỮ LIỆU TỪ API
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const hasRestoredScroll = useRef(false);

  // LOGIC BRANCH & GỌI API ĐÃ ĐƯỢC BẢO VỆ CHẶT CHẼ
  useEffect(() => {
    let currentBranchId = localStorage.getItem("idBranch");

    // NẾU CHƯA CHỌN NHÁNH: Ép bật Popup và DỪNG LẠI (Không tải sản phẩm)
    if (
      !currentBranchId ||
      currentBranchId === "undefined" ||
      currentBranchId === "null"
    ) {
      setShowPopup(true);
      return; // Dừng luồng chạy, bắt khách phải thao tác ở Popup
    } else if (!selectedBranch) {
      setSelectedBranch({
        idBranch: parseInt(currentBranchId),
        name:
          localStorage.getItem("branchName") ||
          `Chi nhánh ID: ${currentBranchId}`,
      });
    }

    // Kéo dữ liệu từ Spring Boot (Chỉ chạy khi đã có nhánh)
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const activeCatObj = CATEGORIES.find((c) => c.id === selectedCat);
        const categoryId = activeCatObj?.dbId;

        let url = `http://localhost:8080/api/products?idBranch=${currentBranchId}&size=50`;
        if (categoryId) url += `&categoryId=${categoryId}`;
        if (appliedQuery) url += `&keyword=${appliedQuery}`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.content);
        }
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCat, appliedQuery, selectedBranch]);

  // Tự động cuộn đến vị trí đã lưu
  useEffect(() => {
    if (!loading && !hasRestoredScroll.current) {
      setTimeout(() => {
        window.scrollTo(0, savedScroll || 0);
      }, 100);
      hasRestoredScroll.current = true;
    }
  }, [loading, savedScroll]);

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

  // HÀM GỌI API THÊM VÀO GIỎ HÀNG
  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");
    const currentBranchId = localStorage.getItem("idBranch") || "1";

    if (!token) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      onLoginClick();
      return false;
    }

    try {
      const res = await fetch("http://localhost:8080/api/carts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idProduct: product.idProduct,
          quantity: 1,
          idBranch: parseInt(currentBranchId),
        }),
      });

      if (res.ok) {
        setCartCount((c) => c + 1);
        return true;
      } else {
        const errText = await res.text();
        alert(errText);
        return false;
      }
    } catch (err) {
      alert("Lỗi kết nối máy chủ!");
      return false;
    }
  };

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

          {/* Nav tabs */}
          <div style={{ position: "relative", display: "flex" }}>
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                ref={(el) => (tabRefs.current[tab.id] = el)}
                onClick={() => {
                  if (tab.id === "voucher") onVoucherClick();
                  else if (tab.id === "address") onAddressClick();
                  else setActiveTab(tab.id);
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
                transition: "all 0.28s cubic-bezier(.4,0,.2,1)",
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
                }}
              />
            </form>
          </div>

          {/* Branch button */}
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
                fontSize: "1.5rem",
                fontWeight: 900,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                flexShrink: 0,
              }}
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
                }}
              >
                Sign in
              </button>
              <button
                onClick={onRegisterClick}
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
                }}
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
                height: "23rem",
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
                    backgroundImage: `url(${b.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: bannerIdx === i ? 1 : 0,
                    transition: "opacity 0.8s ease",
                    pointerEvents: bannerIdx === i ? "auto" : "none",
                  }}
                />
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(255,255,255,0.4)",
                    cursor: "pointer",
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>

            {/* Product grid (Kéo từ API) */}
            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "6rem 0",
                  color: "var(--text-black)",
                  fontSize: "1.8rem",
                  fontWeight: 700,
                }}
              >
                Đang tải sản phẩm...
              </div>
            ) : products.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "6rem 0",
                  color: "var(--text-black-soft)",
                  fontSize: "1.6rem",
                }}
              >
                Không tìm thấy sản phẩm nào ở chi nhánh này.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "1.6rem",
                }}
              >
                {products.map((p) => (
                  <ProductCard
                    key={p.idProduct}
                    product={p}
                    onAdd={() => handleAddToCart(p)}
                    onClick={() => onProductClick(p)}
                  />
                ))}
              </div>
            )}
          </main>
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
          Sẵn trong giỏ hàng của bạn
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1.6rem" }}>
          <button
            onClick={onOrderHistoryClick}
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
            }}
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
            }}
          >
            <IconCart />
          </button>
        </div>
      </div>

      {/* HIỂN THỊ POPUP */}
      {showPopup && (
        <BranchPopup
          selectedBranch={selectedBranch}
          onClose={() => setShowPopup(false)}
          onSelectBranch={(branch) => {
            setSelectedBranch(branch);
            localStorage.setItem("idBranch", branch.idBranch);
            localStorage.setItem("branchName", branch.name); // LƯU THÊM TÊN ĐỂ F5 KHÔNG BỊ QUÊN
          }}
        />
      )}
    </div>
  );
}

/* ── Product Card Component ── */
function ProductCard({ product, onAdd, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const isOutOfStock = product.stockQuantity === 0;

  const handleAddClick = async (e) => {
    e.stopPropagation();
    if (isOutOfStock || added) return;

    const isSuccess = await onAdd();
    if (isSuccess) {
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
      }, 1500);
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (!isOutOfStock) onClick();
      }}
      style={{
        background: "#fff",
        borderRadius: "var(--card-radius)",
        boxShadow:
          hovered && !isOutOfStock
            ? "0 4px 16px rgba(0,0,0,0.13)"
            : "var(--card-shadow)",
        overflow: "hidden",
        cursor: isOutOfStock ? "not-allowed" : "pointer",
        transform:
          hovered && !isOutOfStock ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        opacity: isOutOfStock ? 0.6 : 1,
      }}
    >
      <div
        style={{
          width: "100%",
          paddingBottom: "100%",
          position: "relative",
          background: "#f9f9f9",
        }}
      >
        {product.imageUrl && product.imageUrl.startsWith("http") ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "4rem",
            }}
          >
            {product.imageUrl}
          </div>
        )}

        {isOutOfStock && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                background: "#d13239",
                color: "#fff",
                padding: "0.6rem 1.6rem",
                borderRadius: "50px",
                fontWeight: 800,
                fontSize: "1.4rem",
              }}
            >
              HẾT HÀNG
            </span>
          </div>
        )}
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
          {product.price.toLocaleString("vi-VN")}₫
          <span
            style={{
              fontSize: "1.2rem",
              fontWeight: 500,
              color: "var(--text-black-soft)",
              marginLeft: "0.4rem",
            }}
          >
            ({product.unit})
          </span>
        </p>

        <button
          disabled={isOutOfStock || added}
          onClick={handleAddClick}
          style={{
            width: "100%",
            padding: "0.6rem 0",
            borderRadius: "var(--btn-radius)",
            background: added
              ? "var(--green-starbucks)"
              : isOutOfStock
                ? "#ccc"
                : "var(--green-accent)",
            color: "#fff",
            fontSize: "1.3rem",
            fontWeight: 700,
            border: "none",
            cursor: isOutOfStock || added ? "not-allowed" : "pointer",
            transition: "transform 0.15s, background 0.15s",
          }}
          onMouseDown={(e) =>
            !added &&
            !isOutOfStock &&
            (e.currentTarget.style.transform = "scale(0.95)")
          }
          onMouseUp={(e) =>
            !added &&
            !isOutOfStock &&
            (e.currentTarget.style.transform = "scale(1)")
          }
          onMouseEnter={(e) =>
            !added &&
            !isOutOfStock &&
            (e.currentTarget.style.background = "#006241")
          }
          onMouseLeave={(e) =>
            !added &&
            !isOutOfStock &&
            (e.currentTarget.style.background = "var(--green-accent)")
          }
        >
          {added ? "✓ Đã thêm" : isOutOfStock ? "Tạm hết" : "+ Thêm vào giỏ"}
        </button>
      </div>
    </div>
  );
}
