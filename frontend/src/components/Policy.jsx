

import React from 'react'

const Policy = () => {
  return (
    <div className='pb-9 bg-gray-100'>
      
      <div className='sm:flex justify-between items-center px-9 border-t mx-6 border-gray-300  pt-4 '>
        <p className='mb-5'>2026 Green cart, All right reserved</p>

        <hr className='mt-2 mb-4 text-gray-300 sm:hidden'/>
        <div className='flex justify-between items-center px-9 gap-9'>
          <p className="text-sm pb-2 cursor-pointer hover:text-amber-500"> Privecy Policy</p>
          <p className="text-sm pb-2 cursor-pointer hover:text-amber-500">Terms of Service</p>
          <p className="text-sm pb-2 cursor-pointer hover:text-amber-500">Cookies</p>
        </div>
      </div>
    </div>
  )
}

export default Policy
