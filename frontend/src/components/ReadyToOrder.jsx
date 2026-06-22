

import React, { useContext } from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { AppContext } from '../context/AppContext'


const ReadyToOrder = () => {

  const {navigate} = useContext(AppContext)
  return (
    <div className=' bg-amber-700'>
    <div className='h-[100px] bg-amber-700 flex justify-around items-center mx-9 '>
      <div>
        <p className='text-2xl font-bold text-white'>Ready to order?</p>
        <p className='text-sm text-white pt-2'>Browse our extensive menu and threat yourself today.</p>
      </div>
        <div onClick={ () =>navigate('/menu')}
          className='bg-white px-2 py-2 rounded-2xl text-black font-bold flex gap-9 items-center hover:bg-amber-500  max-w-60 cursor-pointer'>
      
            <p>Order Now</p>
            <FaArrowRight />
          </div>
      
      
    </div>
    </div>  
  )
}

export default ReadyToOrder
