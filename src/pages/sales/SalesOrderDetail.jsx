import { useState, useEffect } from "react";

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
function IconLocation() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
}
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

export default function SalesOrderDetail({ order, onBack }) {
  const [confirmModal, setConfirmModal] = useState(null); // Lưu trạng thái muốn chuyển tới
  const [alertMsg, setAlertMsg] = useState(null);

  const token = localStorage.getItem("salesToken");
  const salesInfo = JSON.parse(localStorage.getItem("salesInfo"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Tính toán lại để biết có dùng Voucher hay không
  const subTotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discountAmount = subTotal > order.total ? subTotal - order.total : 0;

  // Xử lý API Cập nhật trạng thái
  const executeUpdate = async () => {
    if (!confirmModal) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/sales/orders/${order.idOrders}/status?newStatus=${confirmModal}&idBranch=${salesInfo.idBranch}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const textMsg = await res.text();
      if (res.ok) {
        setAlertMsg({ type: "success", text: textMsg });
      } else {
        setAlertMsg({ type: "error", text: textMsg });
      }
    } catch (err) {
      setAlertMsg({ type: "error", text: "Lỗi kết nối tới máy chủ!" });
    } finally {
      setConfirmModal(null);
    }
  };

  // Xác định các nút bấm thao tác dựa vào trạng thái hiện tại (Logic đi 1 chiều)
  const renderActionButtons = () => {
    if (order.status === "DELIVERED") {
      return (
        <span
          style={{
            background: "var(--green-house)",
            color: "#fff",
            padding: "1.2rem 3rem",
            borderRadius: "50px",
            fontSize: "1.6rem",
            fontWeight: 800,
          }}
        >
          ĐÃ GIAO THÀNH CÔNG
        </span>
      );
    }
    if (order.status === "CANCELLED") {
      return (
        <span
          style={{
            background: "#d13239",
            color: "#fff",
            padding: "1.2rem 3rem",
            borderRadius: "50px",
            fontSize: "1.6rem",
            fontWeight: 800,
          }}
        >
          ĐƠN HÀNG ĐÃ HỦY
        </span>
      );
    }

    return (
      <div style={{ display: "flex", gap: "1.6rem" }}>
        <button
          onClick={() => setConfirmModal("CANCELLED")}
          style={{
            padding: "1.2rem 3rem",
            borderRadius: "50px",
            background: "#f5f5f5",
            color: "#d13239",
            fontSize: "1.6rem",
            fontWeight: 800,
            border: "2px solid #d13239",
            cursor: "pointer",
          }}
        >
          Hủy Đơn Hàng
        </button>

        {order.status === "PENDING" && (
          <button
            onClick={() => setConfirmModal("SHIPPING")}
            style={{
              padding: "1.2rem 3rem",
              borderRadius: "50px",
              background: "var(--green-accent)",
              color: "#fff",
              fontSize: "1.6rem",
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
            }}
          >
            Chuyển sang ĐANG GIAO
          </button>
        )}
        {order.status === "SHIPPING" && (
          <button
            onClick={() => setConfirmModal("DELIVERED")}
            style={{
              padding: "1.2rem 3rem",
              borderRadius: "50px",
              background: "var(--green-house)",
              color: "#fff",
              fontSize: "1.6rem",
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
            }}
          >
            Chuyển sang ĐÃ GIAO
          </button>
        )}
      </div>
    );
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
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          padding: "1.6rem 4rem",
          display: "flex",
          gap: "2rem",
          alignItems: "center",
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
          }}
        >
          <IconArrowLeft /> Quay lại
        </button>
        <p
          style={{
            fontSize: "1.6rem",
            color: "var(--text-black)",
            fontWeight: 700,
          }}
        >
          <span style={{ color: "var(--green-accent)" }}>eMarket Sales</span> /
          Quản lý đơn hàng / Order ID: {order.idOrders}
        </p>
      </header>

      <main
        style={{
          maxWidth: "1000px",
          margin: "3.2rem auto",
          width: "100%",
          padding: "0 2.4rem",
          display: "flex",
          flexDirection: "column",
          gap: "2.4rem",
        }}
      >
        {/* 1. THÔNG TIN KHÁCH HÀNG */}
        <section
          style={{
            background: "#fff",
            borderRadius: "1.2rem",
            overflow: "hidden",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <div
            style={{
              height: "4px",
              background:
                "repeating-linear-gradient(45deg, #215bc4, #215bc4 15px, transparent 15px, transparent 30px, #d13239 30px, #d13239 45px, transparent 45px, transparent 60px)",
            }}
          />
          <div style={{ padding: "2.4rem" }}>
            <h3
              style={{
                fontSize: "1.8rem",
                fontWeight: 700,
                color: "var(--green-house)",
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
                marginBottom: "1.6rem",
              }}
            >
              <IconLocation /> Địa chỉ & Thông tin người nhận
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
                fontSize: "1.5rem",
              }}
            >
              <p>
                <strong>Khách hàng:</strong> {order.receiverName} -{" "}
                <strong>SĐT:</strong> {order.receiverPhone}
              </p>
              <p>
                <strong>Địa chỉ giao:</strong> {order.shippingAddress}
              </p>
              <p>
                <strong>Ghi chú:</strong> {order.note || "Không có ghi chú"}
              </p>
            </div>
          </div>
        </section>

        {/* 2. DANH SÁCH SẢN PHẨM */}
        <section
          style={{
            background: "#fff",
            borderRadius: "1.2rem",
            padding: "3.2rem 2.4rem",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <h3
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              marginBottom: "2.4rem",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              paddingBottom: "1.6rem",
            }}
          >
            Chi tiết sản phẩm mua
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
          >
            {order.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.6rem",
                    width: "50%",
                  }}
                >
                  <div
                    style={{
                      width: "6rem",
                      height: "6rem",
                      background: "#f0f0f0",
                      borderRadius: "0.8rem",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
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
                      item.imageUrl || "📦"
                    )}
                  </div>
                  <span style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                    {item.productName}
                  </span>
                </div>
                <span style={{ fontSize: "1.5rem" }}>
                  {item.price.toLocaleString("vi-VN")}₫ x {item.quantity}
                </span>
                <span style={{ fontSize: "1.6rem", fontWeight: 700 }}>
                  {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. TỔNG KẾT THANH TOÁN */}
        <section
          style={{
            background: "#fff",
            borderRadius: "1.2rem",
            padding: "3.2rem 2.4rem",
            boxShadow: "var(--card-shadow)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              fontSize: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
            }}
          >
            <p>
              <strong>Phương thức TT:</strong>{" "}
              <span
                style={{
                  padding: "0.4rem 1.2rem",
                  background: "#e8f3ef",
                  color: "var(--green-house)",
                  borderRadius: "20px",
                  fontWeight: 700,
                }}
              >
                {order.paymentMethod}
              </span>
            </p>
            <p>
              <strong>Trạng thái Voucher:</strong>{" "}
              {discountAmount > 0 ? (
                <span style={{ color: "var(--green-accent)", fontWeight: 700 }}>
                  Có sử dụng voucher
                </span>
              ) : (
                <span style={{ color: "var(--text-black-soft)" }}>
                  Không có voucher
                </span>
              )}
            </p>
            <p>
              <strong>Ngày đặt hàng:</strong>{" "}
              {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>

          <div
            style={{
              width: "350px",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.5rem",
                color: "var(--text-black-soft)",
              }}
            >
              <span>Tiền hàng:</span>{" "}
              <span style={{ color: "var(--text-black)", fontWeight: 600 }}>
                {subTotal.toLocaleString("vi-VN")}₫
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.5rem",
                color: "var(--text-black-soft)",
              }}
            >
              <span>Giảm giá Voucher:</span>{" "}
              <span style={{ color: "var(--text-black)", fontWeight: 600 }}>
                - {discountAmount.toLocaleString("vi-VN")}₫
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1.2rem",
                borderTop: "1px dashed rgba(0,0,0,0.15)",
                paddingTop: "1.6rem",
              }}
            >
              <span style={{ fontSize: "1.8rem", fontWeight: 800 }}>
                Khách phải trả:
              </span>
              <span
                style={{
                  fontSize: "2.8rem",
                  fontWeight: 800,
                  color: "var(--green-house)",
                }}
              >
                {order.total.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>
        </section>

        {/* 4. THANH HÀNH ĐỘNG CẬP NHẬT */}
        <section
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "2rem",
          }}
        >
          {renderActionButtons()}
        </section>
      </main>

      {/* POPUP XÁC NHẬN CẬP NHẬT */}
      {confirmModal && (
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
              Xác nhận cập nhật
            </h3>
            <p
              style={{
                fontSize: "1.5rem",
                color: "var(--text-black-soft)",
                marginBottom: "3.2rem",
              }}
            >
              Bạn chắc chắn muốn đổi trạng thái đơn hàng này thành{" "}
              <strong>{confirmModal}</strong> chứ?
            </p>
            <div style={{ display: "flex", gap: "1.6rem" }}>
              <button
                onClick={() => setConfirmModal(null)}
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
                Hủy
              </button>
              <button
                onClick={executeUpdate}
                style={{
                  flex: 1,
                  padding: "1.4rem",
                  borderRadius: "50px",
                  background: "var(--green-accent)",
                  color: "#fff",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP THÔNG BÁO KẾT QUẢ CẬP NHẬT */}
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
              {alertMsg.type === "success" ? "Thành công!" : "Lỗi!"}
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
              onClick={() => {
                setAlertMsg(null);
                if (alertMsg.type === "success") onBack();
              }}
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
              }}
            >
              Quay về danh sách
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
