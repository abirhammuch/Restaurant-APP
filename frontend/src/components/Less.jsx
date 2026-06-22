
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa6'

const Less = ({text}) => {
  return (
    <div>
      <div>
            <div  className='flex justify-end mr-9 items-center gap-5 text-amber-400 hover:text-amber-600 cursor-pointer'>
              
              <FaArrowLeft className='transition group-hover:translate-x-1 ' />
              <p>{text}</p>
            </div>
          </div>
    </div>
  )
}

export default Less
