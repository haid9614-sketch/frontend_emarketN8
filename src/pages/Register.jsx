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

export default function Register({ onBack, onRegisterSuccess, onGoToLogin }) {
  // Ánh xạ 100% với RegisterRequest DTO
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Kiểm tra rỗng
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setError("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
      return;
    }

    // 2. Validate định dạng Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Định dạng email không hợp lệ (Ví dụ: abc@gmail.com)");
      return;
    }

    // 3. Validate Mật khẩu tối thiểu 6 ký tự
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    // Chuyển age thành Integer nếu có nhập, không thì để null
    const finalData = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : null,
    };

    // Đẩy dữ liệu ra ngoài (Khớp DTO)
    onRegisterSuccess(finalData);
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
          <span style={{ margin: "0 0.5rem", opacity: 0.4 }}>/</span>{" "}
          <span style={{ color: "var(--text-black)", fontWeight: 600 }}>
            Đăng ký thành viên
          </span>
        </p>
      </header>

      {/* ── MAIN FORM ── */}
      <main
        style={{
          maxWidth: "600px",
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
          Tạo tài khoản eMarket
        </h2>

        <form
          onSubmit={handleSubmit}
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
          {error && (
            <div
              style={{
                padding: "1.2rem",
                background: "rgba(209, 50, 57, 0.1)",
                borderRadius: "0.8rem",
                color: "#d13239",
                fontSize: "1.4rem",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Họ và tên (*)"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setError("");
            }}
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

          <input
            type="email"
            placeholder="Email (*)"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setError("");
            }}
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

          <input
            type="tel"
            placeholder="Số điện thoại (*)"
            value={formData.phone}
            onChange={(e) => {
              setFormData({ ...formData, phone: e.target.value });
              setError("");
            }}
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

          <input
            type="number"
            placeholder="Tuổi (Không bắt buộc)"
            value={formData.age}
            onChange={(e) => {
              setFormData({ ...formData, age: e.target.value });
              setError("");
            }}
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

          <input
            type="password"
            placeholder="Mật khẩu (Tối thiểu 6 ký tự) (*)"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setError("");
            }}
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

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem",
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
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Đăng ký
            </button>
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "0.5rem",
              paddingTop: "2.4rem",
              borderTop: "1px solid rgba(0,0,0,0.1)",
              fontSize: "1.5rem",
            }}
          >
            <span style={{ color: "var(--text-black-soft)" }}>
              Đã có tài khoản?{" "}
            </span>
            <span
              onClick={onGoToLogin}
              style={{
                color: "var(--green-accent)",
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Đăng nhập
            </span>
          </div>
        </form>
      </main>
    </div>
  );
}
