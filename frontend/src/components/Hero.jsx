import React, { useContext } from "react";
import { assets } from "../assets/assets/assets";
import Search from "./Search";
import OrderNow from "./OrderNow";
import { AppContext } from "../context/AppContext";

const Hero = () => {
  const {navigate} = useContext(AppContext)
  return (
    <div>
      <div className="relative">
        <img
          src={assets.desktop_banner}
          alt=" "
          className=" w-full hidden md:block"
        />
        <img
          src={assets.mobile_banner}
          alt=" "
          className="w-full md:hidden"
        />

        <div className="absolute top-12 lg:top-30 left-10 right-30 ">
          <div className="flex justify-center flex-col items-center gap-3 ">
            <p className="text-5xl font-bold text-white mb-4">
              Gourmet Dining,<br/> <span className="text-amber-600 ">Delivered </span> to You.
            </p>
            <p className="flex justify-center text-center  items-center max-w-[450px] text-white font-bold ">
              Savor handcrafted dishs from the finest local chsfs. Fresh
              ingredient, bold flavors, and seamless ordering
            </p>
          </div>

          <div>
            <Search   />
            <div onClick={() => navigate('/menu')}
             className="sm:hidden mt-30  cursor-pointer">
              <OrderNow />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
