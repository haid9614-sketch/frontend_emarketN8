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

/* COMPONENT */
export default function Cart({ onBack, onCheckout, onProductClick }) {
  // STATE HỨNG API
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Lấy chi nhánh mặc định là 1 nếu chưa chọn
  const currentBranchId = localStorage.getItem("idBranch") || "1";
  const token = localStorage.getItem("token");

  // HÀM TẢI GIỎ HÀNG
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8080/api/carts/my-cart?idBranch=${currentBranchId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, //token
          },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (err) {
      console.error("Lỗi khi tải giỏ hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  // Luôn cuộn lên trên cùng và tải giỏ hàng khi vừa mở
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // HÀM CẬP NHẬT SỐ LƯỢNG (+ / -)
  const updateQuantity = async (idProduct, currentQty, delta) => {
    const newQuantity = currentQty + delta;
    if (newQuantity < 1) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/carts/update?idProduct=${idProduct}&idBranch=${currentBranchId}&newQuantity=${newQuantity}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) {
        fetchCart(); // Tải lại giỏ hàng để cập nhật tổng tiền
      } else {
        const errText = await res.text();
        alert(errText); // Báo lỗi nếu backend trả về (VD: Vượt quá tồn kho)
      }
    } catch (err) {
      alert("Lỗi kết nối đến máy chủ!");
    }
  };

  // HÀM XÓA MÓN HÀNG
  // Hàm này chỉ bật bảng hỏi lên
  const requestRemoveItem = (idProduct) => {
    setItemToDelete(idProduct);
  };

  const confirmRemoveItem = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/carts/remove?idProduct=${itemToDelete}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        fetchCart(); // Tải lại giỏ hàng
      }
    } catch (err) {
      alert("Lỗi kết nối đến máy chủ!");
    } finally {
      setItemToDelete(null); 
    }
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
            fontSize: "1.5rem",
            cursor: "pointer",
            transition: "transform 0.15s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Mua thêm
        </button>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "var(--text-black)",
            letterSpacing: "-0.02em",
          }}
        >
          eMarket / Giỏ hàng của bạn
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
          flexWrap: "wrap",
        }}
      >
        {/* CỘT TRÁI: Danh sách sản phẩm */}
        <div
          style={{
            flex: 1,
            minWidth: "60%",
            display: "flex",
            flexDirection: "column",
            gap: "3.2rem",
          }}
        >
          <h2 style={{ fontSize: "2.4rem", fontWeight: 800 }}>Túi hàng</h2>

          {loading ? (
            <div
              style={{ fontSize: "1.8rem", fontWeight: 600, padding: "4rem 0" }}
            >
              Đang tải giỏ hàng...
            </div>
          ) : !cart.items || cart.items.length === 0 ? (
            <div
              style={{
                fontSize: "1.8rem",
                color: "var(--text-black-soft)",
                padding: "4rem 0",
                textAlign: "center",
              }}
            >
              Giỏ hàng của bạn đang trống. Hãy quay lại trang chủ để mua sắm
              nhé!
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2.4rem",
              }}
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
                    opacity: item.available ? 1 : 0.45,
                    position: "relative",
                  }}
                >
                  {/* ẢNH SẢN PHẨM TỪ API */}
                  <div
                    onClick={() => onProductClick && onProductClick(item)}
                    title="Nhấn để xem chi tiết"
                    style={{
                      width: "160px",
                      height: "160px",
                      background: "#f9f9f9",
                      borderRadius: "1.2rem",
                      flexShrink: 0,
                      cursor: "pointer",
                      overflow: "hidden",
                      pointerEvents: "auto",
                    }}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      pointerEvents: "auto",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
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

                    {!item.available && (
                      <p
                        style={{
                          color: "#d13239",
                          fontWeight: 700,
                          marginTop: "1rem",
                          fontSize: "1.4rem",
                        }}
                      >
                        Sản phẩm hiện đang hết hàng tại chi nhánh này
                      </p>
                    )}

                    {/* Bộ tăng giảm số lượng & Xóa */}
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
                        }}
                      >
                        <button
                          onClick={() => requestRemoveItem(item.idProduct)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: "var(--text-black)",
                            padding: "0.4rem",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
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
                          onClick={() =>
                            updateQuantity(item.idProduct, item.quantity, -1)
                          }
                          disabled={item.quantity <= 1 || !item.available}
                          style={{
                            fontSize: "2rem",
                            background: "none",
                            border: "none",
                            cursor:
                              item.quantity <= 1 || !item.available
                                ? "not-allowed"
                                : "pointer",
                            color:
                              item.quantity <= 1 || !item.available
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
                          onClick={() =>
                            updateQuantity(item.idProduct, item.quantity, 1)
                          }
                          disabled={
                            item.quantity >= item.maxAvailable ||
                            !item.available
                          }
                          style={{
                            fontSize: "2rem",
                            background: "none",
                            border: "none",
                            cursor:
                              item.quantity >= item.maxAvailable ||
                              !item.available
                                ? "not-allowed"
                                : "pointer",
                            color:
                              item.quantity >= item.maxAvailable ||
                              !item.available
                                ? "#ccc"
                                : "var(--text-black)",
                          }}
                        >
                          +
                        </button>
                      </div>

                      {item.available && item.quantity >= item.maxAvailable && (
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
          )}
        </div>

        {/* CỘT PHẢI: Bảng Summary */}
        <aside
          style={{
            flex: "1 1 360px",
            maxWidth: "400px",
            position: "sticky",
            top: "10rem",
          }}
        >
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
                {(cart?.totalPrice || 0).toLocaleString("vi-VN")} ₫
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
                {(cart?.totalPrice || 0).toLocaleString("vi-VN")} ₫
              </span>
            </div>

            <button
              onClick={() => onCheckout && onCheckout(cart)}
              disabled={
                !cart.items ||
                cart.items.length === 0 ||
                cart.items.every((i) => !i.available)
              }
              style={{
                width: "100%",
                padding: "1.8rem",
                borderRadius: "var(--btn-radius)",
                background:
                  !cart.items ||
                  cart.items.length === 0 ||
                  cart.items.every((i) => !i.available)
                    ? "#ccc"
                    : "var(--green-house)",
                color: "#fff",
                fontSize: "1.6rem",
                fontWeight: 700,
                border: "none",
                cursor:
                  !cart.items ||
                  cart.items.length === 0 ||
                  cart.items.every((i) => !i.available)
                    ? "not-allowed"
                    : "pointer",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                transition: "transform 0.15s, background 0.15s",
              }}
            >
              Tiến hành thanh toán
            </button>
          </div>
        </aside>
      </main>
      {/* ── BẢNG HỎI XÁC NHẬN XÓA (CUSTOM MODAL) ── */}
      {itemToDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2.4rem",
              borderRadius: "1.2rem",
              width: "400px",
              maxWidth: "90%",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            <h3
              style={{
                fontSize: "1.9rem",
                fontWeight: 800,
                marginBottom: "1rem",
                color: "var(--text-black)",
              }}
            >
              Xác nhận xóa
            </h3>
            <p
              style={{
                fontSize: "1.5rem",
                color: "var(--text-black-soft)",
                marginBottom: "2.4rem",
                lineHeight: 1.5,
              }}
            >
              Bạn có chắc chắn muốn bỏ sản phẩm này khỏi giỏ hàng không?
            </p>
            <div
              style={{
                display: "flex",
                gap: "1.2rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setItemToDelete(null)}
                style={{
                  padding: "1rem 2rem",
                  borderRadius: "var(--btn-radius)",
                  border: "1px solid #ccc",
                  background: "transparent",
                  color: "var(--text-black)",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "1.4rem",
                }}
              >
                Hủy
              </button>
              <button
                onClick={confirmRemoveItem}
                style={{
                  padding: "1rem 2rem",
                  borderRadius: "var(--btn-radius)",
                  border: "none",
                  background: "#d13239",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "1.4rem",
                }}
              >
                Xóa sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
