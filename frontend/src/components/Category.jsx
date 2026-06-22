
import { AppContext } from "../context/AppContext";
import Less from "./Less";
import More from "./More";
import Title from "./Title";

import React, { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom'

const Category = () => {
  const {  fullCategory,setFullCategory,navigate} = useContext(AppContext)
  const [category, setCategory] = useState([])
  const [more, setMore] = useState(false)
  const [filterCategory, setFilterCategory] = useState([])
  
  

 
  
  
  
  return (
    <div className="px-4">
      <Title text={"Explore Categories"} />
      <div onClick={()=>setMore((prev) => !prev)}>
        {
          more ?  <Less text={'Less'} /> :<More   text={'View More'} /> 
        }
        
      </div>
      
      {
        more ? <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-6 gap-6 '>
       { fullCategory.map((category, index) => (
          <div key={index} className='group cursor-pointer py-5 px-3   gap-2 rounded-lg flex flex-col justify-center items-center bg-gray-100 ' >
            <div onClick={() => navigate(`/menu/${category.path.toLowerCase()}`,
            scrollTo(0,0))} className="flex flex-col px-3 " >
              <img  src={category.image} alt={category.text}className='group-hover:scale-108 transition max-w-60 rounded-2xl ' />
              <p className="px-12 pt-5">{category.text}</p>
            </div>
          </div>
        ))} : 
        
        

        
      </div> :<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mt-6 gap-6 '>
       { fullCategory.slice(0,6).map((category, index) => (
          <div key={index} className='group cursor-pointer py-5 px-3   gap-2 rounded-lg flex flex-col justify-center items-center bg-gray-100 '>
            <div onClick={() => navigate(`/menu/${category.path.toLowerCase()}`,
            scrollTo(0,0))}  className="flex flex-col px-3 ">
              <img src={category.image} alt={category.text}className='group-hover:scale-108 transition max-w-60 rounded-2xl'/>
              <p className="px-12">{category.text}</p>
            </div>
          </div>
        ))} : 
        
        

        
      </div>
      }
      
    </div>
  );
};

export default Category;
