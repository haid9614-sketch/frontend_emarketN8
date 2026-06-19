import { useState, useEffect } from 'react';
import creditCard from "../assets/creditCard.png";

/* ─── ICONS ────────────────────────────────────────────── */
function IconArrowLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M11 14L6 9l5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconLocation() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
}

function IconTicket() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7v3.859c0 .537-.213 1.052-.593 1.432L2 13.707l1.407 1.416A2.025 2.025 0 0 0 4 15.714V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3.286c0-.537.213-1.052.593-1.432L22 12.857l-1.407-1.416A2.025 2.025 0 0 0 20 10.027V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z"></path>
      <line x1="9" y1="9" x2="15" y2="15"></line>
      <line x1="15" y1="9" x2="15.01" y2="9"></line>
      <line x1="9" y1="15" x2="9.01" y2="15"></line>
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

/* ─── MOCK DATA ────────────────────────────────────────── */
const MOCK_ADDRESSES = [
  { idAddress: 1, name: "Tạ Hải Dương", sdt: "(+84) 865 032 770", houseNumber: "Số 22, Ngõ 215 Định Công Thượng", ward: "Định Công", district: "Hoàng Mai", city: "Hà Nội" }
];

const MOCK_VOUCHERS = [
  { idVoucher: 1, discount: 20000, quantity: 50 },
  { idVoucher: 2, discount: 50000, quantity: 15 },
  { idVoucher: 3, discount: 15000, quantity: 100 },
];

