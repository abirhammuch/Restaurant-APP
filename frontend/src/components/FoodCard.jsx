import React, { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets/assets'

const FoodCard = ({ food }) => {  
  const { currency, navigate,useParams,setFoodDetail, addToCart} = useContext(AppContext)

  const foodDetail = (item) => {
     navigate(`menu/${item.category}/${item._id}`)
    
     
     
  }

  

  
  
  return (
    <div className='px-6 sm:grid sm:px-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-y-6    gap-6 pt-8 '>
      {food && food.map((item, index) => (  
        <div 
         key={index} className='relative flex flex-col bg-gray-100 rounded-2xl mt-9'>
          <img  src={item.image?.[0] || item.images?.[0]} alt='' className='mt-4 mb-4' onClick={() =>foodDetail(item) } />
          <p className='absolute top-5 left-4  bg-white px-3 py-1 rounded-2xl'>{item.category}</p>
          <div className='absolute top-5 right-5 bg-amber-500 px-3 rounded-2xl text-sm'>
            
            ({item.averageRating})
          </div>
          <div className='px-9'>
                <p className='font-bold text-2xl'>{item.name}</p>
                <p className='text-sm text-gray-700'>{item.description}</p>
                <div className='flex justify-between pt-3 pb-9'>
                    <p className='text-amber-500 font-bold'>{currency}{item.price}</p>
                    <p onClick={() =>addToCart(item._id)}
                     className='bg-amber-500 px-3 rounded-2xl cursor-pointer'> +</p>
                  </div>
            </div>
        </div>
      ))}
    </div>
  )
}

export default FoodCard