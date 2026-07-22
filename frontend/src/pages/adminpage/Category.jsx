import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets/assets";
import { AppContext } from "../../context/AppContext";
import { FaPencil, FaTrash } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";

const Category = () => {
  const { allCategory, setAllCategory, navigate, backendUrl, admintoken } =
    useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState("");

  const [imagePreview, setImagePreview] = useState(null);
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameAm, setNameAm] = useState("");
  const [order, setOrder] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [typeEn, setTypeEn] = useState("Fast");
  const [typeAm, setTypeAm] = useState("");

  const getCategoryList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/category/list");
      if (response.data.success) {
        setAllCategory(response.data.categories);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/category/remove",
        { categoryId },
        {
          headers: {
            admintoken: admintoken,
          },
        },
      );
      if (response.data.success) {
        toast.success("Category deleted successfully");
        getCategoryList(); // Refresh the list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete food");
    }
  };

  const editCategory = async (category) => {
    setEditingCategoryId(category._id);
    setIsEditing(true);

    setNameEn(category.name_en || category.name || "");
    setNameAm(category.name_am || "");
    setTypeEn(category.type_en || category.type || "");
    setTypeAm(category.type_am || "");
    setBgColor(category.bgColor || "");
    setTextColor(category.textColor || "");
    setOrder(category.order || "");

    const existImage = category.images?.[0];

    if (existImage) {
      setImage1(existImage);
    }
  };

  const handleImage = (image) => {
    if (!image) return assets.upload_area;

    // If it's a File or Blob object, create object URL
    if (image instanceof File || image instanceof Blob) {
      return URL.createObjectURL(image);
    }

    // If it's a string (URL from database), return it directly
    if (typeof image === "string") {
      return image;
    }

    // Fallback
    return assets.upload_area;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();

      const nameValue = nameEn.trim() || nameAm.trim();
      formData.append("name", nameValue);
      formData.append("name_en", nameEn.trim());
      formData.append("name_am", nameAm.trim());
      formData.append("bgColor", bgColor);
      formData.append("textColor", textColor);
      formData.append("order", order);
      formData.append("type", typeEn.trim() || typeAm.trim());
      formData.append("type_en", typeEn.trim());
      formData.append("type_am", typeAm.trim());

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      let response;

      if (isEditing && editingCategoryId) {
        formData.append("categoryId", editingCategoryId);
        console.log(editingCategoryId);

        response = await axios.put(
          backendUrl + "/api/category/edit",
          formData,
          {
            headers: {
              admintoken,
            },
          },
        );

        console.log(response);
      } else {
        response = await axios.post(
          backendUrl + "/api/category/add",
          formData,
          {
            headers: {
              admintoken: admintoken,
            },
          },
        );
      }

      console.log(response);

      if (response.data.success) {
        getCategoryList();
        toast.success(response.data.message);
        setNameEn("");
        setNameAm("");
        setBgColor("");
        setTextColor("");
        setOrder("");
        setTypeEn("Fast");
        setTypeAm("");
        setIsEditing(false);
        setEditingCategoryId("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error({ success: false, message: "Error adding category" });
    }
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <p className="text-[40px] font-bold">Category Management</p>
          <p className="font-bold">Add, edite and delete your category.</p>
        </div>

        <div className="flex gap-2 items-center text-white px-2 py-2 rounded-md border-gray-500 cursor-pointer bg-orange-500">
          <p>+</p>
          <p>Add Category</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] gap-6 mt-9">
        {/*    form */}
        <form onSubmit={onSubmitHandler} className="mx-0 sm:mx-5">
          <p className="font-bold">Add New Category</p>
          <p className="text-sm text-gray-600 mb-6">
            Enter details to the category{" "}
          </p>

          <div>
            <p className="text-sm font-bold mb-2">Category Image</p>
            <label htmlFor="image">
              <img
                className="w-40 h-40 object-cover"
                src={handleImage(image1)}
                alt="Upload"
              />
              <input
                onChange={(e) => setImage1(e.target.files[0])}
                type="file"
                id="image"
                name="image1"
                hidden
              />
            </label>
          </div>
          <div className="mt-4">
            <p className="font-md">Category Name (English)</p>
            <input
              onChange={(e) => setNameEn(e.target.value)}
              value={nameEn}
              type="text"
              placeholder="Enter category name in English"
              required
              className="px-3 py-1 mt-1 w-full border rounded "
            />
            <input
              onChange={(e) => setNameAm(e.target.value)}
              value={nameAm}
              type="text"
              placeholder="Enter category name in Amharic"
              className="px-3 py-1 mt-2 w-full border rounded "
            />
          </div>

          <div className="mt-4">
            <p className="font-md">Category Type (English)</p>
            <input
              onChange={(e) => setTypeEn(e.target.value)}
              value={typeEn}
              type="text"
              placeholder="Enter category type in English"
              required
              className="px-3 py-1 mt-1 w-full border rounded "
            />
            <input
              onChange={(e) => setTypeAm(e.target.value)}
              value={typeAm}
              type="text"
              placeholder="Enter category type in Amharic"
              className="px-3 py-1 mt-2 w-full border rounded "
            />
          </div>

          <div className="mt-4">
            <p className="font-md"> Background Colour</p>
            <input
              onChange={(e) => setBgColor(e.target.value)}
              value={bgColor}
              type="text"
              placeholder="Enter category name"
              className="px-3 py-1 mt-1 w-full border rounded"
            />
          </div>

          <div className="mt-4 ">
            <p className="font-md">Text Colour</p>
            <input
              onChange={(e) => setTextColor(e.target.value)}
              value={textColor}
              type="text"
              placeholder="Enter category name"
              className="px-3 py-1 mt-1 w-full border rounded"
            />
          </div>
          <div className="mt-4 mb-5">
            <p className="font-md">Order</p>
            <input
              onChange={(e) => setOrder(e.target.value)}
              value={order}
              type="number"
              placeholder="Enter the place"
              min={1}
              className="px-3 py-1 mt-1 w-full border rounded "
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className='className="text-sm bg-orange-500 text-white hover:bg-orange-600 px-9 py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed items-center"'
            >
              Add
            </button>
          </div>
        </form>

        {/*    category list */}
        <div className="shadow-2xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between pt-4 ml-0 sm:ml-9 px-3 sm:px-0">
            <div>
              <p className="text-3xl font-bold">Category List</p>
              <p>Manege Category across the list</p>
              <p className="text-sm text-gray-500">Total: 5 catecories</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Category..."
                className="px-8 py-2 border rounded pl-8"
              />
              <img
                src={assets.search_icon}
                className="absolute left-2 top-5 transform -translate-y-1/2 w-4 h-4"
              />
            </div>
          </div>

          <div className="shadow-2xl bg-gray-100">
            <div className="hidden lg:grid grid-cols-[1fr_2fr_1fr_1fr] ml-6 border-t mt-5 pt-3 border-gray-400 px-6">
              <p className="text-lg font-semibold">Image</p>
              <p className="text-lg font-semibold">Category Name</p>
              <p className="text-lg font-semibold">Category Type</p>
              <p className="text-lg font-semibold text-end">Action</p>
            </div>

            {allCategory &&
              allCategory.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_2fr_1fr_1fr] ml-0 lg:ml-6 border-t mt-5 pt-3 border-gray-400 px-3 lg:px-0"
                >
                  <img src={item.images[0]} className="w-16" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.name_am && (
                      <p className="text-xs text-gray-500">{item.name_am}</p>
                    )}
                  </div>
                  <p>{item.type}</p>
                  <div className="flex gap-6 justify-end px-6">
                    <FaPencil
                      onClick={() => editCategory(item)}
                      className="text-orange-500 cursor-pointer hover:text-orange-700"
                    />
                    <FaTrash
                      onClick={() => deleteCategory(item._id)}
                      className="text-orange-500 cursor-pointer hover:text-orange-700"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
