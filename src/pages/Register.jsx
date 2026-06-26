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


function IconSuccessCircle() {
  return (
    <svg
      width="72"
      height="72"
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

export default function Register({ onBack, onRegisterSuccess, onGoToLogin }) {
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(null); 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // API Đăng ký
  const handleSubmit = async (e) => {
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

  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Định dạng email không hợp lệ (Ví dụ: abc@gmail.com)");
      return;
    }

   
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    const finalData = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : null,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/customer/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        },
      );

      if (response.ok) {
        const msg = await response.text();
        setSuccessMsg(msg);
      } else {
        const errText = await response.text();
        setError(errText || "Đăng ký thất bại!");
      }
    } catch (err) {
      setError("Không thể kết nối đến Server! Vui lòng kiểm tra lại Backend.");
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

      {/* ═════════════════════════════════════════════════════════════════
          POPUP: ĐĂNG KÝ THÀNH CÔNG
      ═════════════════════════════════════════════════════════════════ */}
      {successMsg && (
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
              <IconSuccessCircle />
            </div>

            <h2
              style={{
                fontSize: "2.6rem",
                fontWeight: 800,
                color: "var(--text-black)",
                marginBottom: "1.2rem",
                letterSpacing: "-0.02em",
              }}
            >
              Tuyệt vời!
            </h2>

            <p
              style={{
                fontSize: "1.6rem",
                color: "var(--text-black-soft)",
                lineHeight: 1.6,
                marginBottom: "3.2rem",
              }}
            >
              {successMsg}
            </p>

            <button
              onClick={() => {
                setSuccessMsg(null);
                onGoToLogin(); 
              }}
              style={{
                width: "100%",
                padding: "1.6rem",
                background: "var(--green-accent)",
                color: "#fff",
                borderRadius: "50px",
                border: "none",
                fontSize: "1.6rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(0,117,74,0.3)",
                transition: "transform 0.15s, background 0.15s",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.95)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#006241")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--green-accent)")
              }
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
