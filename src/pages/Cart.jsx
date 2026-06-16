import { useState, useEffect } from "react";

/* ─── ICONS ───────────────────────────────── */
function IconTrash() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );
}

/* ─── MOCK DATA KHỚP DTO BACKEND ──────────────── */
const INITIAL_CART = {
  idCarts: 1,
  items: [
    {
      idProduct: 4,
      productName: "Thịt Bò Wagyu Cao Cấp",
      imageUrl: "🥩",
      price: 320000,
      quantity: 1,
      subTotal: 320000,
      isAvailable: true,
      maxAvailable: 5,
    },
    {
      idProduct: 10,
      productName: "Táo Fuji Nhật Bản",
      imageUrl: "🍎",
      price: 85000,
      quantity: 2,
      subTotal: 170000,
      isAvailable: true,
      maxAvailable: 2,
    },
    {
      idProduct: 5,
      productName: "Tôm Sú Tươi Hữu Cơ",
      imageUrl: "🦐",
      price: 180000,
      quantity: 1,
      subTotal: 180000,
      isAvailable: false, // HẾT HÀNG
      maxAvailable: 0,
    },
  ],
};

/* ─── COMPONENT ────────────────────────────────────────── */
// Nhận thêm onProductClick để mở trang chi tiết
export default function Cart({ onBack, onCheckout, onProductClick }) {
  // Tự động tính tổng tiền ban đầu
  const initialTotal = INITIAL_CART.items.reduce(
    (sum, item) => sum + (item.isAvailable ? item.subTotal : 0),
    0,
  );

  // Luôn cuộn lên trên cùng khi mở
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [cart, setCart] = useState({
    ...INITIAL_CART,
    totalPrice: initialTotal,
  });

  const updateQuantity = (idProduct, delta) => {
    setCart((prev) => {
      const newItems = prev.items.map((item) => {
        if (item.idProduct === idProduct) {
          const newQty = Math.max(
            1,
            Math.min(item.quantity + delta, item.maxAvailable),
          );
          return { ...item, quantity: newQty, subTotal: newQty * item.price };
        }
        return item;
      });
      // Tính lại tổng tiền bỏ qua món hết hàng
      const newTotal = newItems.reduce(
        (sum, item) => sum + (item.isAvailable ? item.subTotal : 0),
        0,
      );
      return { ...prev, items: newItems, totalPrice: newTotal };
    });
  };

  const removeItem = (idProduct) => {
    setCart((prev) => {
      const newItems = prev.items.filter((i) => i.idProduct !== idProduct);
      const newTotal = newItems.reduce(
        (sum, item) => sum + (item.isAvailable ? item.subTotal : 0),
        0,
      );
      return { ...prev, items: newItems, totalPrice: newTotal };
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--neutral-warm)",
        paddingBottom: "6rem",
      }}
    >
      {/* ── HEADER ── */}
      <header
        style={{
          background: "#fff",
          padding: "2rem 4rem",
          boxShadow: "var(--nav-shadow)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "var(--green-accent)",
            color: "#fff",
            border: "none",
            fontWeight: 800,
            borderRadius: "var(--btn-radius)",
            padding: "0.6rem 2.4rem",
            fontSize: "2rem",
            cursor: "pointer",
            transition: "transform 0.15s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          ← Mua thêm
        </button>
        <h1
          style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            color: "var(--text-black)",
            letterSpacing: "-0.02em",
          }}
        >
          Giỏ hàng của bạn
        </h1>
      </header>

      {/* ── MAIN LAYOUT ── */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "4rem auto",
          padding: "0 2.4rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "4rem",
        }}
      >
        {/* CỘT TRÁI: Danh sách sản phẩm */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "3.2rem",
          }}
        >
          <h2 style={{ fontSize: "2.4rem", fontWeight: 800 }}>Bag</h2>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
          >
            {cart.items.map((item, index) => (
              <div
                key={item.idProduct}
                style={{
                  display: "flex",
                  gap: "2.4rem",
                  paddingBottom: "2.4rem",
                  borderBottom:
                    index !== cart.items.length - 1
                      ? "1px solid rgba(0,0,0,0.08)"
                      : "none",
                  opacity: item.isAvailable ? 1 : 0.45, // Làm mờ nếu hết hàng
                  position: "relative",
                }}
              >
                {/* ẢNH SẢN PHẨM: Đã thêm sự kiện Click và Hover phóng to */}
                <div
                  onClick={() => onProductClick && onProductClick(item)}
                  title="Nhấn để xem chi tiết"
                  style={{
                    width: "160px",
                    height: "160px",
                    background: "#e8e6e1",
                    borderRadius: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "6rem",
                    flexShrink: 0,
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    pointerEvents: "auto", // Đảm bảo luôn bấm được ảnh dù hết hàng
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  {item.imageUrl}
                </div>

                {/* Thông tin sản phẩm */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    pointerEvents: item.isAvailable ? "auto" : "none",
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h3
                      onClick={() => onProductClick && onProductClick(item)}
                      style={{
                        fontSize: "1.8rem",
                        fontWeight: 700,
                        color: "var(--text-black)",
                        cursor: "pointer",
                      }}
                    >
                      {item.productName}
                    </h3>
                    <p
                      style={{
                        fontSize: "1.6rem",
                        fontWeight: 700,
                        color: "var(--text-black)",
                      }}
                    >
                      {item.price.toLocaleString("vi-VN")} ₫
                    </p>
                  </div>

                  <p
                    style={{
                      fontSize: "1.4rem",
                      color: "var(--text-black-soft)",
                      marginTop: "0.4rem",
                    }}
                  >
                    Sản phẩm chất lượng cao
                  </p>
                  <p
                    style={{
                      fontSize: "1.4rem",
                      color: "var(--text-black-soft)",
                    }}
                  >
                    Đổi trả trong 24h
                  </p>

                  {!item.isAvailable && (
                    <p
                      style={{
                        color: "#d13239",
                        fontWeight: 700,
                        marginTop: "1rem",
                        fontSize: "1.4rem",
                      }}
                    >
                      Sản phẩm hiện đang hết hàng
                    </p>
                  )}

                  <div
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      alignItems: "center",
                      gap: "2rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid rgba(0,0,0,0.15)",
                        borderRadius: "var(--btn-radius)",
                        padding: "0.4rem 1.2rem",
                        gap: "1.2rem",
                        background: "#fff",
                        pointerEvents: "auto", // Cho phép bấm nút xoá dù hết hàng
                      }}
                    >
                      <button
                        onClick={() => removeItem(item.idProduct)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: "var(--text-black)",
                          padding: "0.4rem",
                        }}
                      >
                        <IconTrash />
                      </button>

                      <div
                        style={{
                          width: "1px",
                          height: "2rem",
                          background: "rgba(0,0,0,0.1)",
                        }}
                      />

                      <button
                        onClick={() => updateQuantity(item.idProduct, -1)}
                        disabled={item.quantity <= 1 || !item.isAvailable}
                        style={{
                          fontSize: "2rem",
                          color:
                            item.quantity <= 1 || !item.isAvailable
                              ? "#ccc"
                              : "var(--text-black)",
                        }}
                      >
                        −
                      </button>

                      <span
                        style={{
                          fontSize: "1.6rem",
                          fontWeight: 700,
                          width: "2rem",
                          textAlign: "center",
                        }}
                      >
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.idProduct, 1)}
                        disabled={
                          item.quantity >= item.maxAvailable ||
                          !item.isAvailable
                        }
                        style={{
                          fontSize: "2rem",
                          color:
                            item.quantity >= item.maxAvailable ||
                            !item.isAvailable
                              ? "#ccc"
                              : "var(--text-black)",
                        }}
                      >
                        +
                      </button>
                    </div>

                    {item.isAvailable && item.quantity >= item.maxAvailable && (
                      <span
                        style={{
                          fontSize: "1.3rem",
                          color: "#d9840a",
                          fontWeight: 600,
                        }}
                      >
                        Đã đạt giới hạn tồn kho ({item.maxAvailable})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CỘT PHẢI: Bảng Summary đã gỡ mã giảm giá */}
        <aside style={{ width: "360px", position: "sticky", top: "10rem" }}>
          <h2
            style={{
              fontSize: "2.4rem",
              fontWeight: 800,
              marginBottom: "2.4rem",
            }}
          >
            Summary
          </h2>

          <div
            style={{
              background: "#fff",
              borderRadius: "1.6rem",
              padding: "2.4rem",
              boxShadow: "var(--card-shadow)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1.6rem",
                fontSize: "1.6rem",
              }}
            >
              <span style={{ color: "var(--text-black-soft)" }}>
                Tổng phụ (Subtotal)
              </span>
              <span style={{ fontWeight: 600 }}>
                {cart.totalPrice.toLocaleString("vi-VN")} ₫
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "2.4rem",
                fontSize: "1.6rem",
              }}
            >
              <span style={{ color: "var(--text-black-soft)" }}>
                Phí vận chuyển
              </span>
              <span style={{ fontWeight: 600, color: "var(--green-accent)" }}>
                Miễn phí
              </span>
            </div>

            <div
              style={{
                height: "1px",
                background: "rgba(0,0,0,0.08)",
                marginBottom: "2.4rem",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "3.2rem",
                fontSize: "1.8rem",
              }}
            >
              <span style={{ fontWeight: 800 }}>Tổng cộng (You Pay)</span>
              <span style={{ fontWeight: 800 }}>
                {cart.totalPrice.toLocaleString("vi-VN")} ₫
              </span>
            </div>

            {/* Nút Thanh toán CTA */}
            <button
              onClick={() => onCheckout && onCheckout(cart)}
              style={{
                width: "100%",
                padding: "1.8rem",
                borderRadius: "var(--btn-radius)",
                background: "var(--green-house)",
                color: "#fff",
                fontSize: "1.6rem",
                fontWeight: 700,
                border: "none",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                transition: "transform 0.15s, background 0.15s",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.95)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#000")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--green-house)")
              }
            >
              Tiến hành thanh toán
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
