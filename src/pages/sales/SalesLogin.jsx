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

export default function SalesLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMsg, setAlertMsg] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setAlertMsg({
        type: "error",
        text: "Vui lòng nhập đầy đủ Email và Mật khẩu.",
      });
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/sales/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("salesToken", data.token);
        localStorage.setItem("salesInfo", JSON.stringify(data));

        setAlertMsg({
          type: "success",
          text: "Đăng nhập hệ thống quản lý thành công!",
        });
        setTimeout(() => {
          onLoginSuccess(data);
        }, 1500);
      } else {
        const errText = await response.text();
        setAlertMsg({
          type: "error",
          text: errText || "Sai thông tin đăng nhập!",
        });
      }
    } catch (err) {
      setAlertMsg({ type: "error", text: "Không thể kết nối đến máy chủ!" });
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
      {/* HEADER: Đã giảm font-size xuống 1.4rem */}
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
        <p
          style={{
            fontSize: "1.4rem",
            color: "var(--text-black)",
            fontWeight: 600,
          }}
        >
          <span style={{ color: "var(--green-accent)", fontWeight: 700 }}>
            eMarket Sales
          </span>{" "}
          / Login
        </p>
      </header>

      <main
        style={{
          maxWidth: "500px",
          margin: "8rem auto",
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
          Đăng nhập Nhân viên
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
          <input
            type="email"
            placeholder="Email nhân viên"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "1.6rem",
              fontSize: "1.6rem",
              border: "1px solid rgba(0,0,0,0.2)",
              borderRadius: "0.8rem",
              outline: "none",
            }}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "1.6rem",
              fontSize: "1.6rem",
              border: "1px solid rgba(0,0,0,0.2)",
              borderRadius: "0.8rem",
              outline: "none",
            }}
          />

          {/* VÙNG CHỨA TEXT "FORGOT" VÀ NÚT ĐĂNG NHẬP */}
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
        </form>
      </main>

      {/* POPUP THÔNG BÁO */}
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
              {alertMsg.type === "success" ? "Thành công!" : "Lỗi đăng nhập"}
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
            {alertMsg.type === "error" && (
              <button
                onClick={() => setAlertMsg(null)}
                style={{
                  width: "100%",
                  padding: "1.4rem",
                  background: "#d13239",
                  color: "#fff",
                  borderRadius: "50px",
                  border: "none",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
