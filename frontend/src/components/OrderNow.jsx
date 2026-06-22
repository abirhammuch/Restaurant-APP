

import React from 'react'
import { FaArrowRight } from 'react-icons/fa'

const OrderNow = () => {
  return (
    <div className='bg-amber-400 px-4 py-4 rounded-2xl text-black font-bold flex gap-9 items-center hover:bg-amber-600  max-w-60'>

      <p>Order Now</p>
      <FaArrowRight />
    </div>
  )
}

export default OrderNow
