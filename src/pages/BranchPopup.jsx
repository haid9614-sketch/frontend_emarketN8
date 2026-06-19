import { useState } from "react";

/* ─── Mock data ─── */
const BRANCHES = [
  {
    id: 1,
    name: "Bà Triệu",
    address: "314 Bà Triệu, Quận Hai Bà Trưng, Hà Nội",
  },
  { id: 2, name: "6A Quang Trung", address: "6A Quang Trung, Hà Nội" },
  { id: 3, name: "Bưu điện Hà Nội", address: "Số 6 Đinh Lê, Hà Nội" },
  {
    id: 4,
    name: "Pacific Place HN",
    address: "R105, 83B Lý Thường Kiệt, Hoàn Kiếm, Hà Nội",
  },
  {
    id: 5,
    name: "Vinmec Times City",
    address: "Bệnh viện Vinmec, Times City, Hà Nội",
  },
  { id: 6, name: "Giải Phóng", address: "56 Giải Phóng, Đống Đa, Hà Nội" },
  { id: 7, name: "Royal City", address: "72A Nguyễn Trãi, Thanh Xuân, Hà Nội" },
  { id: 8, name: "Mipec Tower", address: "229 Tây Sơn, Đống Đa, Hà Nội" },
];

/* ─── Component ─────────────────────────────────────────── */
export default function BranchPopup({
  onClose,
  selectedBranch,
  onSelectBranch,
}) {
  const [hovered, setHovered] = useState(null);
  const [localSel, setLocalSel] = useState(selectedBranch);
  const [favorites, setFavorites] = useState([]);

  const toggleFav = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const handleOrder = () => {
    if (localSel) onSelectBranch(localSel);
  };

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "10rem",
      }}
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "92%",
          maxWidth: "1140px",
          background: "#fff",
          borderRadius: "1.4rem",
          overflow: "hidden",
          display: "flex",
          maxHeight: "74vh",
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        }}
      >
        {/* ── LEFT: branch list ── */}
        <div
          style={{
            width: "44%",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {/* Green header */}
          <div
            style={{
              background: "var(--green-house)",
              padding: "1.8rem 2.4rem",
              flexShrink: 0,
            }}
          >
            <p
              style={{
                color: "#fff",
                fontSize: "1.55rem",
                fontWeight: 600,
                lineHeight: 1.55,
              }}
            >
              Bạn vui lòng chọn chi nhánh gần nhất để eMarket phục vụ bạn tốt
              nhất nhé
            </p>
          </div>

          {/* Scrollable list */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {BRANCHES.map((branch) => {
              const isSel = localSel?.id === branch.id;
              const isHovered = hovered === branch.id;

              return (
                <div
                  key={branch.id}
                  onClick={() => setLocalSel(branch)}
                  onMouseEnter={() => setHovered(branch.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    padding: "1.6rem 2.4rem",
                    background: isSel
                      ? "var(--green-light)"
                      : isHovered
                        ? "#f5f5f4"
                        : "#fff",
                    borderBottom: "1px solid rgba(0,0,0,0.07)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  {/* Row: info + icons */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    {/* Thông tin Chi nhánh */}
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          color: "var(--text-black)",
                          marginBottom: "0.35rem",
                        }}
                      >
                        {branch.name}
                      </p>
                      <p
                        style={{
                          fontSize: "1.25rem",
                          color: "var(--text-black-soft)",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {branch.address}
                      </p>
                    </div>

                    {/* Heart + Info icons */}
                    <div
                      style={{
                        display: "flex",
                        gap: "0.4rem",
                        flexShrink: 0,
                        paddingTop: "0.2rem",
                      }}
                    >
                      <button
                        onClick={(e) => toggleFav(branch.id, e)}
                        style={{
                          padding: "0.4rem",
                          borderRadius: "50%",
                          color: favorites.includes(branch.id)
                            ? "#e05060"
                            : "rgba(0,0,0,0.35)",
                          fontSize: "1.55rem",
                          transition: "color 0.2s",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {favorites.includes(branch.id) ? "♥" : "♡"}
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          padding: "0.4rem",
                          borderRadius: "50%",
                          color: "rgba(0,0,0,0.35)",
                          fontSize: "1.4rem",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        ⓘ
                      </button>
                    </div>
                  </div>

                  {/* "Order here" button — only on selected */}
                  {isSel && (
                    <button
                      onClick={handleOrder}
                      style={{
                        marginTop: "1.2rem",
                        padding: "0.75rem 2rem",
                        borderRadius: "var(--btn-radius)",
                        background: "var(--green-accent)",
                        color: "#fff",
                        fontSize: "1.4rem",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "transform 0.15s",
                      }}
                      onMouseDown={(e) =>
                        (e.currentTarget.style.transform = "scale(0.95)")
                      }
                      onMouseUp={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    >
                      Đặt hàng tại đây
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: static map iframe ── */}
        <div
          style={{
            flex: 1,
            position: "relative",
            background: "#e8e4dc",
            minHeight: "400px",
          }}
        >
          <iframe
            title="Bản đồ chi nhánh"
            src="https://www.openstreetmap.org/export/embed.html?bbox=105.79%2C20.99%2C105.90%2C21.06&layer=mapnik"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
          {/* Close × */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "1.2rem",
              right: "1.2rem",
              width: "3.2rem",
              height: "3.2rem",
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              fontSize: "1.8rem",
              fontWeight: 700,
              color: "var(--text-black)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              border: "none",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
