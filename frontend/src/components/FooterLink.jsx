import React from "react";
import { assets } from "../assets/assets/assets";
import { FaStar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";

const FooterLink = () => {
  return (
    <div className="grid grid-cols-[1fr_1fr]   md:grid-cols-[1fr_1fr_1fr_1fr] px-1 md:gap-20 mt-9 border-t bg-gray-100 border-gray-300 pt-9">
      {/* left  */}
      <div>
        <div className="flex justify-center">
          <img src={assets.logo} alt="" className="w-30 mb-4  items-center" />
        </div>

        <p className="text-sm px-3 mb-8">
          Elevating your dining experiance with seamless digital ordering and
          gourmet selection
        </p>
        <div className="flex  justify-around ">
          <p className="cursor-pointer text-sm">Facebook</p>
          <p className="cursor-pointer text-sm">Insta</p>
          <p className="cursor-pointer text-sm">Twiter</p>
        </div>
      </div>

      {/* mddle */}
      <div>
        <p className="text-md font-bold mb-3">Quicke Links</p>
        <p className="text-sm pb-2 cursor-pointer hover:text-amber-500">Home</p>
        <p className="text-sm pb-2 cursor-pointer hover:text-amber-500">Menu</p>
        <p className="text-sm pb-2 cursor-pointer hover:text-amber-500">Cart</p>
        <p className="text-sm pb-2 cursor-pointer hover:text-amber-500">
          Order Tracking
        </p>
      </div>

      {/* mddle */}

      <div>
        <p className="text-md font-bold mb-3">Contact Us</p>
        <div className="flex gap-4 items-center">
          <FaLocationDot className="text-amber-500" />
          <div className="pb-3">
            <p className="text-sm ">OUR LOCATION</p>
            <p className="text-sm">Bahir Dar , Tana</p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <FaClock className="text-amber-500" />
          <div className="pb-3">
            <p className="text-sm "> BUSSINESS HOURS</p>
            <p className="text-sm">Monday - Monday</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <FaStar className="text-amber-500 " />
          <div className="pb-3">
            <p className="text-sm ">CONTACT US</p>
            <p className="text-sm">+ 251-973-769-266</p>
          </div>
        </div>
      </div>

      {/* right */}
      <div>
        <p className="text-md font-bold mb-3">Newsletter</p>
        <p className="pb-6 text-md">Subscribe for exclusive offer and update</p>
        <form className="  px-2    ">
          <input
            type="email"
            placeholder="Email address"
            className="px-2 py-2"
          />
          
            <button
            type="submit"
            className="bg-amber-600 px-4 mt-4 rounded-sm text-white hover:bg-amber-700 cursor-pointer mb-9 py-2 sm:ml-3 ml-9"
          >
            Join
          </button>
          
        </form>
      </div>
     
    </div>
  );
};

export default FooterLink;
