import { useState } from "react";
import SalesLogin from "./SalesLogin";
import SalesHome from "./SalesHome";
import SalesOrderDetail from "./SalesOrderDetail";

export default function AppSales() {
  
  const [salesUser, setSalesUser] = useState(() => {
    const savedInfo = localStorage.getItem("salesInfo");
    return savedInfo ? JSON.parse(savedInfo) : null;
  });

  const [currentView, setCurrentView] = useState(() => {
    const savedInfo = localStorage.getItem("salesInfo");
  
    return savedInfo ? "home" : "login";
  });

 
  const [selectedOrder, setSelectedOrder] = useState(null);


  const handleLoginSuccess = (data) => {
    setSalesUser(data);
    setCurrentView("home");
  };

  const handleLogout = () => {
  
    localStorage.removeItem("salesToken");
    localStorage.removeItem("salesInfo");
    sessionStorage.removeItem("salesActiveTab");

    setSalesUser(null);
    setCurrentView("login");
  };

  const handleManageOrder = (order) => {
    setSelectedOrder(order);
    setCurrentView("detail");
  };

  const handleBackToHome = () => {
    setSelectedOrder(null);
    setCurrentView("home");
  };

  // 3. RENDER CONDITIONAL 
  return (
    <div style={{ fontFamily: "inherit" }}>
      {/* MÀN HÌNH ĐĂNG NHẬP */}
      {currentView === "login" && (
        <SalesLogin onLoginSuccess={handleLoginSuccess} />
      )}

      {/* MÀN HÌNH TRANG CHỦ QUẢN LÝ QUẦY */}
      {currentView === "home" && salesUser && (
        <SalesHome onManageOrder={handleManageOrder} onLogout={handleLogout} />
      )}

      {/*  MÀN HÌNH CHI TIẾT VÀ XỬ LÝ ĐƠN HÀNG */}
      {currentView === "detail" && selectedOrder && (
        <SalesOrderDetail order={selectedOrder} onBack={handleBackToHome} />
      )}
    </div>
  );
}
