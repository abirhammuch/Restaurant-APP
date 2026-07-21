import React, { useContext, useState } from "react";
import { NavLink, Link } from "react-router-dom";

import { assets } from "../assets/assets/assets";
import { AppContext } from "../context/AppContext";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { setShowSearch, navigate, setUsertoken, usertoken, cartCount } =
    useContext(AppContext);

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
          <img className="w-24 sm:w-30" src={assets.logo} alt="logo" />
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

          <LanguageSwitcher />
            <img
              onClick={() => {
                if (!usertoken) {
                  handleNavigate("/login");
                }
              }}
              className="w-8 cursor-pointer"
              src={assets.profile_icon}
              alt="profile"
            />

            {usertoken && (
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-3 w-28 rounded-sm bg-gray-200 z-50">
                <p
                  onClick={() => handleNavigate("/orders")}
                  className="cursor-pointer px-2 py-1 hover:bg-gray-300"
                >
                  My Orders
                </p>
                <p
                  onClick={logout}
                  className="cursor-pointer px-2 py-1 hover:bg-gray-300"
                >
                  Logout
                </p>
              </div>
            )}
          </div>

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
              <button
                onClick={logout}
                className="w-full text-left px-6 py-4 transition hover:bg-amber-200"
              >
                Logout
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
