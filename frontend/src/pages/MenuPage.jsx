

import React, { useContext, useEffect } from 'react'
import Menu from '../components/Menu'
import Search from '../components/Search'
import { AppContext } from '../context/AppContext'


const MenuPage = () => {
  const {showSearch} = useContext(AppContext)


     
  return (
    <div className='mx-9'>
      {
        showSearch &&
         <div> 
          <Search />
          </div>
      }
      <Menu />
    </div>
  )
}

export default MenuPage
