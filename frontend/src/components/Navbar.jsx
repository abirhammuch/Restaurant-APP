import React, { useContext, useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

import { assets } from "../assets/assets/assets";
import { AppContext } from "../context/AppContext";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const {
    setShowSearch,
    navigate,
    showSearch,
    setUsertoken,
    setCartItems,
    usertoken,
  } = useContext(AppContext);

  const search = () => {
    navigate("/menu");
    setMenuOpen((prev) => !prev);
    setShowSearch((prev) => !prev);
  };
  const logout = () => {
    localStorage.removeItem("usertoken");
    setUsertoken("");
    // setCartItems({})
    navigate("/login");
  };

  return (
    <div className="flex  justify-between items-center  h-[70px] border-b border-gray-500 px-5 md:px-20">
      <div>
        <Link to="/">
          <img className="w-30" src={assets.logo} />
        </Link>
      </div>

      <div className=" hidden sm:flex  gap-8 ">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/menu">Menu</NavLink>
        <NavLink to="/about">About Us</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </div>
      <div className="flex gap-8 ">
        <img
          onClick={() => setShowSearch((prev) => !prev)}
          className="w-6 hidden sm:block cursor-pointer"
          src={assets.search_icon}
          alt=""
        />
        <div className="relative ">
          <img
            onClick={() => navigate("/cart")}
            className="w-8 cursor-pointer"
            src={assets.cart_icon}
            alt=""
          />
          <div className="bg-amber-600 px-2 rounded-2xl absolute bottom-4 text-white left-5">
            4
          </div>
        </div>

        <div className="group relative">
          <img
            onClick={usertoken ? '' : () => navigate("/login")}
            className="w-8 hidden sm:block cursor-pointer"
            src={assets.profile_icon}
            alt=""
          />

          {usertoken && (
            <div className=" group-hover:block hidden absolute dropdown-menu right-0 pt-3 w-26 bg-gray-200  rounded-sm z-100">
              <p
                onClick={() => navigate("/orders")}
                className="cursor-pointer  px-2 py-1 hover:bg-gray-300"
              >
                My Orders
              </p>
              <p
                onClick={logout}
                className="cursor-pointer  px-2 py-1 hover:bg-gray-300 "
              >
                Logout
              </p>
            </div>
          )}
        </div>
        <img
          onClick={() => setMenuOpen((prev) => !prev)}
          className="sm:hidden cursor-pointer"
          src={assets.menu_icon}
        />
      </div>

      {/*mobile view  */}

      {menuOpen && (
        <div className="flex flex-col   sm:hidden absolute top-18 right-0 left-0 z-10 bg-amber-200">
          <NavLink
            to="/"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="px-9 hover:bg-amber-200 py-4"
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="px-9 hover:bg-amber-200 py-4"
          >
            Menu
          </NavLink>

          <p onClick={() => search()} className="px-8 cursor-pointer">
            Search
          </p>
          <button className="flex justify-start px-9 hover:bg-amber-200 py-4">
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
