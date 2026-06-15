import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Vouchers from "./pages/Vouchers";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 1. Tạo một biến State để ghi nhớ trang trước đó bạn đứng
  const [fromPage, setFromPage] = useState("home");

  // Màn hình Login
  if (page === "login") {
    return (
      <Login
        onBack={() => setPage("home")}
        onLogin={(userData) => {
          setUser(userData);
          setPage("home");
        }}
      />
    );
  }
  if (page === "voucher") {
    return <Vouchers onBack={() => setPage("home")} />;
  }

  // Màn hình Chi tiết sản phẩm
  if (page === "detail" && selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={() => setPage(fromPage)} // 2. Quay về đúng trang đã được ghi nhớ
        onAddToCart={(product, qty) => {
          console.log(`Đã thêm ${qty} ${product.name} vào giỏ`);
        }}
      />
    );
  }

  // Màn hình Giỏ hàng
  if (page === "cart") {
    return (
      <Cart
        onBack={() => setPage("home")}
        onCheckout={(cartData) => {
          alert("Bắt đầu gọi API thanh toán!");
        }}
        onProductClick={(product) => {
          const formattedProduct = {
            id: product.idProduct,
            name: product.productName,
            price: product.price.toLocaleString("vi-VN") + "₫",
            emoji: product.imageUrl,
            bg: "linear-gradient(135deg,#e8e6e1,#dcd9d2)",
          };
          setSelectedProduct(formattedProduct);
          setFromPage("cart");
          setPage("detail");
        }}
      />
    );
  }

  // Màn hình Home (Mặc định)
  return (
    <Home
      user={user}
      onLoginClick={() => setPage("login")}
      onLogout={() => setUser(null)}
      onCartClick={() => setPage("cart")}
      onProductClick={(product) => {
        setSelectedProduct(product);
        setFromPage("home");
        setPage("detail");
      }}
      onVoucherClick={() => setPage("voucher")}
    />
  );
}
