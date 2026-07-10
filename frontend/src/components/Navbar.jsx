import React, { useContext, useState } from "react";
import { NavLink, Link } from "react-router-dom";

import { assets } from "../assets/assets/assets";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { setShowSearch, navigate, setUsertoken, usertoken, cartCount } =
    useContext(AppContext);

  const closeMenu = () => setMenuOpen(false);

  const handleSearch = () => {
    setShowSearch((prev) => !prev);
    closeMenu();
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

  return (
    <div className="relative border-b border-gray-500">
      <div className="flex justify-between items-center h-[70px] px-5 md:px-20">
        <div>
          <Link to="/">
            <img className="w-30" src={assets.logo} alt="logo" />
          </Link>
        </div>

        <div className="hidden sm:flex gap-8">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/menu">Menu</NavLink>
          <NavLink to="/about">About Us</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
          <img
            onClick={() => setShowSearch((prev) => !prev)}
            className="w-6 hidden sm:block cursor-pointer"
            src={assets.search_icon}
            alt="search"
          />

          {usertoken && (
            <div className="relative">
              <img
                onClick={() => handleNavigate("/cart")}
                className="w-8 cursor-pointer"
                src={assets.cart_icon}
                alt="cart"
              />
              <div className="bg-amber-600 px-2 rounded-2xl absolute bottom-4 text-white left-5">
                {cartCount}
              </div>
            </div>
          )}

          <div className="group relative hidden sm:block">
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
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-3 w-26 bg-gray-200 rounded-sm z-50">
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

          <img
            onClick={() => setMenuOpen((prev) => !prev)}
            className="sm:hidden cursor-pointer w-7"
            src={assets.menu_icon}
            alt="menu"
          />
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 z-50 bg-amber-200 shadow-lg">
          <NavLink
            to="/"
            onClick={closeMenu}
            className="block px-9 py-4 hover:bg-amber-300"
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            onClick={closeMenu}
            className="block px-9 py-4 hover:bg-amber-300"
          >
            Menu
          </NavLink>
          <NavLink
            to="/about"
            onClick={closeMenu}
            className="block px-9 py-4 hover:bg-amber-300"
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            onClick={closeMenu}
            className="block px-9 py-4 hover:bg-amber-300"
          >
            Contact
          </NavLink>
          <button
            onClick={handleSearch}
            className="w-full text-left px-9 py-4 hover:bg-amber-300"
          >
            Search
          </button>

          {usertoken ? (
            <>
              <button
                onClick={() => handleNavigate("/cart")}
                className="w-full text-left px-9 py-4 hover:bg-amber-300"
              >
                Cart ({cartCount})
              </button>
              <button
                onClick={() => handleNavigate("/orders")}
                className="w-full text-left px-9 py-4 hover:bg-amber-300"
              >
                My Orders
              </button>
              <button
                onClick={logout}
                className="w-full text-left px-9 py-4 hover:bg-amber-300"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => handleNavigate("/login")}
              className="w-full text-left px-9 py-4 hover:bg-amber-300"
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
