// App.jsx
import { useContext, useEffect } from "react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import SkeletonLoader from "./components/SkeletonLoader";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MenuPage from "./pages/MenuPage";
import CategoryPage from "./pages/CategoryPage";
import FooterLink from "./components/FooterLink";
import Policy from "./components/Policy";
import SearchFood from "./pages/SearchFood";
import FoodDetail from "./pages/FoodDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import OrderDetail from "./pages/OrderDetail";
import PaymentStatus from "./pages/PaymentStatus";
import TelebirrPayment from "./pages/TelebirrPayment";
import Login from "./pages/Login";
import { AppContext } from "./context/AppContext";
import AdminLogin from "./pages/adminpage/AdminLogin";
import AdminLayout from "./pages/adminpage/AdminLayout";
import Orders from "./pages/adminpage/TotalOrders";
import Products from "./pages/adminpage/Products";
import Qrcodes from "./pages/adminpage/Qrcodes";
import Settings from "./pages/adminpage/Settings";
import Dashboard from "./pages/adminpage/Dashboard";
import Category from "./pages/adminpage/Category";
import PromoManagement from "./pages/adminpage/PromoManagement";
import Order from "./pages/Order";
import AdminRatings from "./pages/adminpage/AdminRatings";
import AdminChat from "./pages/adminpage/AdminChat";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import Kitchen from "./pages/adminpage/Kitchen";
import KitchenLogin from "./pages/adminpage/KitchenLogin";
import KitchenReviews from "./pages/adminpage/KitchenReviews";
import KitchenDashboard from "./pages/adminpage/KitchenDashboard";
import KitchenMenu from "./pages/adminpage/KitchenMenu";

const App = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.includes("admin");
  const isKitchenPath = location.pathname.startsWith("/kitchen");
  const { isAdmin, appLoading, dataLoading } = useContext(AppContext);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search, location.hash]);

  // ✅ Show skeleton loading while auth check or initial data load is in progress
  if (appLoading || dataLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div>
      <ToastContainer />

      {/* Show Navbar only on non-admin routes */}
      {!isAdminPath && !isKitchenPath && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route path="/payment-status" element={<PaymentStatus />} />
          <Route
            path="/telebirr-payment/:orderId"
            element={<TelebirrPayment />}
          />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:category" element={<CategoryPage />} />
          <Route path="/menu/search" element={<SearchFood />} />
          <Route path="/menu/:category/:id" element={<FoodDetail />} />

          {/* Admin Login - Separate Route */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/kitchen/login" element={<KitchenLogin />} />

          <Route
            path="/kitchen"
            element={
              localStorage.getItem("kitchentoken") ? (
                <Kitchen />
              ) : (
                <Navigate to="/kitchen/login" replace />
              )
            }
          />
          <Route
            path="/kitchen/dashboard"
            element={
              localStorage.getItem("kitchentoken") ? (
                <KitchenDashboard />
              ) : (
                <Navigate to="/kitchen/login" replace />
              )
            }
          />
          <Route
            path="/kitchen/reviews"
            element={
              localStorage.getItem("kitchentoken") ? (
                <KitchenReviews />
              ) : (
                <Navigate to="/kitchen/login" replace />
              )
            }
          />
          <Route
            path="/kitchen/menu"
            element={
              localStorage.getItem("kitchentoken") ? (
                <KitchenMenu />
              ) : (
                <Navigate to="/kitchen/login" replace />
              )
            }
          />

          {/* ✅ Admin Routes - Protected with Navigate */}
          <Route
            path="/admin"
            element={
              isAdmin ? <AdminLayout /> : <Navigate to="/admin/login" replace />
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Category />} />
            <Route path="promotions" element={<PromoManagement />} />
            <Route path="totalorders" element={<Orders />} />
            <Route path="qrcodes" element={<Qrcodes />} />
            <Route path="settings" element={<Settings />} />
            <Route path="ratings" element={<AdminRatings />} />
            <Route path="chat" element={<AdminChat />} />
          </Route>
        </Routes>
      </AnimatePresence>

      {/* Show Footer only on non-admin routes */}
      {!isAdminPath && (
        <>
          <FooterLink />
          <Policy />
        </>
      )}
    </div>
  );
};

export default App;
