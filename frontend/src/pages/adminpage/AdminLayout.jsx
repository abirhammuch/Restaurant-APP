import React, { useState, useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaUser, FaQrcode, FaStar, FaComments } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import {
  MdDashboard,
  MdRestaurantMenu,
  MdAddShoppingCart,
  MdSettings,
  MdQrCode,
} from "react-icons/md";
import { AppContext } from "../../context/AppContext";

const AdminLayout = () => {
  const { navigate, unreadChatCount } = useContext(AppContext);

  const [menuOpen, setMenuOpen] = useState(false);

  const logout = async () => {
    localStorage.removeItem("admintoken");
    navigate("/admin/login");
  };

  const openMenu = () => {
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMenuOpen(false);
  };

  const getNavClass = ({ isActive }) =>
    `flex gap-3 items-center px-3 py-2 rounded-2xl transition-colors ${
      isActive
        ? "bg-amber-500 text-white"
        : "hover:bg-amber-500 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={closeMenu}
        />
      )}

      <div
        className={`grid ${menuOpen ? "lg:grid-cols-[280px_1fr]" : "lg:grid-cols-[88px_1fr]"} grid-cols-1 mt-0 lg:mt-7`}
      >
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 flex flex-col justify-between overflow-y-auto px-4 py-6 shadow-2xl border-r border-gray-300 bg-gray-100 gap-6 transition-all duration-300 lg:static lg:min-h-screen lg:ml-9 lg:py-9 lg:border-b-0 ${
            menuOpen
              ? "w-70 max-w-[85vw] translate-x-0"
              : "w-[72px] max-w-[85vw] -translate-x-full lg:w-[88px] lg:translate-x-0"
          }`}
        >
          <div>
            <div
              className={`flex ${menuOpen ? "justify-between" : "justify-center"} items-center`}
            >
              {menuOpen && (
                <img
                  src="/logo2.png"
                  onClick={() => navigate("/")}
                  className="cursor-pointer w-25 sm:w-32"
                />
              )}
              {menuOpen ? (
                <IoClose
                  size={30}
                  onClick={closeMenu}
                  className="cursor-pointer"
                />
              ) : (
                <HiMenu
                  onClick={openMenu}
                  size={30}
                  className="cursor-pointer"
                />
              )}
            </div>

            <div className="mt-5 flex flex-col gap-6">
              {/* Dashboard */}
              <div className="admin cursor-pointer">
                <NavLink
                  to="/admin/dashboard"
                  onClick={handleNavClick}
                  className={getNavClass}
                >
                  <MdDashboard />
                  {menuOpen && <p className="text-lg">Dashboard</p>}
                </NavLink>
              </div>

              {/* Products */}
              <div className="admin cursor-pointer">
                <NavLink
                  to="/admin/products"
                  onClick={handleNavClick}
                  className={getNavClass}
                >
                  <MdRestaurantMenu />
                  {menuOpen && <p className="text-lg">Products</p>}
                </NavLink>
              </div>

              {/* Categories */}
              <div className="admin cursor-pointer">
                <NavLink
                  to="/admin/categories"
                  onClick={handleNavClick}
                  className={getNavClass}
                >
                  <MdRestaurantMenu />
                  {menuOpen && <p className="text-lg">Categories</p>}
                </NavLink>
              </div>

              {/* Orders */}
              <div className="admin cursor-pointer">
                <NavLink
                  to="/admin/totalorders"
                  onClick={handleNavClick}
                  className={getNavClass}
                >
                  <MdAddShoppingCart />
                  {menuOpen && <p className="text-lg">Orders</p>}
                </NavLink>
              </div>

              {/* ✅ Ratings - NEW */}
              <div className="admin cursor-pointer">
                <NavLink
                  to="/admin/ratings"
                  onClick={handleNavClick}
                  className={getNavClass}
                >
                  <FaStar className="text-lg" />
                  {menuOpen && <p className="text-lg">Ratings</p>}
                </NavLink>
              </div>

              {/* QR Codes */}
              <div className="admin cursor-pointer">
                <NavLink
                  to="/admin/qrcodes"
                  onClick={handleNavClick}
                  className={getNavClass}
                >
                  <MdQrCode />
                  {menuOpen && <p className="text-lg">QR Codes</p>}
                </NavLink>
              </div>

              {/* Chat Requests */}
              <div className="admin cursor-pointer">
                <NavLink
                  to="/admin/chat"
                  onClick={handleNavClick}
                  className={getNavClass}
                >
                  <div className="relative inline-flex items-center gap-3">
                    <FaComments className="text-lg" />
                    {menuOpen && <p className="text-lg">Chat</p>}
                    {unreadChatCount > 0 && (
                      <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                        {unreadChatCount}
                      </span>
                    )}
                  </div>
                </NavLink>
              </div>

              {/* Settings */}
              <div className="admin cursor-pointer">
                <NavLink
                  to="/admin/settings"
                  onClick={handleNavClick}
                  className={getNavClass}
                >
                  <MdSettings />
                  {menuOpen && <p className="text-lg">Settings</p>}
                </NavLink>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="pb-16 flex flex-col gap-2 border-t w-full items-center border-gray-300 pt-2">
            <p className="text-md font-bold">SUPPORT</p>
            <p className="text-md font-bold text-orange-600">Help Center</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-start-2">
          {/* Header */}
          <div className="flex flex-col sm:flex-row w-full justify-between px-4 sm:px-6 lg:px-9 mt-4 sm:mt-7 border-b border-gray-400 items-start sm:items-center pb-4 gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={menuOpen ? closeMenu : openMenu}
                className="flex items-center justify-center rounded-full p-2 text-orange-600 hover:bg-orange-100 lg:hidden"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                {menuOpen ? <IoClose size={24} /> : <HiMenu size={24} />}
              </button>
              <p className="text-xl sm:text-2xl text-orange-700">Dashboard</p>
            </div>
            <div className="flex gap-3 sm:gap-5 items-center ml-auto">
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-2xl border border-gray-500 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 sm:px-4 sm:text-base"
              >
                <FaUser className="text-orange-500" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Outlet */}
          <div className="p-4 sm:p-6 lg:p-9">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 flex justify-center items-center py-5 border-t border-gray-200">
        <p>&copy;2026 Greencart management. All rights are reserved.</p>
      </div>
    </div>
  );
};

export default AdminLayout;
