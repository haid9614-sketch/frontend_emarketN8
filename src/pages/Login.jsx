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

export default function Login({ onBack, onLogin, onGoToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Luôn cuộn lên trên cùng khi mở trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
 
  // api dang nhap
 const handleSubmit = async (e) => {
   e.preventDefault();
   if (!email.trim() || !password.trim()) {
     setError("Vui lòng nhập đầy đủ Email và Mật khẩu.");
     return;
   }

   try {
    
     const response = await fetch(
       "http://localhost:8080/api/auth/customer/login",
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ email, password }),
       },
     );

     if (response.ok) {
       const data = await response.json(); // Hứng JwtResponse (token, role, idUser, idBranch)
       onLogin({ ...data, email }); // Gửi data lên App.jsx xử lý lưu trữ
     }
     else {
       const errText = await response.text();
       setError(errText || "Đăng nhập thất bại!");
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
            Đăng nhập
          </span>
        </p>
      </header>

      {/* ── MAIN FORM ── */}
      <main
        style={{
          maxWidth: "600px",
          margin: "6rem auto",
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
          Đăng nhập tài khoản
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
            type="email"
            required
            placeholder="Email của bạn"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
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
            required
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
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
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              <span
                style={{
                  color: "var(--green-accent)",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Forgot your username?
              </span>
              <span
                style={{
                  color: "var(--green-accent)",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Forgot your password?
              </span>
            </div>

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
              Đăng nhập
            </button>
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "1.6rem",
              paddingTop: "2.4rem",
              borderTop: "1px solid rgba(0,0,0,0.1)",
              fontSize: "1.5rem",
            }}
          >
            <span style={{ color: "var(--text-black-soft)" }}>
              Chưa có tài khoản?{" "}
            </span>
            <span
              onClick={onGoToRegister}
              style={{
                color: "var(--green-accent)",
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Đăng ký ngay
            </span>
          </div>
        </form>
      </main>
    </div>
  );
}
