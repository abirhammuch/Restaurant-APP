

import React, { useContext, useEffect, useState } from 'react'
import { FaDownload } from 'react-icons/fa6'
import { assets } from '../../assets/assets/assets'
import { AppContext } from '../../context/AppContext'

const Orders = () => {

  const {totalOrders,setTotalOrders} = useContext(AppContext)
  const {users, setUsers} = useState([])





  return (
    <div>
      <div className='flex justify-between items-center mb-5'>
        <div>
          <p className='text-2xl font-bold'>Order Management</p>
        <p className=''>Manage, monitor, and update live orders from the kitchen.</p>
        </div>
        <div className='flex gap-3'> 
          <div className='flex gap-2 border px-3 py-2 rounded-md border-gray-300 cursor-pointer hover:bg-gray-100'>
            <FaDownload />
             <p className=''>Export</p>
          </div>
          
          <div className='flex gap-2 border px-3 py-2 rounded-md border-gray-300 cursor-pointer bg-amber-500 text-white font-bold hover:bg-orange-600'> 
            <p>+</p>
            <p className=''>New In-shop Order</p>
          </div>

        </div>

      </div>



      <div className='flex w-full gap-6'>
            <div className='border w-full flex flex-col justify-center items-center rounded-2xl py-3 border-gray-300 shadow-2xl cursor-pointer hover:bg-gray-100'>
              <p className='text-sm'>TOTAL ACTIVE</p>
              <p className='font-bold text-2xl'>14</p>
            </div>

             <div className='border w-full flex flex-col justify-center items-center rounded-2xl py-3 border-gray-300 shadow-2xl cursor-pointer hover:bg-gray-100'>
              <p className='text-sm'>WAITING KITCHEN</p>
              <p className='font-bold text-2xl'>6</p>
            </div>
            
            
             <div className='border w-full flex flex-col justify-center items-center rounded-2xl py-3 border-gray-300 shadow-2xl cursor-pointer hover:bg-gray-100'>
              <p className='text-sm'>READY FOR PICKUP</p>
              <p className='font-bold text-2xl'>10</p>
            </div>
            

             <div className='border w-full flex flex-col justify-center items-center rounded-2xl py-3 border-gray-300 shadow-2xl cursor-pointer hover:bg-gray-100'>
              <p className='text-sm'>EST.DELIVERY</p>
              <p className='font-bold text-2xl'>14 m</p>
            </div>
            
      </div>

      <div  className='grid border grid-cols-2 mt-6 pt-7 px-5 mb-5 rounded-2xl border-gray-300'>
        <div className='relative mb-4 max-w-[900px]'>
          <input type='text' placeholder='Search by Order ID or Customer Name...' className='px-8  py-2 w-full'/>
          <img src={assets.search_icon} alt=' ' className='absolute top-4 left-2' />
        </div>
        <div className='flex justify-around ml-3 items-center pb-4'>
          <p className=' px-3 py-2 rounded-full bg-orange-600 text-white hover:bg-orange-500 cursor-pointer'>All</p>
          <p className='cursor-pointer'>Pending</p>
          <p className='cursor-pointer'>Preparing</p>
          <p className='cursor-pointer'>Ready</p>
          <p className='cursor-pointer' >Delivered</p>
          <p className='cursor-pointer'>Cancelled</p>
        </div>

      </div>




      <div className='border rounded-2xl border-gray-400'>
            <div className='grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr] px-5 py-5  border-gray-400 bg-gray-100 rounded-2xl font-bold'>
              <p>Order ID</p>
              <p className='text-center'>Customer</p>
              <p >Table</p>
              <p >Items</p>
              <p >Total</p>
              <p >Time</p>
              <p >Status</p>
              <p >Actions</p>
            </div>

            {
              totalOrders && totalOrders.map((order, index) =>(

                <div key={index} className='grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_1fr] px-5 py-5 '>
              <p >#{order._id}</p>
              <p className='text-center'>{order.userId} </p>
              <p >Table</p>
              <p >Items</p>
              <p >Total</p>
              <p >Time</p>
              <p >Status</p>
              <p>Actions</p>
            </div>
              ))
            }
           
      </div>
       
    </div>
  )
}

export default Orders
