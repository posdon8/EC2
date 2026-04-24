import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "./store/useStore";
import { Navbar } from "./components/Navbar";
import { CartSidebar } from "./components/CartSidebar";
import { Welcome } from "./pages/Welcome";
import { Home } from "./pages/Home";
import { Explore } from "./pages/Explore";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ProductDetail } from "./pages/ProductDetail";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Orders } from "./pages/Orders";
import { AdminDashboard } from "./pages/AdminDashboard";
import "./index.css";

function App() {
  const { setUser, getCart, isLoggedIn } = useStore();

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        getCart();
      } catch (error) {
        console.error("Failed to restore user:", error);
      }
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <CartSidebar />

        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
