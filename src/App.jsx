import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Vouchers from "./pages/Vouchers";
import Addresses from "./pages/Addresses";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import Register from "./pages/Register";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [fromPage, setFromPage] = useState("home");

  const [homeScroll, setHomeScroll] = useState(0);

  const [homeCategory, setHomeCategory] = useState("all");
  const [homeSearch, setHomeSearch] = useState("");
  const [homeAppliedSearch, setHomeAppliedSearch] = useState("");

  const navigateFromHome = (targetPage) => {
    setHomeScroll(window.scrollY); // Lưu lại vị trí đang đứng
    setPage(targetPage); // Chuyển trang
  };

  // Màn hình Login
  if (page === "login") {
    return (
      <Login
        onBack={() => setPage("home")}
        onGoToRegister={() => setPage("register")}
        onLogin={(payload) => {
          
          const name = payload.email.split("@")[0];
          const userData = { name, ...payload };

          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData)); 
          localStorage.setItem("token", payload.token); // Lưu Token

          setPage("home");
        }}
      />
    );
  }

  // Màn hình Register
  if (page === "register") {
    return (
      <Register
        onBack={() => setPage("home")}
        onGoToLogin={() => setPage("login")}
        onRegisterSuccess={(msg) => {
          alert(msg); 
          setPage("login");
        }}
      />
    );
  }

  // Màn hình voucher
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
          setPage("checkout");
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

  // Màn hình Địa chỉ
  if (page === "address") {
    return <Addresses onBack={() => setPage("home")} />;
  }

  // Màn hình Lịch sử Đơn hàng
  if (page === "order_history") {
    return <OrderHistory onBack={() => setPage("home")} />;
  }

  // Màn hình Thanh toán (Checkout)
  if (page === "checkout") {
    // cart data giả lập
    const checkoutCart = {
      totalPrice: 351000,
      items: [
        {
          idProduct: 99,
          productName: "Nước hoa nữ Blooming",
          imageUrl: "🌸",
          price: 351000,
          quantity: 1,
          subTotal: 351000,
          isAvailable: true,
        },
      ],
    };
    return (
      <Checkout
        cartData={checkoutCart}
        onBack={() => setPage("cart")}
        onOrderSuccess={(payload) => {
          alert("Đặt hàng thành công! Kiểm tra Console F12 để xem DTO");
          setPage("home");
        }}
      />
    );
  }

  // Màn hình Home (Mặc định)
  return (
    <Home
      user={user}
      savedScroll={homeScroll}
      selectedCat={homeCategory}
      setSelectedCat={setHomeCategory}
      searchQuery={homeSearch}
      setSearchQuery={setHomeSearch}
      appliedQuery={homeAppliedSearch}
      setAppliedQuery={setHomeAppliedSearch}
      onLoginClick={() => navigateFromHome("login")}
      onRegisterClick={() => navigateFromHome("register")}
      onLogout={() => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }}
      onCartClick={() => navigateFromHome("cart")}
      onProductClick={(product) => {
        setSelectedProduct(product);
        setFromPage("home");
        navigateFromHome("detail");
      }}
      onVoucherClick={() => navigateFromHome("voucher")}
      onAddressClick={() => navigateFromHome("address")}
      onOrderHistoryClick={() => navigateFromHome("order_history")}
    />
  );
}
