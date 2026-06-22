
import { FaArrowRight } from 'react-icons/fa'
import React, { useContext } from 'react'


const More = ({text}) => {
  
  
  

  return (
    <div>
      <div  className='flex justify-end mr-9 items-center gap-5 text-amber-400 hover:text-amber-600 cursor-pointer'>
        <p>{text}</p>
        <FaArrowRight className='transition group-hover:translate-x-1 ' />
      </div>
    </div>
  )
}

export default More
