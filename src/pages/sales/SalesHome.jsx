import { useState, useEffect } from "react";
import logo from "../../assets/logoDS.JPG"; 
import canhBao from "../../assets/canhBao2.png"; 


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

const STATUS_CATEGORIES = [
  { id: "ALL", label: "Tất cả đơn hàng" },
  { id: "PENDING", label: "Chờ xác nhận" },
  { id: "SHIPPING", label: "Đang giao hàng" },
  { id: "DELIVERED", label: "Đã giao thành công" },
  { id: "CANCELLED", label: "Đơn đã hủy" },
];

export default function SalesHome({ onManageOrder, onLogout }) {
  const [activeStatus, setActiveStatus] = useState(() => {
    return sessionStorage.getItem("salesActiveTab") || "ALL";
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const salesInfo = JSON.parse(localStorage.getItem("salesInfo"));
  const token = localStorage.getItem("salesToken");

  useEffect(() => {
    sessionStorage.setItem("salesActiveTab", activeStatus);

    const fetchOrders = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:8080/api/sales/orders/branch/${salesInfo.idBranch}?size=50`;
        if (activeStatus !== "ALL") {
          url += `&status=${activeStatus}`;
        }

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.content);
        }
      } catch (err) {
        console.error("Lỗi tải đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    if (salesInfo?.idBranch) fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStatus]);

  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return { text: "CHỜ XÁC NHẬN", color: "#d9840a" };
      case "SHIPPING":
        return { text: "ĐANG GIAO HÀNG", color: "#215bc4" };
      case "DELIVERED":
        return { text: "ĐÃ GIAO THÀNH CÔNG", color: "var(--green-house)" };
      case "CANCELLED":
        return { text: "ĐÃ HỦY", color: "#d13239" };
      default:
        return { text: status, color: "var(--text-black)" };
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
            justifyContent: "space-between",
            padding: "0 2.4rem",
            height: "7.2rem",
          }}
        >
          {/* BÊN TRÁI: Logo + Text */}
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <img
              src={logo}
              alt="Logo"
              style={{ width: "60px", height: "60px", borderRadius: "50%" }}
            />
            <p
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "var(--text-black)",
              }}
            >
              <span style={{ color: "var(--green-accent)", fontWeight: 700 }}>
                eMarket Sales
              </span>{" "}
              / Quản lý đơn hàng
            </p>
          </div>

          {/* BÊN PHẢI: Khung Chi nhánh + Nút Đăng xuất */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.6rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.8rem 1.4rem",
                borderRadius: "var(--btn-radius)",
                border: "1px solid rgba(0,0,0,0.25)",
                color: "var(--text-black)",
                fontSize: "1.4rem",
                fontWeight: 600,
              }}
            >
              <IconPin color="var(--green-accent)" />
              Chi nhánh ID: {salesInfo?.idBranch}
            </div>

            <button
              onClick={onLogout}
              style={{
                padding: "0.8rem 1.8rem",
                borderRadius: "var(--btn-radius)",
                background: "#d13239",
                color: "#fff",
                fontSize: "1.4rem",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                transition: "transform 0.15s",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.95)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      {/* NỘI DUNG CHÍNH BÊN DƯỚI */}
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        {/* LEFT SIDEBAR: Trạng thái đơn hàng */}
        <aside
          style={{
            width: "26rem",
            flexShrink: 0,
            padding: "3.2rem 2.4rem",
            position: "sticky",
            top: "7.2rem",
          }}
        >
          <h2
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              color: "var(--text-black)",
              marginBottom: "2rem",
            }}
          >
            Trạng thái
          </h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {STATUS_CATEGORIES.map((cat, i) => (
              <div key={cat.id}>
                <button
                  onClick={() => setActiveStatus(cat.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "1.4rem 1rem",
                    background: activeStatus === cat.id ? "#f5fbf7" : "none",
                    border: "none",
                    borderRadius: "0.8rem",
                    color:
                      activeStatus === cat.id
                        ? "var(--green-accent)"
                        : "var(--text-black)",
                    fontSize: "1.5rem",
                    fontWeight: activeStatus === cat.id ? 800 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {cat.label}
                </button>
                {i < STATUS_CATEGORIES.length - 1 && (
                  <div
                    style={{
                      height: "1px",
                      background: "rgba(0,0,0,0.05)",
                      margin: "0.4rem 0",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT MAIN AREA */}
        <main style={{ flex: 1, padding: "2.4rem 2.4rem 2.4rem 0" }}>
        
          {/* KHU VỰC BANNER */}
          <div
            style={{
              width: "100%",
              height: "220px",
              marginBottom: "3.2rem",
              borderRadius: "1.4rem",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={canhBao}
              alt="Banner cảnh báo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "6rem 0",
                fontSize: "1.8rem",
                fontWeight: 700,
              }}
            >
              Đang tải dữ liệu...
            </div>
          ) : orders.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "6rem 0",
                fontSize: "1.6rem",
                color: "var(--text-black-soft)",
              }}
            >
              Không có đơn hàng nào.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2.4rem",
              }}
            >
              {orders.map((order) => {
                const statusMeta = getStatusLabel(order.status);
                return (
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
                      <span style={{ fontSize: "1.8rem", fontWeight: 800 }}>
                        Order ID: {order.idOrders}
                      </span>
                      <span
                        style={{
                          fontSize: "1.5rem",
                          color: statusMeta.color,
                          fontWeight: 800,
                        }}
                      >
                        {statusMeta.text}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.2rem",
                        marginBottom: "2rem",
                      }}
                    >
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1.6rem",
                          }}
                        >
                          <div
                            style={{
                              width: "6rem",
                              height: "6rem",
                              background: "#f0f0f0",
                              borderRadius: "0.8rem",
                              overflow: "hidden",
                            }}
                          >
                            {item.imageUrl &&
                            item.imageUrl.startsWith("http") ? (
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
                              <div
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "2.5rem",
                                }}
                              >
                                {item.imageUrl || "📦"}
                              </div>
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p
                              style={{
                                fontSize: "1.5rem",
                                fontWeight: 600,
                                color: "var(--text-black)",
                              }}
                            >
                              {item.productName}
                            </p>
                            <p
                              style={{
                                fontSize: "1.4rem",
                                color: "var(--text-black-soft)",
                              }}
                            >
                              x{item.quantity}
                            </p>
                          </div>
                          <span style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                            {item.price.toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px dashed rgba(0,0,0,0.1)",
                        paddingTop: "2rem",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: "1.5rem",
                            color: "var(--text-black-soft)",
                          }}
                        >
                          Tổng tiền:{" "}
                        </span>
                        <span
                          style={{
                            fontSize: "2rem",
                            fontWeight: 800,
                            color: "var(--green-house)",
                          }}
                        >
                          {order.total.toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                      <button
                        onClick={() => onManageOrder(order)}
                        style={{
                          padding: "1rem 2.4rem",
                          borderRadius: "var(--btn-radius)",
                          background: "var(--green-accent)",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: "1.4rem",
                          border: "none",
                          cursor: "pointer",
                          transition: "transform 0.15s",
                        }}
                        onMouseDown={(e) =>
                          (e.currentTarget.style.transform = "scale(0.95)")
                        }
                        onMouseUp={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        Quản lý đơn hàng
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
