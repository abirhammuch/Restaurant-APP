
import React from 'react'
import { FaStar } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { FaClock } from 'react-icons/fa'
const ContactInfo = () => {
  return (
    <div className='flex justify-around pt-9 pb-9 bg-amber-50'>
      {/* left */}
      <div className='flex gap-4 items-center'>
        <FaLocationDot className='text-amber-500'/>
        <div>
          <p className='text-sm font-bold'>OUR LOCATION</p>
          <p className='text-sm'>Bahir Dar , Tana</p>
        </div>
      </div>
      <div className='flex gap-4 items-center'>
        <FaClock className='text-amber-500'/>
        <div>
         <p className='text-sm font-bold'> BUSSINESS HOURS</p>
         <p className='text-sm'>Monday - Monday</p>
        </div>
      </div>
      <div className='flex gap-4 items-center'>
        <FaStar className='text-amber-500 '/>
        <div>
          <p className='text-sm font-bold'>CONTACT US</p>
          <p className='text-sm'>+ 251-973-769-266</p>
        </div>
      </div>
    </div>
  )
}

export default ContactInfo
