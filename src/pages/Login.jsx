import { useState } from "react";

/* ─── Starbucks logo (inline SVG) ───────────────────────── */
function SbuxLogo({ size = 56 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="28" cy="28" r="28" fill="#1E3932" />
      <circle
        cx="28"
        cy="28"
        r="22"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />
      <circle
        cx="28"
        cy="28"
        r="16"
        stroke="white"
        strokeWidth="1"
        fill="none"
      />
      <path d="M16 28 Q28 12 40 28 Q28 44 16 28" fill="white" opacity="0.85" />
      <circle cx="28" cy="28" r="5" fill="#1E3932" />
      <circle cx="28" cy="28" r="2.5" fill="white" opacity="0.6" />
    </svg>
  );
}

/* ─── Component ─────────────────────────────────────────── */
export default function Login({ onBack, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [keepMe, setKeepMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    // Demo: accept any credentials
    const name = email.includes("@") ? email.split("@")[0] : email;
    onLogin({ name, email });
  };

  const field = (focused) => ({
    width: "100%",
    padding: "1.4rem 1.6rem",
    border: `1px solid ${focused ? "var(--green-accent)" : "rgba(0,0,0,0.22)"}`,
    borderRadius: "0.8rem",
    fontSize: "1.6rem",
    fontFamily: "inherit",
    outline: "none",
    color: "var(--text-black)",
    letterSpacing: "-0.01em",
    transition: "border-color 0.2s",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--neutral-warm)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Mini header ── */}
      <header
        style={{
          height: "7.2rem",
          background: "#fff",
          boxShadow: "var(--nav-shadow)",
          display: "flex",
          alignItems: "center",
          padding: "0 3.2rem",
          gap: "1.6rem",
        }}
      >
        <button
          onClick={onBack}
          style={{
            fontSize: "2.2rem",
            color: "var(--text-black)",
            background: "none",
            border: "none",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ←
        </button>
        <SbuxLogo size={48} />
      </header>

      {/* ── Main content ── */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "6rem 2.4rem 4rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "520px" }}>
          <h1
            style={{
              fontSize: "2.8rem",
              fontWeight: 700,
              color: "var(--text-black)",
              textAlign: "center",
              marginBottom: "4rem",
              letterSpacing: "-0.02em",
            }}
          >
            Sign in or create an account
          </h1>

          <div
            style={{
              background: "#fff",
              borderRadius: "var(--card-radius)",
              boxShadow: "var(--card-shadow)",
              padding: "3.2rem",
            }}
          >
            <p
              style={{
                fontSize: "1.35rem",
                color: "var(--text-black-soft)",
                marginBottom: "2rem",
              }}
            >
              * indicates required field
            </p>

            {/* Error */}
            {error && (
              <div
                style={{
                  padding: "1rem 1.4rem",
                  background: "rgba(200,32,20,0.07)",
                  borderRadius: "0.8rem",
                  marginBottom: "1.6rem",
                }}
              >
                <p style={{ color: "#c82014", fontSize: "1.4rem" }}>{error}</p>
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: "1.6rem" }}>
              <InputField
                type="email"
                placeholder="* Username or email address"
                value={email}
                onChange={(v) => {
                  setEmail(v);
                  setError("");
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "2rem", position: "relative" }}>
              <InputField
                type={showPwd ? "text" : "password"}
                placeholder="* Password"
                value={password}
                onChange={(v) => {
                  setPassword(v);
                  setError("");
                }}
                rightSlot={
                  <button
                    onClick={() => setShowPwd((p) => !p)}
                    style={{
                      position: "absolute",
                      right: "1.4rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-black-soft)",
                      fontSize: "1.5rem",
                      lineHeight: 1,
                    }}
                  >
                    {showPwd ? "🙈" : "👁"}
                  </button>
                }
              />
            </div>

            {/* Keep me signed in */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <input
                id="keepMe"
                type="checkbox"
                checked={keepMe}
                onChange={(e) => setKeepMe(e.target.checked)}
                style={{
                  width: "1.6rem",
                  height: "1.6rem",
                  cursor: "pointer",
                  accentColor: "var(--green-accent)",
                }}
              />
              <label
                htmlFor="keepMe"
                style={{
                  fontSize: "1.5rem",
                  color: "var(--text-black)",
                  cursor: "pointer",
                }}
              >
                Keep me signed in.{" "}
                <span
                  style={{
                    color: "var(--green-accent)",
                    fontWeight: 700,
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Details
                </span>
              </label>
            </div>

            {/* Forgot links */}
            <div
              style={{
                marginBottom: "3.2rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              {["Forgot your username?", "Forgot your password?"].map((t) => (
                <a
                  key={t}
                  href="#"
                  style={{
                    color: "var(--green-accent)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    textDecoration: "underline",
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  {t}
                </a>
              ))}
            </div>

            {/* Sign in button */}
            <div style={{ textAlign: "right" }}>
              <button
                onClick={handleSubmit}
                style={{
                  padding: "1.2rem 3.6rem",
                  borderRadius: "var(--btn-radius)",
                  background: "var(--green-house)",
                  color: "#fff",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  letterSpacing: "-0.01em",
                  transition: "transform 0.15s",
                }}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = "scale(0.95)")
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─── Reusable input with focus border ─────────────────── */
function InputField({ type, placeholder, value, onChange, rightSlot }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: rightSlot ? "1.4rem 4.8rem 1.4rem 1.6rem" : "1.4rem 1.6rem",
          border: `1px solid ${focused ? "var(--green-accent)" : "rgba(0,0,0,0.22)"}`,
          borderRadius: "0.8rem",
          fontSize: "1.6rem",
          fontFamily: "inherit",
          outline: "none",
          color: "var(--text-black)",
          letterSpacing: "-0.01em",
          transition: "border-color 0.2s",
        }}
      />
      {rightSlot}
    </div>
  );
}
