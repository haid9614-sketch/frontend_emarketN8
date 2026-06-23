import { useState, useEffect } from "react";

import bannerImg from "../assets/order/banShip.jpg";
import pendingImg from "../assets/order/pending.png";
import shippingImg from "../assets/order/shipping.png";
import deliveredImg from "../assets/order/delivered.png";
import cancelledImg from "../assets/order/cancelled.png";

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

// ICON THÀNH CÔNG
function IconSuccessCircle() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#00754a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}

// ICON LỖI
function IconErrorCircle() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#d13239"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  );
}

/* ─── COMPONENT CHÍNH ───────────────────────────────────── */
export default function OrderHistory({ onBack }) {
  const [view, setView] = useState("menu");
  const [activeStatus, setActiveStatus] = useState(null);

  // STATE API
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [badgeCount, setBadgeCount] = useState({ PENDING: 0, SHIPPING: 0 });

  // Popup states
  const [detailOrder, setDetailOrder] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  // STATE CHO THÔNG BÁO TÙY CHỈNH (Thay thế alert)
  const [alertMsg, setAlertMsg] = useState(null); // Dạng: { type: 'success' | 'error', text: '...' }

  const token = localStorage.getItem("token");

  // HÀM ĐẾM SỐ LƯỢNG BADGE
  const fetchBadgeCounts = async () => {
    if (!token) return;
    try {
      const [resPending, resShipping] = await Promise.all([
        fetch("http://localhost:8080/api/orders/history?status=PENDING", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8080/api/orders/history?status=SHIPPING", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      let pendingLength = 0;
      let shippingLength = 0;

      if (resPending.ok) pendingLength = (await resPending.json()).length;
      if (resShipping.ok) shippingLength = (await resShipping.json()).length;

      setBadgeCount({ PENDING: pendingLength, SHIPPING: shippingLength });
    } catch (err) {
      console.error("Lỗi khi tải số lượng:", err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (view === "menu") {
      fetchBadgeCounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // HÀM LẤY DANH SÁCH ĐƠN HÀNG
  const fetchOrdersByStatus = async (status) => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8080/api/orders/history?status=${status}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Lỗi tải đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleHeaderBack = () => {
    if (view === "list") {
      setView("menu");
    } else {
      onBack();
    }
  };

  const openStatus = (status) => {
    setActiveStatus(status);
    setView("list");
    fetchOrdersByStatus(status);
  };

  // HÀM HỦY ĐƠN HÀNG
  const confirmCancel = async () => {
    if (!cancelOrderId || !token) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/orders/cancel?idOrder=${cancelOrderId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const textMsg = await res.text();
      if (res.ok) {
        // Hiện Popup thành công thay vì alert
        setAlertMsg({ type: "success", text: textMsg });
        fetchOrdersByStatus(activeStatus); // Tải lại danh sách
        fetchBadgeCounts(); // Cập nhật lại số đếm ở Menu
      } else {
        setAlertMsg({ type: "error", text: textMsg });
      }
    } catch (err) {
      setAlertMsg({ type: "error", text: "Lỗi kết nối máy chủ!" });
    } finally {
      setCancelOrderId(null); // Đóng bảng hỏi Xác nhận
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Đơn hàng đang chờ xác nhận";
      case "SHIPPING":
        return "Đơn hàng đang được giao";
      case "DELIVERED":
        return "Đơn hàng đã giao thành công";
      case "CANCELLED":
        return "Đơn hàng đã bị hủy";
      default:
        return "";
    }
  };

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
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          padding: "1.6rem 4rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
        }}
      >
        <button
          onClick={handleHeaderBack}
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
            transition: "transform 0.15s",
            width: "fit-content",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <IconArrowLeft /> Quay lại
        </button>
        <p style={{ fontSize: "1.3rem", color: "var(--text-black-soft)" }}>
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
          <span style={{ margin: "0 0.5rem", opacity: 0.4 }}>/</span> Chất lượng
          & Dịch vụ
          <span style={{ margin: "0 0.5rem", opacity: 0.4 }}>/</span>{" "}
          <span
            style={{
              color:
                view === "menu"
                  ? "var(--text-black)"
                  : "var(--text-black-soft)",
              fontWeight: view === "menu" ? 600 : 400,
              cursor: "pointer",
            }}
            onClick={() => setView("menu")}
          >
            Đơn hàng của bạn
          </span>
          {view === "list" && (
            <>
              <span style={{ margin: "0 0.5rem", opacity: 0.4 }}>/</span>{" "}
              <span style={{ color: "var(--text-black)", fontWeight: 600 }}>
                {activeStatus}
              </span>
            </>
          )}
        </p>
      </header>

      {/* ════════════════════════════════════════════════════════
          VIEW 1: MENU 4 TRẠNG THÁI 
      ════════════════════════════════════════════════════════ */}
      {view === "menu" && (
        <>
          <div
            style={{
              width: "100%",
              height: "400px",
              position: "relative",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              marginBottom: "5rem",
            }}
          >
            <img
              src={bannerImg}
              alt="Banner"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <main
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              width: "100%",
              padding: "0 2.4rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "4rem",
                padding: "0 2rem",
              }}
            >
              {/* PENDING */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => openStatus("PENDING")}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "60%",
                    background: "var(--green-accent)",
                    borderRadius: "1.2rem",
                    boxShadow: "var(--card-shadow)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-4px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  <img
                    src={pendingImg}
                    alt="Pending"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "1.2rem",
                      opacity: 0.8,
                    }}
                  />
                  {badgeCount.PENDING > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-1rem",
                        right: "-1rem",
                        background: "#fff",
                        border: "2px solid var(--text-black)",
                        color: "var(--text-black)",
                        width: "3rem",
                        height: "3rem",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.4rem",
                        fontWeight: 800,
                      }}
                    >
                      {badgeCount.PENDING}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    marginTop: "1.6rem",
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: "var(--text-black)",
                  }}
                >
                  PENDING
                </span>
              </div>

              {/* SHIPPING */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => openStatus("SHIPPING")}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "60%",
                    background: "var(--green-accent)",
                    borderRadius: "1.2rem",
                    boxShadow: "var(--card-shadow)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-4px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  <img
                    src={shippingImg}
                    alt="Shipping"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "1.2rem",
                      opacity: 0.8,
                    }}
                  />
                  {badgeCount.SHIPPING > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-1rem",
                        right: "-1rem",
                        background: "#fff",
                        border: "2px solid var(--text-black)",
                        color: "var(--text-black)",
                        width: "3rem",
                        height: "3rem",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.4rem",
                        fontWeight: 800,
                      }}
                    >
                      {badgeCount.SHIPPING}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    marginTop: "1.6rem",
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: "var(--text-black)",
                  }}
                >
                  SHIPPING
                </span>
              </div>

              {/* DELIVERED */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => openStatus("DELIVERED")}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "60%",
                    background: "var(--green-accent)",
                    borderRadius: "1.2rem",
                    boxShadow: "var(--card-shadow)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-4px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  <img
                    src={deliveredImg}
                    alt="Delivered"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "1.2rem",
                      opacity: 0.8,
                    }}
                  />
                </div>
                <span
                  style={{
                    marginTop: "1.6rem",
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: "var(--text-black)",
                  }}
                >
                  DELIVERED
                </span>
              </div>

              {/* CANCELLED */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => openStatus("CANCELLED")}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom: "60%",
                    background: "var(--green-accent)",
                    borderRadius: "1.2rem",
                    boxShadow: "var(--card-shadow)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-4px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  <img
                    src={cancelledImg}
                    alt="Cancelled"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "1.2rem",
                      opacity: 0.8,
                    }}
                  />
                </div>
                <span
                  style={{
                    marginTop: "1.6rem",
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: "var(--text-black)",
                  }}
                >
                  CANCELLED
                </span>
              </div>
            </div>
          </main>
        </>
      )}

      {/* ════════════════════════════════════════════════════════
          VIEW 2: DANH SÁCH ĐƠN HÀNG
      ════════════════════════════════════════════════════════ */}
      {view === "list" && (
        <main
          style={{
            maxWidth: "1000px",
            margin: "4rem auto",
            width: "100%",
            padding: "0 2.4rem",
            display: "flex",
            flexDirection: "column",
            gap: "2.4rem",
          }}
        >
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "10rem 0",
                fontSize: "1.8rem",
                fontWeight: 600,
              }}
            >
              Đang tải danh sách đơn hàng...
            </div>
          ) : orders.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "10rem 0",
                fontSize: "1.8rem",
                color: "var(--text-black-soft)",
              }}
            >
              Không có đơn hàng nào ở trạng thái này.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.idOrders}
                style={{
                  background: "#fff",
                  borderRadius: "1.2rem",
                  padding: "2.4rem",
                  boxShadow: "var(--card-shadow)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                    paddingBottom: "1.6rem",
                    marginBottom: "1.6rem",
                  }}
                >
                  <span style={{ fontSize: "1.6rem", fontWeight: 800 }}>
                    Order ID: {order.idOrders}
                  </span>
                  <span
                    style={{
                      fontSize: "1.4rem",
                      color: "var(--green-accent)",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                    }}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.6rem",
                  }}
                >
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "1.6rem" }}>
                      <div
                        style={{
                          width: "8rem",
                          height: "8rem",
                          background: "#f9f9f9",
                          borderRadius: "0.8rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          fontSize: "3rem",
                        }}
                      >
                        {item.imageUrl && item.imageUrl.startsWith("http") ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          "📦"
                        )}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "1.6rem",
                            color: "var(--text-black)",
                            marginBottom: "0.4rem",
                          }}
                        >
                          {item.productName}
                        </p>
                        <p
                          style={{
                            fontSize: "1.3rem",
                            color: "var(--text-black-soft)",
                            marginBottom: "0.4rem",
                          }}
                        >
                          Đơn giá: {item.price.toLocaleString("vi-VN")}₫
                        </p>
                        <p style={{ fontSize: "1.4rem", fontWeight: 600 }}>
                          Số lượng: x{item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: "2.4rem",
                    borderTop: "1px dashed rgba(0,0,0,0.1)",
                    paddingTop: "2.4rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "1.6rem",
                  }}
                >
                  <div style={{ fontSize: "1.5rem" }}>
                    Order Total:{" "}
                    <span
                      style={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        color: "var(--green-house)",
                        marginLeft: "0.8rem",
                      }}
                    >
                      {order.total.toLocaleString("vi-VN")}₫
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "1.2rem" }}>
                    {order.status === "PENDING" && (
                      <button
                        onClick={() => setCancelOrderId(order.idOrders)}
                        style={{
                          padding: "0.8rem 2.4rem",
                          borderRadius: "var(--btn-radius)",
                          background: "#d13239",
                          color: "#fff",
                          border: "none",
                          fontWeight: 600,
                          fontSize: "1.4rem",
                          cursor: "pointer",
                        }}
                      >
                        Hủy đơn hàng
                      </button>
                    )}
                    <button
                      onClick={() => setDetailOrder(order)}
                      style={{
                        padding: "0.8rem 2.4rem",
                        borderRadius: "var(--btn-radius)",
                        background: "#fff",
                        color: "var(--text-black)",
                        border: "1px solid rgba(0,0,0,0.2)",
                        fontWeight: 600,
                        fontSize: "1.4rem",
                        cursor: "pointer",
                      }}
                    >
                      Chi tiết đơn hàng
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </main>
      )}

      {/* ════════════════════════════════════════════════════════
          POPUP: CHI TIẾT ĐƠN HÀNG
      ════════════════════════════════════════════════════════ */}
      {detailOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: "600px",
              borderRadius: "1.6rem",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              maxHeight: "85vh",
            }}
          >
            <div
              style={{
                background: "var(--green-house)",
                padding: "1.6rem 2.4rem",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ fontSize: "1.8rem", fontWeight: 700 }}>
                Chi tiết đơn hàng #{detailOrder.idOrders}
              </h3>
              <button
                onClick={() => setDetailOrder(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  fontSize: "2.4rem",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
            <div
              style={{
                padding: "2.4rem",
                overflowY: "auto",
                fontSize: "1.5rem",
                color: "var(--text-black)",
              }}
            >
              <div
                style={{
                  marginBottom: "1.6rem",
                  paddingBottom: "1.6rem",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <p style={{ fontWeight: 700, marginBottom: "0.8rem" }}>
                  Thông tin người nhận
                </p>
                <p>
                  <strong>Tên:</strong> {detailOrder.receiverName}
                </p>
                <p>
                  <strong>SĐT:</strong> {detailOrder.receiverPhone}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {detailOrder.shippingAddress}
                </p>
              </div>
              <div
                style={{
                  marginBottom: "1.6rem",
                  paddingBottom: "1.6rem",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <p style={{ fontWeight: 700, marginBottom: "0.8rem" }}>
                  Thông tin giao dịch
                </p>
                <p>
                  <strong>Phương thức:</strong> {detailOrder.paymentMethod}
                </p>
                <p>
                  <strong>Thời gian tạo:</strong>{" "}
                  {new Date(detailOrder.createdAt).toLocaleString("vi-VN")}
                </p>
                <p>
                  <strong>Ghi chú:</strong> {detailOrder.note || "Không có"}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: "var(--green-house)",
                  }}
                >
                  Tổng thanh toán: {detailOrder.total.toLocaleString("vi-VN")}₫
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          POPUP: XÁC NHẬN HỦY ĐƠN (CHƯA GỌI API)
      ════════════════════════════════════════════════════════ */}
      {cancelOrderId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: "400px",
              borderRadius: "1.6rem",
              padding: "3.2rem",
              textAlign: "center",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          >
            <h3
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                color: "var(--text-black)",
                marginBottom: "1.2rem",
              }}
            >
              Hủy đơn hàng?
            </h3>
            <p
              style={{
                fontSize: "1.5rem",
                color: "var(--text-black-soft)",
                marginBottom: "3.2rem",
              }}
            >
              Bạn có chắc chắn muốn hủy đơn hàng #{cancelOrderId} không? Hành
              động này không thể hoàn tác.
            </p>
            <div style={{ display: "flex", gap: "1.6rem" }}>
              <button
                onClick={() => setCancelOrderId(null)}
                style={{
                  flex: 1,
                  padding: "1.4rem",
                  borderRadius: "50px",
                  background: "#f5f5f5",
                  color: "var(--text-black)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Không
              </button>
              <button
                onClick={confirmCancel}
                style={{
                  flex: 1,
                  padding: "1.4rem",
                  borderRadius: "50px",
                  background: "#d13239",
                  color: "#fff",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Hủy Đơn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          POPUP MỚI: THÔNG BÁO TÙY CHỈNH 
      ════════════════════════════════════════════════════════ */}
      {alertMsg && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              background: "#fff",
              width: "100%",
              maxWidth: "420px",
              borderRadius: "2rem",
              padding: "4rem 3.2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            <div
              style={{
                marginBottom: "2.4rem",
                animation:
                  "bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            >
              {alertMsg.type === "success" ? (
                <IconSuccessCircle />
              ) : (
                <IconErrorCircle />
              )}
            </div>

            <h2
              style={{
                fontSize: "2.4rem",
                fontWeight: 800,
                color: "var(--text-black)",
                marginBottom: "1.2rem",
              }}
            >
              {alertMsg.type === "success" ? "Thành công!" : "Thất bại"}
            </h2>

            <p
              style={{
                fontSize: "1.6rem",
                color: "var(--text-black-soft)",
                lineHeight: 1.6,
                marginBottom: "3.2rem",
              }}
            >
              {alertMsg.text}
            </p>

            <button
              onClick={() => setAlertMsg(null)}
              style={{
                width: "100%",
                padding: "1.4rem",
                background:
                  alertMsg.type === "success"
                    ? "var(--green-accent)"
                    : "#d13239",
                color: "#fff",
                borderRadius: "50px",
                border: "none",
                fontSize: "1.6rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow:
                  alertMsg.type === "success"
                    ? "0 4px 14px rgba(0,117,74,0.3)"
                    : "0 4px 14px rgba(209,50,57,0.3)",
                transition: "transform 0.15s",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.95)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
