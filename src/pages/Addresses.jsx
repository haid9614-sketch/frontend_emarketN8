import { useState, useEffect } from "react";

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

/* ─── MOCK DATA VỚI ENTITY ADDRESS ──────── */
const INITIAL_ADDRESSES = [
  {
    idAddress: 1,
    name: "Tạ Hải Dương",
    sdt: "0865032770",
    houseNumber: "Số 22, Ngõ 215",
    ward: "Định Công Thượng",
    district: "Hoàng Mai",
    city: "Hà Nội",
  },
];

/* ─── COMPONENT CHÍNH ───────────────────────────────────── */
export default function Addresses({ onBack }) {
  // Trạng thái điều hướng nội bộ: 'list' (Danh sách) hoặc 'add' (Thêm mới)
  const [view, setView] = useState("list");

  // State danh sách địa chỉ nhận từ API 
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);

  // State điều khiển Popup Xóa
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // State Form Thêm 
  const [formData, setFormData] = useState({
    name: "",
    sdt: "",
    houseNumber: "",
    ward: "",
    district: "",
    city: "",
  });

  // Tự động cuộn lên đầu trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Điều phối nút Quay lại ở Header
  const handleHeaderBack = () => {
    if (view === "add") {
      setView("list");
    } else {
      onBack();
    }
  };

  // Xác nhận hành động xóa địa chỉ
  const confirmDelete = () => {
    setAddresses((prev) =>
      prev.filter((addr) => addr.idAddress !== deleteTargetId),
    );
    setDeleteTargetId(null);
  };

  // Xử lý khi bấm nút Ok
  const handleAddNew = (e) => {
    e.preventDefault();

    
    const newAddress = {
      idAddress: Date.now(), 
      name: formData.name,
      sdt: formData.sdt,
      houseNumber: formData.houseNumber,
      ward: formData.ward,
      district: formData.district,
      city: formData.city,
    };

    setAddresses((prev) => [...prev, newAddress]);

    // Reset toàn bộ form về trạng thái trống
    setFormData({
      name: "",
      sdt: "",
      houseNumber: "",
      ward: "",
      district: "",
      city: "",
    });
    setView("list"); 
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
      {/* ── HEADER CHUNG ── */}
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
            fontFamily: "inherit",
            letterSpacing: "-0.01em",
            boxShadow: "0 2px 6px rgba(0,117,74,0.22)",
            transition: "transform 0.15s",
            width: "fit-content",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <IconArrowLeft /> Quay lại
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
          <span
            style={{
              color:
                view === "list"
                  ? "var(--text-black)"
                  : "var(--text-black-soft)",
              fontWeight: view === "list" ? 600 : 400,
            }}
          >
            Địa chỉ của bạn
          </span>

          {view === "add" && (
            <>
              <span style={{ margin: "0 0.5rem", opacity: 0.4 }}>/</span>
              <span style={{ color: "var(--text-black)", fontWeight: 600 }}>
                Thêm địa chỉ mới
              </span>
            </>
          )}
        </p>
      </header>

      {/* ── MÀN HÌNH 1: DANH SÁCH ĐỊA CHỈ KHẢ DỤNG ── */}
      {view === "list" && (
        <main
          style={{
            maxWidth: "1200px",
            margin: "4rem auto",
            width: "100%",
            padding: "0 2.4rem",
            display: "flex",
            gap: "4rem",
            alignItems: "flex-start",
          }}
        >
          {/* Cột trái: Danh sách các thẻ địa chỉ */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "2.4rem",
            }}
          >
            {addresses.length === 0 ? (
              <p
                style={{ fontSize: "1.6rem", color: "var(--text-black-soft)" }}
              >
                Bạn chưa có địa chỉ giao hàng nào.
              </p>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr.idAddress}
                  style={{
                    background: "#fff",
                    borderRadius: "0.8rem",
                    padding: "2.4rem",
                    border: "2px solid var(--green-accent)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  <div>
                    {/* Render thông tin Động từ Entity*/}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                        marginBottom: "0.8rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.6rem",
                          fontWeight: 700,
                          color: "var(--text-black)",
                        }}
                      >
                        {addr.name}
                      </span>
                      <span
                        style={{
                          width: "1px",
                          height: "1.4rem",
                          background: "rgba(0,0,0,0.2)",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "1.4rem",
                          color: "var(--text-black-soft)",
                          fontWeight: 500,
                        }}
                      >
                        {addr.sdt}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "1.5rem",
                        color: "var(--text-black-soft)",
                        lineHeight: 1.5,
                      }}
                    >
                      {addr.houseNumber} <br />
                      Phường {addr.ward}, Quận {addr.district}, Thành phố{" "}
                      {addr.city}
                    </p>
                  </div>

                  <button
                    onClick={() => setDeleteTargetId(addr.idAddress)}
                    style={{
                      background: "var(--green-accent)",
                      color: "#fff",
                      border: "none",
                      padding: "0.8rem 2.4rem",
                      borderRadius: "50px",
                      fontSize: "1.4rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "transform 0.1s",
                    }}
                    onMouseDown={(e) =>
                      (e.currentTarget.style.transform = "scale(0.95)")
                    }
                    onMouseUp={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    Xóa địa chỉ
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Cột phải: Khối tóm tắt hướng dẫn */}
          <aside
            style={{
              width: "380px",
              background: "#fff",
              borderRadius: "1.2rem",
              padding: "3.2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              position: "sticky",
              top: "10rem",
            }}
          >
            <h3
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "var(--text-black)",
                marginBottom: "1.6rem",
                lineHeight: 1.4,
              }}
            >
              Bạn nhớ hãy xác nhận thật kĩ địa chỉ nhé
            </h3>
            <p
              style={{
                fontSize: "1.4rem",
                color: "var(--text-black-soft)",
                marginBottom: "3.2rem",
                lineHeight: 1.6,
              }}
            >
              eMarket cần xác minh sđt và định vị của bạn khi thêm địa chỉ mới
              để tránh đơn ảo
            </p>
            <button
              onClick={() => setView("add")}
              style={{
                width: "100%",
                padding: "1.6rem",
                borderRadius: "var(--btn-radius)",
                background: "var(--green-house)",
                color: "#fff",
                fontSize: "1.6rem",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
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
              Thêm địa chỉ mới
            </button>
          </aside>
        </main>
      )}

      {/* ── MÀN HÌNH 2: FORM ĐIỀN ĐỊA CHỈ ── */}
      {view === "add" && (
        <main
          style={{
            maxWidth: "700px",
            margin: "4rem auto",
            width: "100%",
            padding: "0 2.4rem",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "2.8rem",
              fontWeight: 800,
              color: "var(--text-black)",
              marginBottom: "3.2rem",
            }}
          >
            Điền địa chỉ nhận hàng mới của bạn
          </h2>

          <form
            onSubmit={handleAddNew}
            style={{
              background: "#fff",
              padding: "4rem",
              borderRadius: "1.6rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              gap: "2.4rem",
            }}
          >
            {/* 1. Trường Tên người nhận (name)*/}
            <input
              required
              placeholder="Họ và tên người nhận (name)"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              style={{
                width: "100%",
                padding: "1.6rem",
                fontSize: "1.6rem",
                border: "1px solid rgba(0,0,0,0.2)",
                borderRadius: "0.8rem",
                outline: "none",
                fontFamily: "inherit",
              }}
            />

            {/* 2. Trường Số điện thoại người nhận (sdt)*/}
            <input
              required
              type="tel"
              placeholder="Số điện thoại nhận hàng (sdt)"
              value={formData.sdt}
              onChange={(e) =>
                setFormData({ ...formData, sdt: e.target.value })
              }
              style={{
                width: "100%",
                padding: "1.6rem",
                fontSize: "1.6rem",
                border: "1px solid rgba(0,0,0,0.2)",
                borderRadius: "0.8rem",
                outline: "none",
                fontFamily: "inherit",
              }}
            />

            {/* 3. Trường Số nhà / Đường phố (houseNumber) */}
            <input
              required
              placeholder="Số nhà, Tên đường (houseNumber)"
              value={formData.houseNumber}
              onChange={(e) =>
                setFormData({ ...formData, houseNumber: e.target.value })
              }
              style={{
                width: "100%",
                padding: "1.6rem",
                fontSize: "1.6rem",
                border: "1px solid rgba(0,0,0,0.2)",
                borderRadius: "0.8rem",
                outline: "none",
                fontFamily: "inherit",
              }}
            />

            {/* 4. Trường Phường / Xã (ward) */}
            <input
              required
              placeholder="Phường / Xã (ward)"
              value={formData.ward}
              onChange={(e) =>
                setFormData({ ...formData, ward: e.target.value })
              }
              style={{
                width: "100%",
                padding: "1.6rem",
                fontSize: "1.6rem",
                border: "1px solid rgba(0,0,0,0.2)",
                borderRadius: "0.8rem",
                outline: "none",
                fontFamily: "inherit",
              }}
            />

            {/* 5. Trường Quận / Huyện (district) */}
            <input
              required
              placeholder="Quận / Huyện (district)"
              value={formData.district}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value })
              }
              style={{
                width: "100%",
                padding: "1.6rem",
                fontSize: "1.6rem",
                border: "1px solid rgba(0,0,0,0.2)",
                borderRadius: "0.8rem",
                outline: "none",
                fontFamily: "inherit",
              }}
            />

            {/* 6. Trường Tỉnh / Thành phố (city) */}
            <input
              required
              placeholder="Tỉnh / Thành phố (city)"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              style={{
                width: "100%",
                padding: "1.6rem",
                fontSize: "1.6rem",
                border: "1px solid rgba(0,0,0,0.2)",
                borderRadius: "0.8rem",
                outline: "none",
                fontFamily: "inherit",
              }}
            />

            {/*Submit form*/}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1.6rem",
              }}
            >
              <button
                type="submit"
                style={{
                  padding: "1.2rem 4rem",
                  borderRadius: "50px",
                  background: "var(--green-house)",
                  color: "#fff",
                  fontSize: "1.6rem",
                  fontWeight: 700,
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
                Ok
              </button>
            </div>
          </form>
        </main>
      )}

      {/* ── POPUP XÁC NHẬN XÓA ĐỊA CHỈ ── */}
      {deleteTargetId !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "1.6rem",
              padding: "3.2rem",
              width: "100%",
              maxWidth: "400px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              textAlign: "center",
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
              Xóa địa chỉ?
            </h3>
            <p
              style={{
                fontSize: "1.5rem",
                color: "var(--text-black-soft)",
                marginBottom: "3.2rem",
              }}
            >
              Bạn có chắc chắn muốn xóa địa chỉ này khỏi danh sách không?
            </p>

            <div style={{ display: "flex", gap: "1.6rem" }}>
              <button
                onClick={() => setDeleteTargetId(null)}
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
                onClick={confirmDelete}
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
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
