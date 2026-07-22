import React, { useContext, useState } from "react";
import { NavLink, Link } from "react-router-dom";

import { assets } from "../assets/assets/assets";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const {
    setShowSearch,
    navigate,
    setUsertoken,
    usertoken,
    cartCount,
    language,
    changeLanguage,
    currencyType,
    changeCurrency,
    t,
  } = useContext(AppContext);

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = () => {
    closeMenu();

    if (window.innerWidth < 768) {
      navigate("/menu/search");
      return;
    }

    setShowSearch((prev) => !prev);
    navigate("/menu");
  };

  const handleNavigate = (path) => {
    navigate(path);
    closeMenu();
  };

  const logout = () => {
    localStorage.removeItem("usertoken");
    setUsertoken("");
    closeMenu();
    navigate("/login");
  };

  const handleIconMouseDown = (event) => {
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    setDragStart({
      x: clientX,
      y: clientY,
      offsetX: dragOffset.x,
      offsetY: dragOffset.y,
    });
    setIsDragging(false);
  };

  const handleIconMove = (event) => {
    if (!dragStart) return;
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      setIsDragging(true);
    }
    setDragOffset({
      x: dragStart.offsetX + deltaX,
      y: dragStart.offsetY + deltaY,
    });
  };

  const handleIconRelease = () => {
    setDragStart(null);
  };

  const handleIconClick = () => {
    if (!isDragging) {
      handleNavigate("/contact");
    }
  };

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <div className="relative border-b border-gray-500 bg-white">
      <div className="flex justify-between items-center h-[70px] px-4 sm:px-6 lg:px-20">
        <Link to="/" className="flex-shrink-0">
          <img className="w-24 sm:w-30" src="/logo2.png" alt="logo" />
        </Link>

        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? "text-amber-600"
                  : "text-gray-700 transition hover:text-amber-600"
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={handleSearch}
            className="hidden sm:flex items-center justify-center rounded-full p-2 transition hover:bg-amber-100"
            aria-label="Search"
          >
            <img className="w-5 sm:w-6" src={assets.search_icon} alt="search" />
          </button>

          <button
            type="button"
            onClick={() => handleNavigate("/cart")}
            className="relative flex items-center justify-center rounded-full p-2 transition hover:bg-amber-100"
            aria-label="Cart"
          >
            <img
              className="w-6 sm:w-7"
              src={assets.nav_cart_icon || assets.cart_icon}
              alt="cart"
            />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-semibold text-white">
              {cartCount || 0}
            </span>
          </button>

          <div className="group relative hidden sm:block">
            <img
              onClick={() => {
                if (!usertoken) {
                  handleNavigate("/login");
                } else {
                  setProfileDropdownOpen(!profileDropdownOpen);
                }
              }}
              className="w-8 cursor-pointer hover:opacity-75 transition"
              src={assets.profile_icon}
              alt="profile"
            />

            {usertoken && profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white border border-gray-200 shadow-xl z-50">
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                      activeTab === "orders"
                        ? "text-amber-600 border-b-2 border-amber-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {t("myOrders")}
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                      activeTab === "settings"
                        ? "text-amber-600 border-b-2 border-amber-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {t("settings")}
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-4">
                  {/* Orders Tab */}
                  {activeTab === "orders" && (
                    <button
                      onClick={() => {
                        handleNavigate("/orders");
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 rounded hover:bg-amber-100 text-gray-700 transition"
                    >
                      📋 {t("viewDetails")}
                    </button>
                  )}

                  {/* Settings Tab */}
                  {activeTab === "settings" && (
                    <div className="space-y-4">
                      {/* Language Setting */}
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                          {t("language")}
                        </p>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                            <input
                              type="radio"
                              name="language"
                              value="en"
                              checked={language === "en"}
                              onChange={() => changeLanguage("en")}
                              className="w-4 h-4 text-amber-600"
                            />
                            <span className="text-sm text-gray-700">
                              {t("english")}
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                            <input
                              type="radio"
                              name="language"
                              value="am"
                              checked={language === "am"}
                              onChange={() => changeLanguage("am")}
                              className="w-4 h-4 text-amber-600"
                            />
                            <span className="text-sm text-gray-700">
                              {t("amharic")}
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Currency Setting */}
                      <div className="border-t border-gray-200 pt-3">
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                          {t("currency")}
                        </p>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                            <input
                              type="radio"
                              name="currency"
                              value="USD"
                              checked={currencyType === "USD"}
                              onChange={() => changeCurrency("USD")}
                              className="w-4 h-4 text-amber-600"
                            />
                            <span className="text-sm text-gray-700">
                              {t("usd")}
                            </span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                            <input
                              type="radio"
                              name="currency"
                              value="ETB"
                              checked={currencyType === "ETB"}
                              onChange={() => changeCurrency("ETB")}
                              className="w-4 h-4 text-amber-600"
                            />
                            <span className="text-sm text-gray-700">
                              {t("etb")}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Logout Button */}
                <div className="border-t border-gray-200 p-4">
                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 rounded bg-red-50 text-red-600 hover:bg-red-100 transition font-medium text-sm"
                  >
                    🚪 {t("logout")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Close dropdown when clicking outside */}
          {profileDropdownOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setProfileDropdownOpen(false)}
            />
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center justify-center rounded-full p-2 transition hover:bg-amber-100 md:hidden"
            aria-label="Toggle menu"
          >
            <img className="w-6" src={assets.menu_icon} alt="menu" />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleIconClick}
        onMouseDown={handleIconMouseDown}
        onMouseMove={handleIconMove}
        onMouseUp={handleIconRelease}
        onMouseLeave={handleIconRelease}
        onTouchStart={handleIconMouseDown}
        onTouchMove={handleIconMove}
        onTouchEnd={handleIconRelease}
        className="fixed right-5 bottom-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl transition-transform duration-200 hover:scale-110 hover:bg-amber-50 focus:outline-none animate-bounce"
        aria-label="Call waiter"
        title="Call waiter"
        draggable="false"
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        <img
          className="h-10 w-10"
          src={assets.message_image}
          alt="Call waiter"
          draggable="false"
        />
      </button>

      {menuOpen && (
        <div className="absolute top-full left-0 right-0 z-50 bg-amber-50 shadow-lg md:hidden">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeMenu}
              className="block px-6 py-4 text-gray-800 transition hover:bg-amber-200"
            >
              {label}
            </NavLink>
          ))}

          <button
            onClick={handleSearch}
            className="w-full text-left px-6 py-4 transition hover:bg-amber-200"
          >
            Search
          </button>

          {usertoken ? (
            <>
              <button
                onClick={() => handleNavigate("/cart")}
                className="w-full text-left px-6 py-4 transition hover:bg-amber-200"
              >
                Cart ({cartCount || 0})
              </button>
              <button
                onClick={() => handleNavigate("/orders")}
                className="w-full text-left px-6 py-4 transition hover:bg-amber-200"
              >
                My Orders
              </button>

              {/* Mobile Settings Section */}
              <div className="border-t border-amber-200 px-6 py-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  {t("settings")}
                </p>

                {/* Language Options */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    {t("language")}
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="language"
                        value="en"
                        checked={language === "en"}
                        onChange={() => changeLanguage("en")}
                        className="w-4 h-4 text-amber-600"
                      />
                      <span className="text-sm text-gray-700">
                        {t("english")}
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="language"
                        value="am"
                        checked={language === "am"}
                        onChange={() => changeLanguage("am")}
                        className="w-4 h-4 text-amber-600"
                      />
                      <span className="text-sm text-gray-700">
                        {t("amharic")}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Currency Options */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    {t("currency")}
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="currency"
                        value="USD"
                        checked={currencyType === "USD"}
                        onChange={() => changeCurrency("USD")}
                        className="w-4 h-4 text-amber-600"
                      />
                      <span className="text-sm text-gray-700">{t("usd")}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="currency"
                        value="ETB"
                        checked={currencyType === "ETB"}
                        onChange={() => changeCurrency("ETB")}
                        className="w-4 h-4 text-amber-600"
                      />
                      <span className="text-sm text-gray-700">{t("etb")}</span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full text-left px-6 py-4 transition hover:bg-red-100 text-red-600 font-medium border-t border-amber-200"
              >
                🚪 {t("logout")}
              </button>
            </>
          ) : (
            <button
              onClick={() => handleNavigate("/login")}
              className="w-full text-left px-6 py-4 transition hover:bg-amber-200"
            >
              Login
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