/* ─── COMPONENT CHÍNH ───────────────────────────────────── */
export default function Checkout({ cartData, onBack, onOrderSuccess }) {
  // State quản lý dữ liệu
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState(MOCK_ADDRESSES[0] || null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  
  // DTO States
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD, Banking, MOMO
  const [note, setNote] = useState('');

  // Popups state
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [showVoucherPopup, setShowVoucherPopup] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false); // Bật form thêm địa chỉ nhanh
  const [newAddressForm, setNewAddressForm] = useState({ name: '', sdt: '', houseNumber: '', ward: '', district: '', city: '' });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!cartData || !cartData.items) return null; // Fallback nếu vào thẳng trang mà chưa có giỏ hàng

  // Tính toán tiền
  const subTotal = cartData.totalPrice || 0;
  const discountAmount = selectedVoucher ? selectedVoucher.discount : 0;
  const totalPayment = Math.max(0, subTotal - discountAmount); // Đảm bảo không âm tiền

  // ── XỬ LÝ NÚT ĐẶT HÀNG (Mapping vào DTO CheckoutRequest) ──
  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }
    
    // lấy idBranch từ localStorage
    const storedBranchId = localStorage.getItem("selectedBranchId") || 1; 

    
    const checkoutRequest = {
      idAddress: selectedAddress.idAddress,
      idVoucher: selectedVoucher ? selectedVoucher.idVoucher : null,
      idBranch: parseInt(storedBranchId),
      paymentMethod: paymentMethod,
      note: note
    };

    console.log("Payload gửi xuống Backend:", checkoutRequest);
    
    // Gọi hàm thành công để App.jsx xử lý (VD: hiện thông báo, chuyển về Home)
    if (onOrderSuccess) onOrderSuccess(checkoutRequest);
  };

  // ── XỬ LÝ LƯU NHANH ĐỊA CHỈ TRONG POPUP ──
  const handleQuickAddAddress = (e) => {
    e.preventDefault();
    const newAddr = { idAddress: Date.now(), ...newAddressForm };
    setAddresses([newAddr, ...addresses]);
    setSelectedAddress(newAddr); // Chọn luôn địa chỉ vừa tạo
    setIsAddingAddress(false);
    setShowAddressPopup(false);
    setNewAddressForm({ name: '', sdt: '', houseNumber: '', ward: '', district: '', city: '' });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--neutral-warm)",
        display: "flex",
        flexDirection: "column",
        paddingBottom: "6rem",
        fontFamily: "inherit",
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
          <span style={{ margin: "0 0.5rem", opacity: 0.4 }}>/</span> Giỏ hàng
          <span style={{ margin: "0 0.5rem", opacity: 0.4 }}>/</span>{" "}
          <span style={{ color: "var(--text-black)", fontWeight: 600 }}>
            Thanh toán và đặt hàng
          </span>
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
        {/* ── 1. ĐỊA CHỈ NHẬN HÀNG ── */}
        <section
          style={{
            background: "#fff",
            borderRadius: "1.2rem",
            overflow: "hidden",
            boxShadow: "var(--card-shadow)",
          }}
        >
          {/* Viền trang trí kiểu phong bì */}
          <div
            style={{
              height: "4px",
              background:
                "repeating-linear-gradient(45deg, #215bc4, #215bc4 15px, transparent 15px, transparent 30px, #d13239 30px, #d13239 45px, transparent 45px, transparent 60px)",
            }}
          />

          <div
            style={{
              padding: "2.4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "var(--green-house)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  marginBottom: "1.2rem",
                }}
              >
                <IconLocation /> Delivery Address
              </h3>
              {selectedAddress ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "1.6rem",
                  }}
                >
                  <span style={{ fontSize: "1.6rem", fontWeight: 700 }}>
                    {selectedAddress.name} ({selectedAddress.sdt})
                  </span>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      color: "var(--text-black-soft)",
                    }}
                  >
                    {selectedAddress.houseNumber}, Phường {selectedAddress.ward}
                    , Quận {selectedAddress.district}, Thành phố{" "}
                    {selectedAddress.city}
                  </span>
                </div>
              ) : (
                <span
                  style={{
                    fontSize: "1.5rem",
                    color: "#d13239",
                    fontWeight: 600,
                  }}
                >
                  Vui lòng chọn hoặc thêm địa chỉ nhận hàng!
                </span>
              )}
            </div>
            <button
              onClick={() => setShowAddressPopup(true)}
              style={{
                background: "var(--green-house)",
                color: "#fff",
                padding: "0.8rem 2.4rem",
                borderRadius: "50px",
                border: "none",
                fontWeight: 700,
                fontSize: "1.4rem",
                cursor: "pointer",
              }}
            >
              Đổi địa chỉ
            </button>
          </div>
        </section>

        {/* ── 2. DANH SÁCH SẢN PHẨM & GIAO HÀNG ── */}
        <section
          style={{
            background: "#fff",
            borderRadius: "1.2rem",
            padding: "3.2rem 2.4rem",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              paddingBottom: "1.6rem",
              marginBottom: "2.4rem",
            }}
          >
            <h3 style={{ fontSize: "2rem", fontWeight: 700, width: "40%" }}>
              Products Ordered
            </h3>
            <span
              style={{
                width: "20%",
                textAlign: "center",
                color: "var(--text-black-soft)",
              }}
            >
              Unit Price
            </span>
            <span
              style={{
                width: "20%",
                textAlign: "center",
                color: "var(--text-black-soft)",
              }}
            >
              Amount
            </span>
            <span
              style={{
                width: "20%",
                textAlign: "right",
                color: "var(--text-black-soft)",
              }}
            >
              Item Subtotal
            </span>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}
          >
            {cartData.items
              .filter((item) => item.isAvailable)
              .map((item) => (
                <div
                  key={item.idProduct}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div
                    style={{
                      width: "40%",
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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "3rem",
                      }}
                    >
                      {item.imageUrl}
                    </div>
                    <span style={{ fontSize: "1.5rem", fontWeight: 500 }}>
                      {item.productName}
                    </span>
                  </div>
                  <span
                    style={{
                      width: "20%",
                      textAlign: "center",
                      fontSize: "1.5rem",
                      fontWeight: 600,
                    }}
                  >
                    {item.price.toLocaleString("vi-VN")}₫
                  </span>
                  <span
                    style={{
                      width: "20%",
                      textAlign: "center",
                      fontSize: "1.5rem",
                    }}
                  >
                    {item.quantity}
                  </span>
                  <span
                    style={{
                      width: "20%",
                      textAlign: "right",
                      fontSize: "1.5rem",
                      fontWeight: 600,
                    }}
                  >
                    {item.subTotal.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              ))}
          </div>

          <div
            style={{
              marginTop: "4rem",
              paddingTop: "2.4rem",
              borderTop: "1px dashed rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "stretch",
            }}
          >
            {/* Note Input */}
            <div
              style={{
                flex: 1,
                borderRight: "1px dashed rgba(0,0,0,0.15)",
                paddingRight: "3.2rem",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "1.6rem" }}
              >
                <span
                  style={{
                    fontSize: "1.5rem",
                    color: "var(--text-black-soft)",
                  }}
                >
                  Message for Sellers:
                </span>
                <input
                  type="text"
                  placeholder="Please leave a message..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "1rem",
                    border: "1px solid rgba(0,0,0,0.15)",
                    borderRadius: "var(--btn-radius)",
                    outline: "none",
                    fontSize: "1.4rem",
                  }}
                />
              </div>
            </div>

            {/* Shipping Info */}
            <div
              style={{
                flex: 1,
                paddingLeft: "3.2rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.6rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>
                    Shipping Option:{" "}
                    <span
                      style={{ fontWeight: 700, color: "var(--green-accent)" }}
                    >
                      Nhanh
                    </span>
                  </p>
                  <p
                    style={{
                      fontSize: "1.3rem",
                      color: "var(--text-black-soft)",
                    }}
                  >
                    đảm bảo nhận hàng trong 1h.
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "var(--green-house)",
                  }}
                >
                  Miễn Phí
                </span>
              </div>
              <div
                style={{
                  background: "#f5fbf7",
                  padding: "1.2rem",
                  borderRadius: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                }}
              >
                <span
                  style={{ color: "var(--green-accent)", fontSize: "1.8rem" }}
                >
                  📦
                </span>
                <span
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 600,
                    color: "var(--green-house)",
                  }}
                >
                  Tủ Nhận Hàng
                </span>
              </div>
              <p
                style={{ fontSize: "1.3rem", color: "var(--text-black-soft)" }}
              >
                Order is eligible for co-check. ⓘ
              </p>
            </div>
          </div>

          <div
            style={{
              textAlign: "right",
              marginTop: "2.4rem",
              paddingTop: "2.4rem",
              borderTop: "1px dashed rgba(0,0,0,0.15)",
            }}
          >
            <span
              style={{
                fontSize: "1.5rem",
                color: "var(--text-black-soft)",
                marginRight: "1.6rem",
              }}
            >
              Order Total ({cartData.items.length} Item):
            </span>
            <span
              style={{
                fontSize: "2.4rem",
                fontWeight: 800,
                color: "var(--green-house)",
              }}
            >
              {subTotal.toLocaleString("vi-VN")}₫
            </span>
          </div>
        </section>

        {/* ── 3. VOUCHER & PAYMENT METHOD ── */}
        <section
          style={{
            background: "#fff",
            borderRadius: "1.2rem",
            padding: "3.2rem 2.4rem",
            boxShadow: "var(--card-shadow)",
          }}
        >
          {/* Chọn Voucher */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2.4rem",
              paddingBottom: "3.2rem",
              borderBottom: "1px dashed rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.2rem",
                width: "20rem",
              }}
            >
              <IconTicket />{" "}
              <span style={{ fontSize: "1.6rem", fontWeight: 600 }}>
                eMarket Voucher
              </span>
            </div>

            <div style={{ flex: 1 }}>
              {selectedVoucher ? (
                <div
                  style={{
                    display: "inline-flex",
                    background: "#e8f3ef",
                    border: "1px solid var(--green-accent)",
                    padding: "0.8rem 1.6rem",
                    borderRadius: "0.4rem",
                    fontWeight: 700,
                    color: "var(--green-house)",
                    fontSize: "1.4rem",
                  }}
                >
                  Giảm {selectedVoucher.discount.toLocaleString("vi-VN")}₫
                </div>
              ) : (
                <span
                  style={{
                    color: "var(--text-black-soft)",
                    fontSize: "1.4rem",
                  }}
                >
                  Bạn có mã giảm giá?
                </span>
              )}
            </div>

            <button
              onClick={() => setShowVoucherPopup(true)}
              style={{
                background: "var(--green-house)",
                color: "#fff",
                padding: "0.8rem 2.4rem",
                borderRadius: "50px",
                border: "none",
                fontWeight: 700,
                fontSize: "1.4rem",
                cursor: "pointer",
              }}
            >
              Chọn voucher
            </button>
          </div>

          {/* Chọn Phương thức thanh toán */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginTop: "3.2rem",
            }}
          >
            <div
              style={{
                width: "20rem",
                fontSize: "1.6rem",
                fontWeight: 600,
                marginTop: "1rem",
              }}
            >
              Payment Method
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  gap: "1.6rem",
                  marginBottom: "3.2rem",
                }}
              >
                {["Banking", "MOMO", "COD"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    style={{
                      flex: 1,
                      padding: "1.2rem",
                      background: "#fff",
                      border:
                        paymentMethod === method
                          ? "2px solid var(--green-accent)"
                          : "1px solid rgba(0,0,0,0.2)",
                      borderRadius: "0.6rem",
                      fontSize: "1.4rem",
                      fontWeight: paymentMethod === method ? 700 : 500,
                      color:
                        paymentMethod === method
                          ? "var(--green-house)"
                          : "var(--text-black)",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    {method}
                    {paymentMethod === method && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-2px",
                          right: "-2px",
                          background: "var(--green-accent)",
                          color: "#fff",
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconCheck />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Layout Tổng kết + Ảnh thẻ */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                {/* Ảnh thẻ */}
                <div
                  style={{
                    width: "280px",
                    height: "160px",
                    background: "#999",
                    borderRadius: "1.2rem",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={creditCard}
                    alt="credit"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Bill tính tiền */}
                <div
                  style={{
                    width: "300px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.2rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "1.4rem",
                      color: "var(--text-black-soft)",
                    }}
                  >
                    <span>Merchandise Subtotal</span>
                    <span
                      style={{ color: "var(--text-black)", fontWeight: 600 }}
                    >
                      {subTotal.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "1.4rem",
                      color: "var(--text-black-soft)",
                    }}
                  >
                    <span>Shipping Subtotal</span>
                    <span
                      style={{ color: "var(--green-accent)", fontWeight: 600 }}
                    >
                      Miễn phí
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "1.4rem",
                      color: "var(--text-black-soft)",
                    }}
                  >
                    <span>Voucher Discount</span>
                    <span
                      style={{ color: "var(--text-black)", fontWeight: 600 }}
                    >
                      - {discountAmount.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "1.2rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.6rem",
                        color: "var(--text-black-soft)",
                      }}
                    >
                      Total Payment:
                    </span>
                    <span
                      style={{
                        fontSize: "2.8rem",
                        fontWeight: 800,
                        color: "var(--green-house)",
                      }}
                    >
                      {totalPayment.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "4rem",
              paddingTop: "2.4rem",
              borderTop: "1px dashed rgba(0,0,0,0.15)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: "1.3rem", color: "var(--text-black-soft)" }}
            >
              By clicking 'Place Order', you are agreeing to{" "}
              <strong
                style={{ color: "var(--green-accent)", cursor: "pointer" }}
              >
                Emarket General Transaction Terms
              </strong>
            </span>
            <button
              onClick={handlePlaceOrder}
              style={{
                background: "var(--green-house)",
                color: "#fff",
                padding: "1.4rem 4rem",
                borderRadius: "var(--btn-radius)",
                border: "none",
                fontWeight: 700,
                fontSize: "1.8rem",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                transition: "transform 0.15s",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.95)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Place Order
            </button>
          </div>
        </section>
      </main>

      {/* ═════════════════════════════════════════════════════════════════
          POPUP: CHỌN / THÊM ĐỊA CHỈ (Mini-form ngay trong popup)
      ═════════════════════════════════════════════════════════════════ */}
      {showAddressPopup && (
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
              maxHeight: "80vh",
            }}
          >
            <div
              style={{
                background: "var(--green-house)",
                padding: "1.6rem",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ fontSize: "1.8rem", fontWeight: 700 }}>
                {isAddingAddress ? "Thêm địa chỉ mới" : "Chọn địa chỉ của bạn"}
              </h3>
              <button
                onClick={() => {
                  setShowAddressPopup(false);
                  setIsAddingAddress(false);
                }}
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
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "1.6rem",
              }}
            >
              {isAddingAddress ? (
                <form
                  onSubmit={handleQuickAddAddress}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.6rem",
                  }}
                >
                  <input
                    required
                    placeholder="Họ và tên"
                    value={newAddressForm.name}
                    onChange={(e) =>
                      setNewAddressForm({
                        ...newAddressForm,
                        name: e.target.value,
                      })
                    }
                    style={{
                      padding: "1.2rem",
                      border: "1px solid #ccc",
                      borderRadius: "0.6rem",
                      fontSize: "1.4rem",
                    }}
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Số điện thoại"
                    value={newAddressForm.sdt}
                    onChange={(e) =>
                      setNewAddressForm({
                        ...newAddressForm,
                        sdt: e.target.value,
                      })
                    }
                    style={{
                      padding: "1.2rem",
                      border: "1px solid #ccc",
                      borderRadius: "0.6rem",
                      fontSize: "1.4rem",
                    }}
                  />
                  <input
                    required
                    placeholder="Số nhà, Tên đường"
                    value={newAddressForm.houseNumber}
                    onChange={(e) =>
                      setNewAddressForm({
                        ...newAddressForm,
                        houseNumber: e.target.value,
                      })
                    }
                    style={{
                      padding: "1.2rem",
                      border: "1px solid #ccc",
                      borderRadius: "0.6rem",
                      fontSize: "1.4rem",
                    }}
                  />
                  <input
                    required
                    placeholder="Phường / Xã"
                    value={newAddressForm.ward}
                    onChange={(e) =>
                      setNewAddressForm({
                        ...newAddressForm,
                        ward: e.target.value,
                      })
                    }
                    style={{
                      padding: "1.2rem",
                      border: "1px solid #ccc",
                      borderRadius: "0.6rem",
                      fontSize: "1.4rem",
                    }}
                  />
                  <input
                    required
                    placeholder="Quận / Huyện"
                    value={newAddressForm.district}
                    onChange={(e) =>
                      setNewAddressForm({
                        ...newAddressForm,
                        district: e.target.value,
                      })
                    }
                    style={{
                      padding: "1.2rem",
                      border: "1px solid #ccc",
                      borderRadius: "0.6rem",
                      fontSize: "1.4rem",
                    }}
                  />
                  <input
                    required
                    placeholder="Thành phố"
                    value={newAddressForm.city}
                    onChange={(e) =>
                      setNewAddressForm({
                        ...newAddressForm,
                        city: e.target.value,
                      })
                    }
                    style={{
                      padding: "1.2rem",
                      border: "1px solid #ccc",
                      borderRadius: "0.6rem",
                      fontSize: "1.4rem",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "1.2rem",
                      marginTop: "1rem",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      style={{
                        flex: 1,
                        padding: "1.2rem",
                        background: "#f5f5f5",
                        border: "none",
                        borderRadius: "50px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: "1.2rem",
                        background: "var(--green-accent)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Lưu & Chọn
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {addresses.length === 0 && (
                    <p
                      style={{
                        fontSize: "1.4rem",
                        textAlign: "center",
                        color: "var(--text-black-soft)",
                        marginBottom: "1rem",
                      }}
                    >
                      Bạn chưa có địa chỉ nào.
                    </p>
                  )}
                  {addresses.map((addr) => (
                    <div
                      key={addr.idAddress}
                      onClick={() => {
                        setSelectedAddress(addr);
                        setShowAddressPopup(false);
                      }}
                      style={{
                        padding: "1.6rem",
                        border:
                          selectedAddress?.idAddress === addr.idAddress
                            ? "2px solid var(--green-accent)"
                            : "1px solid rgba(0,0,0,0.1)",
                        borderRadius: "0.8rem",
                        cursor: "pointer",
                        background:
                          selectedAddress?.idAddress === addr.idAddress
                            ? "#f5fbf7"
                            : "#fff",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "1.5rem",
                          marginBottom: "0.4rem",
                        }}
                      >
                        {addr.name} | {addr.sdt}
                      </div>
                      <div
                        style={{
                          fontSize: "1.3rem",
                          color: "var(--text-black-soft)",
                          lineHeight: 1.5,
                        }}
                      >
                        {addr.houseNumber}, Phường {addr.ward}, Quận{" "}
                        {addr.district}, TP {addr.city}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    style={{
                      marginTop: "1rem",
                      padding: "1.4rem",
                      background: "var(--green-house)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    + Thêm địa chỉ mới
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════
          POPUP: CHỌN VOUCHER
      ═════════════════════════════════════════════════════════════════ */}
      {showVoucherPopup && (
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
              maxWidth: "500px",
              borderRadius: "1.6rem",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              maxHeight: "80vh",
            }}
          >
            <div
              style={{
                background: "var(--green-house)",
                padding: "1.6rem",
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ fontSize: "1.8rem", fontWeight: 700 }}>
                Chọn eMarket Voucher
              </h3>
              <button
                onClick={() => setShowVoucherPopup(false)}
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
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "1.6rem",
              }}
            >
              <button
                onClick={() => {
                  setSelectedVoucher(null);
                  setShowVoucherPopup(false);
                }}
                style={{
                  padding: "1.2rem",
                  background: !selectedVoucher
                    ? "var(--green-accent)"
                    : "#f5f5f5",
                  color: !selectedVoucher ? "#fff" : "#333",
                  border: "none",
                  borderRadius: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Không dùng Voucher
              </button>

              {MOCK_VOUCHERS.map((v) => (
                <div
                  key={v.idVoucher}
                  onClick={() => {
                    setSelectedVoucher(v);
                    setShowVoucherPopup(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1.6rem",
                    border:
                      selectedVoucher?.idVoucher === v.idVoucher
                        ? "2px solid var(--green-accent)"
                        : "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "0.8rem",
                    cursor: "pointer",
                    background:
                      selectedVoucher?.idVoucher === v.idVoucher
                        ? "#f5fbf7"
                        : "#fff",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        color: "var(--green-accent)",
                        textTransform: "uppercase",
                        marginBottom: "0.4rem",
                      }}
                    >
                      eMarket Reward
                    </div>
                    <div style={{ fontSize: "2rem", fontWeight: 800 }}>
                      Giảm {v.discount.toLocaleString("vi-VN")}₫
                    </div>
                  </div>
                  <div
                    style={{
                      background: "rgba(0,0,0,0.05)",
                      padding: "0.4rem 1.2rem",
                      borderRadius: "20px",
                      fontSize: "1.2rem",
                      fontWeight: 600,
                    }}
                  >
                    Còn lại: {v.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}