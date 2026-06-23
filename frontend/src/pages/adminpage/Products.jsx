import React, { useContext, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { TbBowlSpoon } from "react-icons/tb";
import { assets } from "../../assets/assets/assets";
import { AppContext } from "../../context/AppContext";
import { FaPencil ,FaTrash} from "react-icons/fa6";
import {toast} from 'react-toastify'
import axios from 'axios'

const Products = () => {

  const {foods, currency, backendUrl, admintoken} = useContext(AppContext)
  
  const [page, setPage] = useState(1)
  const productPerPage = 10
  const startIndex = (page-1) * productPerPage
  const currentFood = foods.slice( startIndex, startIndex + productPerPage)
  const totalPages = Math.ceil(foods.length / productPerPage)
  
  const [makeVisible, setMakeVisible] = useState(true)

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("maindish")
  const [ingredients, setIngredients] = useState("")
  const [allergens, setAllergens] = useState("")
  const [dietaryTags, setDietaryTags] = useState("")
  const [preparationTime, setPreparationTime] = useState("")
  const [averageRating, setAverageRating] = useState("")
  const [totalReviews, setTotalReviews] = useState("")

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      const formData = new FormData();

      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("ingredients", ingredients)
      formData.append("allergens", allergens)
      formData.append("dietaryTags", dietaryTags)
      formData.append("preparationTime", Number(preparationTime)) // Convert to number
      formData.append("averageRating", Number(averageRating) || 0)
      formData.append("totalReviews", Number(totalReviews) || 0)

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(backendUrl + '/api/food/add',
        formData,
        {
          headers: {
            admintoken: admintoken,
          },
        }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        // Reset form
        setName('')
        setDescription('')
        setPrice('')
        setCategory('maindish')
        setIngredients('')
        setAllergens('')
        setDietaryTags('')
        setPreparationTime('')
        setAverageRating('')
        setTotalReviews('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }
  
  // Clear form handler
  const handleClear = () => {
    setName('')
    setDescription('')
    setPrice('')
    setCategory('maindish')
    setIngredients('')
    setAllergens('')
    setDietaryTags('')
    setPreparationTime('')
    setAverageRating('')
    setTotalReviews('')
    setImage1(false)
    setImage2(false)
    setImage3(false)
    setImage4(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-[40px] font-bold ">Menu Management</p>
          <p className="font-bold">
            Add, edit, and organize your restaurant's digital offerings.
          </p>
        </div>

        <div className="flex gap-9">
          <div className="flex gap-2 items-center border px-2 py-1 rounded-md border-gray-500 cursor-pointer">
            <FiFilter />
            <p className="font-bold">Filter</p>
          </div>
          <div className="flex gap-2 items-center text-white px-2 py-1 rounded-md border-gray-500 cursor-pointer bg-orange-500  ">
            <p>+</p>
            <p>Add Category</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_2fr] mt-4">
        <div className="shadow-2xl px-6 rounded-2xl py-9">
          <div className="flex gap-2 ">
            <TbBowlSpoon className="text-orange-600 "/>
            <p className="font-bold">Add New Dish</p>
          </div>
          <p className="text-sm text-gray-600 mb-6">Enter details to list a new item on the menu</p>
          <div>
            <form onSubmit={onSubmitHandler}>
              
              <div className="mb-4">
                <p className="text-sm font-bold mb-2">Product Image</p>
                <label htmlFor="image">
                  <img className="w-40" src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
                  <input
                    onChange={(e) => setImage1(e.target.files[0])}
                    type="file"
                    id="image"
                    hidden
                  />
                </label>
              </div>

              <div>
                <p className="font-md">Dish Name</p>
                <input 
                  type="text" 
                  placeholder="Enter dish name" 
                  className="px-3 py-1 mt-1 w-full border rounded"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-between mt-4">
                <div>
                  <p>Category</p>
                  <select 
                    className="px-3 py-2 w-40 border rounded"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    <option value='drink'>Drink</option>
                    <option value='vegetable'>Vegetables</option>
                    <option value='maindish'>Main Dish</option>
                  </select>
                </div>
                <div>
                  <p>Price</p>
                  <input 
                    type="number" 
                    placeholder="23.90" 
                    min='0' 
                    step="0.01"
                    className="px-3 py-1 w-40 border rounded"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mt-3">
                <p className="mb-2">Short Description</p>
                <textarea 
                  placeholder="Write description ..." 
                  className="w-full border rounded px-3 py-2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  required
                />
              </div>

              <div className="mt-3">
                <p>Main Ingredients</p>
                <input 
                  type="text" 
                  placeholder="Comma separated: ingredient1, ingredient2" 
                  className="w-full px-3 py-2 mt-2 border rounded"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  required
                />
              </div>

              <div className="mt-3">
                <p>Preparation Time (minutes)</p>
                <input 
                  type="number" 
                  placeholder="Enter preparation time in minutes" 
                  className="w-full px-3 py-2 mt-2 border rounded"
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(e.target.value)}
                  min="0"
                  required
                />
              </div>

              <div className="mt-4">
                <p>Dietary Classifications</p>
                <div className="flex gap-5 mt-3 mb-3">
                  <p className="px-2 rounded-2xl border-gray-400 bg-orange-600 text-white cursor-pointer">Dairy</p>
                  <p className="border px-2 rounded-2xl border-gray-400 cursor-pointer">Dairy-Free</p>
                </div>
                <input 
                  type="text" 
                  placeholder="Add dietary tags (comma separated)" 
                  className="w-full px-3 py-2 mt-1 border rounded"
                  value={dietaryTags}
                  onChange={(e) => setDietaryTags(e.target.value)}
                />
              </div>

              <div className="border px-3 py-5 rounded-2xl border-gray-300 bg-gray-50 mb-7 mt-4">
                <p className="font-bold">Instant Availability</p>
                <div className="flex justify-between gap-5">
                  <div>
                    <p className="text-sm text-gray-700">Make this item visible on the menu immediately</p>
                  </div>
                  <div onClick={() => setMakeVisible((prev) => !prev)}
                    className="bg-orange-600 w-10 h-6 rounded-2xl flex items-center cursor-pointer">
                    {makeVisible ? 
                      <div className="bg-white w-5 ml-5 rounded-full h-6 border border-orange-600">.</div>
                      :
                      <div className="bg-white w-5 rounded-full h-6 border border-orange-600">.</div>
                    }
                  </div>
                </div>
              </div>
              
              <div className="flex justify-around">
                <button 
                  type="button" 
                  onClick={handleClear}
                  className="text-sm border px-14 py-1 rounded-md border-gray-300 cursor-pointer hover:bg-gray-200"
                >
                  Clear
                </button>
                <button 
                  type="submit" 
                  className="text-sm bg-orange-500 text-white hover:bg-orange-600 px-9 py-2 rounded-md cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Left side - Inventory List */}
        <div>
          <div className="flex justify-between pt-4 ml-9">
            <div className="">
              <p className="text-3xl font-bold">Inventory List</p>
              <p>Managing items across the category.</p>
            </div>

            <div className="">
              <div className="">
                <input type="text" placeholder="Search Menu..." className="px-8 py-2 border rounded" />
                <img src={assets.search_icon} className="relative bottom-7 left-2" alt="search" />
              </div>
            </div>
          </div>

          <div className="shadow-2xl bg-gray-100">
            <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] ml-6 border-t mt-5 pt-3 border-gray-400">
              <p className="text-lg">Image</p>
              <p className="text-lg">Product Details</p>
              <p className="text-lg">Category</p>
              <p className="text-lg">Price</p>
              <p className="text-lg">Status</p>
              <p className="text-lg">Action</p>
            </div>

            {currentFood && currentFood.map((food, indx) => (
              <div key={indx} className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] ml-6 border-t mt-5 pt-3 border-gray-400">
                <img src={food.image[0]} className="w-15" alt={food.name} />
                <p>{food.name}</p>
                <p>{food.category}</p>
                <p className="text-orange-600">{currency}{food.price}</p>
                <p>{food.status}</p>
                <div className="flex gap-4">
                  <FaPencil className="text-orange-500 cursor-pointer" />
                  <FaTrash className="text-orange-500 cursor-pointer" />
                </div>
              </div>
            ))}

            <div className="flex justify-between mx-4 border-t py-4 border-gray-400">
              <div className="px-3 text-gray-700">Showing {page} of {totalPages}</div>
              <div className="flex gap-5 mb-7 px-4">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="border px-3 py-1 rounded-md border-gray-400 cursor-pointer hover:bg-gray-200 disabled:opacity-50"
                >
                  Previous
                </button>
                <button 
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="border px-3 py-1 rounded-md border-gray-400 cursor-pointer hover:bg-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;