

import React from 'react'
import { assets } from '../assets/assets/assets'

const CustomerComent = ({customername, text, rate, comment}) => {
  return (
    <div>
      <div >
       <div className='flex gap-2 mb-8'>
         <img className='w-10' src={assets.profile_icon} alt='' />
        <div>
          <p className=''>{customername}</p>
          <p className='text-sm text-gray-600'>{text}</p>

        </div>
       </div>
        <div>
              {/* star */}
                   <div className='flex items-center gap-0.5'>
                      {Array(5).fill('').map((_, i)=>(
                          <img key={i} className='md:w-3.5 w-3' src={i < rate ?  assets.star_icon : assets.star_dull_icon} alt=''  />
                      ))}
                      
                  </div>

                  <p className='text-sm py-4'>{comment}</p>
        </div>
      </div>
    </div>
  )
}

export default CustomerComent
