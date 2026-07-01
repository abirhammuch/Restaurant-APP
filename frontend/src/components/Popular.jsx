import React, { useContext, useEffect, useState } from "react";
import Title from "./Title";
import { AppContext } from "../context/AppContext";

import Food from "./FoodCard";
import More from "./More";
import Less from "./Less";

const Popular = () => {
  const { foods, popularFood,setPopularFood  } = useContext(AppContext);
  
  const [more, setMore] = useState(false)
  const [slicedPopularFood,setSlicedPopularFood] = useState([])

  useEffect(() => {
  setSlicedPopularFood(popularFood.slice(0,4))
  }, [more,popularFood])

  
  
  

 
  return (
    <div className="mt-6">
      <Title text="Popular Right Now" />
      
      
      
      

      <p className="flex justify-center text-sm">
        Discover the dishes that are winning hearts across the city today.
      </p>
       <div onClick={() => setMore((prev) => !prev)} className="mt-3">
        {
             
                more ?  <Less text={'Less'} />: <More text={'More'} />

             
      }
       </div>

      <Food food={ more ? popularFood : slicedPopularFood} />
    </div>
  );
};

export default Popular;
