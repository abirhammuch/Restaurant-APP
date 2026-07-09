// App.jsx
import React, { useContext, useState, useEffect } from "react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
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
import Order from "./pages/Order";
import AdminRatings from "./pages/adminpage/AdminRatings";

const App = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.includes("admin");
  const { userLogin, isAdmin, appLoading } = useContext(AppContext);

  // ✅ Show loading spinner while checking admin status
  if (appLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />

      {/* Show Navbar only on non-admin routes */}
      {!isAdminPath && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/menu/:category" element={<CategoryPage />} />
        <Route path="/menu/search" element={<SearchFood />} />
        <Route path="/menu/:category/:id" element={<FoodDetail />} />

        {/* Admin Login - Separate Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

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
          <Route path="totalorders" element={<Orders />} />
          <Route path="qrcodes" element={<Qrcodes />} />
          <Route path="settings" element={<Settings />} />
          <Route path="ratings" element={<AdminRatings />} />
        </Route>
      </Routes>

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
