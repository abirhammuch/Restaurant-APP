import React from "react";
import { FaUtensils, FaLeaf, FaSmile, FaClock } from "react-icons/fa";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
            About Us
          </p>
          <h1 className="mt-4 text-4xl font-bold text-gray-900 sm:text-5xl">
            We Bring Delicious Local Taste to Your Table
          </h1>
          <p className="mt-6 text-gray-600 leading-8">
            Digital Menu is your friendly food discovery destination in
            Ethiopia. We curate fresh meals, fast delivery, and a simple
            ordering experience for every customer—from lunch breaks to family
            celebrations.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-amber-600">
                Mission
              </p>
              <p className="mt-3 text-gray-700">
                Make great food fast, local, and easy to order with a clean
                digital menu.
              </p>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.2em] text-amber-600">
                Vision
              </p>
              <p className="mt-3 text-gray-700">
                Be the most trusted food platform for customers and restaurants
                alike.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-amber-50 p-8 shadow-lg">
          <div className="grid gap-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                  <FaUtensils />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Fresh Choices
                  </p>
                  <p className="text-sm text-gray-600">
                    Handpicked dishes from top kitchens.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                  <FaLeaf />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Quality Ingredients
                  </p>
                  <p className="text-sm text-gray-600">
                    Fresh, seasonal, and locally sourced.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                  <FaSmile />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Happy Customers
                  </p>
                  <p className="text-sm text-gray-600">
                    Friendly service with fast delivery.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                  <FaClock />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Ready Fast
                  </p>
                  <p className="text-sm text-gray-600">
                    Order in seconds and enjoy quick service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 rounded-[2rem] bg-white p-10 shadow-xl">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-3">
            <p className="text-3xl font-bold text-gray-900">Our Story</p>
            <p className="text-gray-600 leading-7">
              Built for busy customers and restaurants, our platform makes
              ordering meals simple and enjoyable. We combine local flavors with
              an easy digital menu.
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
              What we do
            </p>
            <ul className="space-y-3 text-gray-700">
              <li>• Curate authentic food options from trusted vendors.</li>
              <li>• Offer secure ordering and flexible payment choices.</li>
              <li>• Deliver fast service across the city.</li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
              Why choose us
            </p>
            <ul className="space-y-3 text-gray-700">
              <li>• Easy-to-use digital menu experience.</li>
              <li>• English and Amharic support.</li>
              <li>• Local currency pricing with ETB and USD.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
