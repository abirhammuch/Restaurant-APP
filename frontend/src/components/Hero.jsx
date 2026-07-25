import React, { useContext } from "react";
import { FaStar } from "react-icons/fa";
import { MdRestaurantMenu } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";

import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets/assets";
import Search from "./Search";

const Hero = () => {
  const { navigate } = useContext(AppContext);

  return (
    <section className="relative isolate overflow-hidden min-h-screen">
      {/* Background */}
      <img
        src={assets.desktop_banner}
        alt="Restaurant interior with premium dining ambiance"
        className="hidden md:block w-full h-[90vh] sm:h-[92vh] object-cover"
      />

      <img
        src={assets.mobile_banner}
        alt="Restaurant interior with premium dining ambiance"
        className="md:hidden w-full h-screen object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/40"></div>

      {/* Decorative Blur */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-red-500/20 rounded-full blur-[120px]"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center py-20 sm:py-24">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid lg:grid-cols-2 items-center gap-12">
            {/* LEFT */}
            <div className="text-white z-20">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-5 py-2 mb-6">
                <FaStar className="text-amber-500" />

                <span className="text-sm">Premium Restaurant</span>
              </div>

              {/* Heading */}

              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                Fresh Burgers.
                <br />
                Premium
                <span className="text-amber-500"> Coffee,</span>
                <br />
                ግሩም
                <span className="text-amber-500"> ጣዕም</span>
              </h1>

              <p className="mt-6 text-gray-300 text-lg max-w-xl leading-8">
                Discover handcrafted burgers, freshly brewed Ethiopian coffee,
                and delicious meals prepared with premium ingredients.
              </p>

              {/* Search */}

              {/* <div className="mt-10">
                <div>
                  <Search />
                </div>
              </div> */}

              {/* Buttons */}

              <div className="flex flex-wrap gap-5 mt-10">
                <button
                  onClick={() => navigate("/menu")}
                  className="bg-amber-600 hover:bg-amber-700 duration-300 px-8 py-4 rounded-full font-semibold shadow-xl"
                >
                  Explore Menu
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  className="bg-amber-600 hover:bg-amber-700 duration-300 px-8 py-4 rounded-full font-semibold shadow-xl"
                >
                  Order Now
                </button>
              </div>

              {/* Statistics */}

              <div className="grid grid-cols-3 gap-8 mt-30 ">
                <div>
                  <h2 className="text-3xl font-bold text-amber-500">4.9★</h2>

                  <p className="text-gray-300 text-sm">Customer Rating</p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-amber-500">80+</h2>

                  <p className="text-gray-300 text-sm">Signature Dishes</p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-amber-500">15m</h2>

                  <p className="text-gray-300 text-sm">Fast Delivery</p>
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <div className="relative hidden lg:flex justify-center items-center min-h-[520px]">
              {/* Burger */}

              {/* Coffee /}

            

              {/* Floating Cards */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
