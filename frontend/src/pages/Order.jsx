


import React, { useContext } from 'react'
import { FaDoorOpen } from 'react-icons/fa'
import { AppContext } from '../context/AppContext'
import { FaCheck } from 'react-icons/fa'
import { FaChevronDown } from 'react-icons/fa'
import { FaPhone } from 'react-icons/fa'

const Order = () => {

  const {currency} = useContext(AppContext)
  return (
    <div className='mt-14'>
      <div className='lg:mx-80 shadow-2xl rounded-2xl md:px-50 lg:px-0'>
        <div className='lg:flex justify-around px-9'>
          <div className='mb-5 '>
                <div className='border border-amber-400 rounded-2xl'>
                  <p className=' px-3 py-2 text-amber-700 bg-amber-50 rounded-2xl font-bold'>LIVE TRAKING</p>
                </div>
                <p className='font-bold text-2xl mt-3 mb-2'>Order #gfihurihrleiu(id)</p>
                <p className='text-sm'>Placed today at 12:45 PM</p>
          </div>
          <div className='border  flex flex-col  justify-center px-9 rounded-2xl border-gray-300'>
            <p className='text-md font-bold'>ESTIMATED ARRIVAL</p>
            <p className='font-bold text-2xl text-amber-600'>18 - 24 min</p>
          </div>
        </div>

        <div className='flex justify-around mt-6 pb-9'>
          <div>
            <p className='font-bold'>Currently: <span className='text-amber-600'>preparing your feast</span></p>
          </div>
          <div>
            <p>60% complete</p>
          </div>
        </div>
      </div>



      <div className='md:grid lg:grid-cols-[1fr_1fr] shadow m-9'>
        <div className='  mx-8'>
        <div className='flex items-center mt-4 mb-6 '>
            <p className='px-3 w-33 font-bold text-2xl w-full'>Order Journy</p>
            
        </div>
        <div className='flex gap-6'>
        <div className='bg-amber-600 px-3 h-10 flex items-center rounded-full'> 
          <FaCheck className='text-white'/>
        </div>
        <div>
          <div className=' flex justify-between mb-3'>
            <p className='font-bold'>Order Recived</p>
            <p className='text-sm font-bold'>12:45 PM</p>
          </div>
          <p className='text-gray-800 text-sm'>We have successfully recived your order and sent it to the kitchen team.</p>
        </div>

        </div>


         <div className='flex gap-6 mt-8'>
        <div className='bg-amber-600 px-3 h-10 flex items-center rounded-full'> 
          <FaCheck className='text-white'/>
        </div>
        <div>
          <div className=' flex justify-between mb-3 '>
            <p className='font-bold'>Order Confirmed</p>
            <p  className='text-sm font-bold'>12:50 PM</p>
          </div>
          <p className='text-gray-800 text-sm'>Our chefs have acknowledgeyour order and are gathering the finest ingredients</p>
        </div>

        </div>




         <div className='flex gap-6 mt-8'>
        <div className='bg-white border border-amber-600 px-3 h-10 flex items-center rounded-full'> 
          <FaCheck className='text-amber-600'/>
        </div>
        <div>
          <div className=' flex justify-between mb-3'>
            <p className='font-bold text-amber-600'>Preparing Your Food</p>
            <p className='text-sm font-bold text-amber-600'>in progress</p>
          </div>
          <p className='text-gray-800 text-sm'>the kitchen is buzzing! Our head chef is meticulousiy crafting your meal right now. </p>
        </div>

        </div>


         <div className='flex gap-6 mt-8'>
        <div className='bg-gray-200 px-3 h-10 flex items-center rounded-full'> 
          <FaCheck className='text-black'/>
        </div>
        <div>
          <div className=' flex justify-between mb-3'>
            <p className='font-bold'>Ready for Pickup</p>
            <p className='text-sm font-bold'> Est: 1:50 PM</p>
          </div>
          <p className='text-gray-800 text-sm'>ones finalized we will notify you that order is ready for the courier.</p>
        </div>

        </div>



         <div className='flex gap-6 mt-8 mb-9'>
       <div className='bg-gray-200 px-3 h-10 flex items-center rounded-full'> 
          <FaCheck className='text-black'/>
        </div>
        <div className=''>
          <div className=' flex justify-between mb-3  '>
            <p className='font-bold'>Out of Delivery</p>
            <p className='text-sm font-bold'>Est: 1:55 PM</p>
          </div>
          <p className='text-gray-800 text-sm'>our courier will safely deliver your warm meal to your  table </p>
        </div>

        </div>
          
        </div>



        {/* left */}
        <div>
          <div className='shadow-2xl mt-16 mr-9 px-9 py-9 mb-9 border border-gray-300 rounded-2xl'>
          <div >
            <div className='flex justify-between mb-4'>
                  <p className='font-bold'>View Order Summery </p>
                  <FaChevronDown />


            </div>

            <div className='flex justify-between mb-4'>
              <div className='flex gap-3'>
                <p className=' px-2 py-1 rounded-md  bg-amber-100 text-sm text-amber-700 '>2X</p>
              <p className='text-md text-gray-800'>Burger</p>
              </div>
              <p>{currency}{450}</p>
            </div>

            <div className='flex justify-between mb-4'>
              <div className='flex gap-3'>
                <p className=' px-2 py-1 rounded-md  bg-amber-100 text-sm text-amber-700 '>2X</p>
              <p className='text-md text-gray-800'>Burger</p>
              </div>
              <p>{currency}{450}</p>
            </div>

            <div className='flex justify-between mb-4'>
              <div className='flex gap-3'>
                <p className=' px-2 py-1 rounded-md  bg-amber-100 text-sm text-amber-700 '>2X</p>
              <p className='text-md text-gray-800'>Burger</p>
              </div>
              <p>{currency}{450}</p>
            </div>


            <hr className='text-gray-300'/>

            <div className='mt-8 flex justify-between font-bold'>
              <p>Total Paid</p>
              <p>{currency}{430}</p>
            </div>
          </div>

          
        </div>
           <div className='mb-6 bg-orange-100 rounded-2xl mx-9 px-9 py-6 '>
            <p className='font-bold text-red-950 mb-2'>Need help with your order?</p>
            <p>Our supporter team is available 24/7 if you have any questions or need to modify yoour instractions.</p>

            <div className='flex justify-center mt-4 '>
                  <div className='flex gap-3 bg-amber-600 rounded-2xl  text-white items-center px-9 py-2 hover:bg-amber-700 cursor-pointer'>
              <FaPhone />
              <p className='text-black'>Call Uss</p>
            </div>
            </div>
            
           </div>
        </div>
        
      </div>
    </div>
  )
}

export default Order
