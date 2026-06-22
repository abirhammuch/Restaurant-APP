import React from "react";
import { assets } from "../assets/assets/assets";
import CustomerComent from "./CustomerComent";
import { FaStar } from "react-icons/fa";

const Testimonial = () => {
  return (
    <div className="sm:flex items-center gap-5  py-5  justify-between px-10 mx-10 mt-9 bg-amber-40">
      <div className=" flex flex-col max-w-70">
        <p className="text-amber-700 text-md bg-amber-400 max-w-40 text-center rounded-2xl mb-4">TESTIMONIALS</p>
        <p className="text-3xl font-bold  mb-4">What Our Happy Diners Say</p>
        <p className="text-sm text-gray-700 mb-4">
          Join thousands of satisffied customers who enjoy the best food in
          towen delivered strait to their doorstep.
        </p>
        <div className="flex gap-5">
          <div>
            <p>12K+</p>
            <p className="text-sm text-gray-700">Orders Delivered</p>
          </div>
          <div className="border-l px-4 border-gray-400">
            <p>4.9/5</p>
            <p className="text-sm text-gray-700">Average Rating</p>
          </div>
        </div>
      </div>

      {/* middle sectiion */}
      <div className="max-w-70">
        {/* star */}
         <div className='flex items-center gap-0.5 mb-8'>
            {Array(5).fill('').map((_, i)=>(
                <img key={i} className='md:w-3.5 w-3' src={i < 5? assets.star_icon : assets.star_dull_icon} alt=''  />
            ))}
            
        </div>

        <p className="text-sm  text-gray-700 mb-15 ">The Trufflo Pizza is actualy life changing , fast delivery and the packaging was super sleek! </p>
        <CustomerComent customername={'Marshal A.'} text={"Regular Diner"} rate={3} comment={'awesome food!'}  />
      </div>

      {/* right side */}
      <div className="max-w-70">
        
            {/* star */}
         <div className='flex items-center gap-0.5 mb-6'>
            {Array(5).fill('').map((_, i)=>(
                <img key={i} className='md:w-3.5 w-3' src={i < 5? assets.star_icon : assets.star_dull_icon} alt=''  />
            ))}
            
        </div>
                  <p className="text-sm  text-gray-700 mb-15">The Trufflo Pizza is actualy life changing , fast delivery and the packaging was super sleek! </p>
        <CustomerComent customername={'Dr. Surafel A.'} text={"Regular Diner"} rate={5} comment={'Nice food!'}  />

      </div>
    </div>
  );
};

export default Testimonial;
