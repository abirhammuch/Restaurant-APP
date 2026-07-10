import React from "react";
import CustomerComent from "./CustomerComent";
import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Marshal A.",
    role: "Regular Diner",
    rating: 5,
    comment:
      "The Truffle Pizza was amazing, and the delivery was incredibly fast. Everything arrived fresh and beautifully packed.",
  },
  {
    name: "Dr. Surafel A.",
    role: "Food Enthusiast",
    rating: 5,
    comment:
      "The flavors were rich and balanced, and the whole experience felt premium from start to finish.",
  },
];

const Testimonial = () => {
  return (
    <div className="mx-4 mt-9 rounded-[32px] border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 px-4 py-8 shadow-sm sm:mx-6 lg:mx-10 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <p className="mb-4 inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-sm font-semibold text-amber-700">
            TESTIMONIALS
          </p>
          <h2 className="mb-4 text-3xl font-bold text-gray-800">
            What Our Happy Diners Say
          </h2>
          <p className="mb-6 text-sm leading-6 text-gray-600">
            Join thousands of satisfied customers who enjoy the best food in
            town delivered straight to their doorstep.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="rounded-2xl border border-amber-200 bg-white/80 px-4 py-3 shadow-sm">
              <p className="text-xl font-bold text-gray-800">12K+</p>
              <p className="text-sm text-gray-600">Orders Delivered</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-white/80 px-4 py-3 shadow-sm">
              <p className="text-xl font-bold text-gray-800">4.9/5</p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center gap-1">
                {Array(5)
                  .fill("")
                  .map((_, starIndex) => (
                    <FaStar
                      key={starIndex}
                      className={`text-sm ${starIndex < item.rating ? "text-amber-500" : "text-gray-300"}`}
                    />
                  ))}
              </div>

              <p className="mb-3 text-sm leading-6 text-gray-700">
                “{item.comment}”
              </p>
              <CustomerComent
                customername={item.name}
                rating={item.rating}
                comment={item.comment}
                role={item.role}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
