import { useState, useEffect } from "react";

export default function BranchPopup({
  onClose,
  selectedBranch,
  onSelectBranch,
}) {
  // State API
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  // State giao diện
  const [hovered, setHovered] = useState(null);
  const [localSel, setLocalSel] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // KHAI BÁO BIẾN ĐÚNG 1 LẦN DUY NHẤT Ở ĐÂY
  const storedBranchId = localStorage.getItem("idBranch");
  const isFirstTime =
    !storedBranchId ||
    storedBranchId === "undefined" ||
    storedBranchId === "null";

  const toggleFav = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/branches");
        if (res.ok) {
          const data = await res.json();
          setBranches(data);

          if (!isFirstTime) {
            const found = data.find(
              (b) => b.idBranch === parseInt(storedBranchId),
            );
            if (found) {
              setLocalSel(found);
              onSelectBranch(found);
            }
          } else if (data.length > 0) {
            // Lần đầu vào thì chỉ bôi xanh cái đầu tiên, BẮT BUỘC KHÁCH TỰ BẤM NÚT
            setLocalSel(data[0]);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách chi nhánh:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOrder = () => {
    if (localSel) {
      localStorage.setItem("idBranch", localSel.idBranch);
      localStorage.setItem("branchName", localSel.name);
      onSelectBranch(localSel);
      onClose(); // Lưu xong mới cho đóng popup
    }
  };

  return (
    /* Backdrop nền mờ - Nếu là lần đầu thì khóa không cho bấm ra ngoài tắt */
    <div
      onClick={isFirstTime ? undefined : onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "10rem",
      }}
    >
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
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        {/* ── LEFT: Danh sách chi nhánh ── */}
        <div
          style={{
            width: "44%",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
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

          <div style={{ overflowY: "auto", flex: 1 }}>
            {loading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 0",
                  fontSize: "1.6rem",
                  fontWeight: 600,
                }}
              >
                Đang tải hệ thống cửa hàng...
              </div>
            ) : branches.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 0",
                  fontSize: "1.6rem",
                  color: "var(--text-black-soft)",
                }}
              >
                Hệ thống đang bảo trì.
              </div>
            ) : (
              branches.map((branch) => {
                const isSel = localSel?.idBranch === branch.idBranch;
                const isHovered = hovered === branch.idBranch;

                return (
                  <div
                    key={branch.idBranch}
                    onClick={() => setLocalSel(branch)}
                    onMouseEnter={() => setHovered(branch.idBranch)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      padding: "1.6rem 2.4rem",
                      background: isSel
                        ? "#f5fbf7"
                        : isHovered
                          ? "#f5f5f4"
                          : "#fff",
                      borderBottom: "1px solid rgba(0,0,0,0.07)",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "1rem",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            color: isSel
                              ? "var(--green-accent)"
                              : "var(--text-black)",
                            marginBottom: "0.35rem",
                          }}
                        >
                          eMarket {branch.name}
                        </p>
                        <p
                          style={{
                            fontSize: "1.25rem",
                            color: "var(--text-black-soft)",
                            marginBottom: "0.2rem",
                            lineHeight: 1.4,
                          }}
                        >
                          Phường {branch.ward}, Quận {branch.district},{" "}
                          {branch.city}
                        </p>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "0.4rem",
                          flexShrink: 0,
                          paddingTop: "0.2rem",
                        }}
                      >
                        <button
                          onClick={(e) => toggleFav(branch.idBranch, e)}
                          style={{
                            padding: "0.4rem",
                            borderRadius: "50%",
                            color: favorites.includes(branch.idBranch)
                              ? "#e05060"
                              : "rgba(0,0,0,0.35)",
                            fontSize: "1.55rem",
                            transition: "color 0.2s",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          {favorites.includes(branch.idBranch) ? "♥" : "♡"}
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
              })
            )}
          </div>
        </div>

        {/* ── RIGHT: Bản đồ tĩnh (Iframe) ── */}
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

          {/* Nút Tắt × - CHỈ HIỆN KHI ĐÃ CÓ CHI NHÁNH TỪ TRƯỚC */}
          {!isFirstTime && (
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
                transition: "transform 0.1s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
