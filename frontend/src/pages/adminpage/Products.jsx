import React, { useContext, useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { TbBowlSpoon } from "react-icons/tb";
import { assets } from "../../assets/assets/assets";
import { AppContext } from "../../context/AppContext";
import { FaPencil, FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";
import axios from "axios";

const Products = () => {
  const {
    currency,
    backendUrl,
    admintoken,
    navigate,
    allCategory,
    adminLanguage,
  } = useContext(AppContext);

  const [page, setPage] = useState(1);
  const productPerPage = 10;
  const [searchedQuery, setSearchedQuery] = useState("");
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [foods, setFoods] = useState([]);

  // Filter states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState("");

  const [makeVisible, setMakeVisible] = useState(true);

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState("");
  const [nameAm, setNameAm] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionAm, setDescriptionAm] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("maindish");
  const [ingredients, setIngredients] = useState("");
  const [allergens, setAllergens] = useState("");
  const [dietaryTags, setDietaryTags] = useState("");
  const [preparationTime, setPreparationTime] = useState("");
  const [averageRating, setAverageRating] = useState("");
  const [totalReviews, setTotalReviews] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFast, setIsFast] = useState(false);
  const [popular, setPopular] = useState(false);

  // Fetch food list
  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/food/list", {
        headers: {
          admintoken: admintoken,
        },
      });
      if (response.data.success) {
        setFoods(response.data.foods);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch food list");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Get unique categories from foods
  const categories = [
    "all",
    ...new Set(foods.map((food) => food.category).filter(Boolean)),
  ];

  // Filter and search function
  const applyFilters = () => {
    let results = [...foods];

    // Apply search
    if (searchedQuery && searchedQuery.trim() !== "") {
      const key =
        adminLanguage === "am"
          ? (f) => f.name_am || f.name
          : (f) => f.name_en || f.name;
      results = results.filter((food) =>
        key(food).toLowerCase().includes(searchedQuery.toLowerCase().trim()),
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      results = results.filter((food) => food.category === selectedCategory);
    }

    // Apply status filter
    if (selectedStatus !== "all") {
      results = results.filter(
        (food) =>
          (food.status || "available").toLowerCase() ===
          selectedStatus.toLowerCase(),
      );
    }

    // Apply price range filter
    if (priceRange.min) {
      results = results.filter((food) => food.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      results = results.filter((food) => food.price <= Number(priceRange.max));
    }

    // Apply sorting
    results.sort((a, b) => {
      let compareA = a[sortBy];
      let compareB = b[sortBy];

      if (sortBy === "name") {
        compareA =
          (adminLanguage === "am"
            ? a.name_am || a.name
            : a.name_en || a.name) || "";
        compareB =
          (adminLanguage === "am"
            ? b.name_am || b.name
            : b.name_en || b.name) || "";
      }

      if (sortBy === "price") {
        compareA = Number(compareA);
        compareB = Number(compareB);
      } else if (sortBy === "name") {
        compareA = compareA?.toLowerCase() || "";
        compareB = compareB?.toLowerCase() || "";
      } else {
        compareA = compareA || "";
        compareB = compareB || "";
      }

      if (compareA < compareB) return sortOrder === "asc" ? -1 : 1;
      if (compareA > compareB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredFoods(results);
    setPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, [
    searchedQuery,
    selectedCategory,
    selectedStatus,
    priceRange.min,
    priceRange.max,
    sortBy,
    sortOrder,
    foods,
  ]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedStatus("all");
    setPriceRange({ min: "", max: "" });
    setSortBy("name");
    setSortOrder("asc");
    setSearchedQuery("");
    setShowFilterModal(false);
  };

  // Get current page items
  const startIndex = (page - 1) * productPerPage;
  const currentData = filteredFoods.length > 0 ? filteredFoods : foods;
  const currentFood = currentData.slice(
    startIndex,
    startIndex + productPerPage,
  );
  const totalPages = Math.ceil(currentData.length / productPerPage);

  // Reset form
  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("maindish");
    setIngredients("");
    setAllergens("");
    setDietaryTags("");
    setPreparationTime("");
    setAverageRating("");
    setTotalReviews("");
    setImage1(false);
    setImage2(false);
    setImage3(false);
    setImage4(false);
    setIsEditing(false);
    setEditingFoodId("");
    setMakeVisible(true);

    // Clean up image preview
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage1(file);
      // Revoke old preview URL if exists
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Edit food - populate form
  const editFood = (food) => {
    console.log("Editing food:", food);

    setIsEditing(true);
    setEditingFoodId(food._id);
    setIsFast(food.isFast || false);
    setName(food.name || "");
    setNameAm(food.name_am || "");
    setDescription(food.description || "");
    setDescriptionAm(food.description_am || "");
    setPrice(food.price?.toString() || "");
    setCategory(food.category || "maindish");
    setIngredients(
      Array.isArray(food.ingredients)
        ? food.ingredients.join(", ")
        : food.ingredients || "",
    );
    setAllergens(
      Array.isArray(food.allergens)
        ? food.allergens.join(", ")
        : food.allergens || "",
    );
    setDietaryTags(
      Array.isArray(food.dietaryTags)
        ? food.dietaryTags.join(", ")
        : food.dietaryTags || "",
    );
    setPreparationTime(food.preparationTime?.toString() || "");
    setAverageRating(food.averageRating?.toString() || "");
    setTotalReviews(food.totalReviews?.toString() || "");
    setMakeVisible(food.status !== "unavailable");

    // Set image preview if exists
    const existingImage = food.images?.[0] || food.image?.[0];
    if (existingImage) {
      setImagePreview(existingImage);
    }

    // Scroll to form
    document
      .querySelector(".shadow-2xl.px-6.rounded-2xl")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Delete food
  const deleteAction = async (foodId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/food/remove",
        { foodId },
        {
          headers: {
            admintoken: admintoken,
          },
        },
      );

      if (response.data.success) {
        toast.success("Food deleted successfully");
        fetchList(); // Refresh the list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete food");
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!name || name.trim() === "") {
        toast.error("Please enter a dish name");
        setIsLoading(false);
        return;
      }

      if (!description || description.trim() === "") {
        toast.error("Please enter a description");
        setIsLoading(false);
        return;
      }

      if (!ingredients || ingredients.trim() === "") {
        toast.error("Please enter the main ingredients");
        setIsLoading(false);
        return;
      }

      if (
        !preparationTime ||
        isNaN(Number(preparationTime)) ||
        Number(preparationTime) <= 0
      ) {
        toast.error(
          "Please enter a valid preparation time (must be a positive number)",
        );
        setIsLoading(false);
        return;
      }

      if (!price || isNaN(Number(price)) || Number(price) <= 0) {
        toast.error("Please enter a valid price");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();

      // Always add these fields
      formData.append("name", name.trim());
      formData.append("name_en", name.trim());
      formData.append("name_am", nameAm.trim());
      formData.append("description", description.trim());
      formData.append("description_en", description.trim());
      formData.append("description_am", descriptionAm.trim());
      formData.append("price", Number(price));
      formData.append("category", category);
      formData.append("ingredients", ingredients.trim());
      formData.append("allergens", allergens.trim() || "None");
      formData.append("dietaryTags", dietaryTags.trim() || "None");
      formData.append("preparationTime", Number(preparationTime));
      formData.append("averageRating", Number(averageRating) || 0);
      formData.append("totalReviews", Number(totalReviews) || 0);
      formData.append("status", makeVisible ? "available" : "unavailable");
      formData.append("isFast", isFast);
      formData.append("popular", popular);

      // Only append images if they exist
      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      let response;

      if (isEditing && editingFoodId) {
        // Add foodId for edit
        formData.append("foodId", editingFoodId);

        console.log("=== UPDATING FOOD ===");
        console.log("Food ID:", editingFoodId);
        console.log("Form Data:");
        for (let pair of formData.entries()) {
          console.log(
            pair[0] + ":",
            pair[1] instanceof File ? pair[1].name : pair[1],
          );
        }

        response = await axios.put(`${backendUrl}/api/food/edit`, formData, {
          headers: {
            admintoken: admintoken,
            // Don't set Content-Type - let browser handle it for FormData
          },
        });

        console.log("Update Response:", response.data);
      } else {
        // Add new food
        console.log("=== ADDING NEW FOOD ===");
        console.log("Form Data:");
        for (let pair of formData.entries()) {
          console.log(
            pair[0] + ":",
            pair[1] instanceof File ? pair[1].name : pair[1],
          );
        }

        response = await axios.post(`${backendUrl}/api/food/add`, formData, {
          headers: {
            admintoken: admintoken,
          },
        });

        console.log("Add Response:", response.data);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
        await fetchList(); // Refresh the list
      } else {
        toast.error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.log("=== ERROR ===");
      console.log("Error:", error);

      if (error.response) {
        console.log("Response Status:", error.response.status);
        console.log("Response Data:", error.response.data);
        toast.error(
          error.response.data.message || `Error ${error.response.status}`,
        );
      } else if (error.request) {
        console.log("No response received");
        toast.error("Server not responding. Please check your connection.");
      } else {
        console.log("Request error:", error.message);
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (
      isEditing &&
      window.confirm("Cancel editing? Your changes will be lost.")
    ) {
      resetForm();
    } else if (!isEditing) {
      resetForm();
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
        <div>
          <p className="text-[40px] font-bold">Menu Management</p>
          <p className="font-bold">
            Add, edit, and organize your restaurant's digital offerings.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-6 lg:gap-9">
          <div
            onClick={() => setShowFilterModal(!showFilterModal)}
            className="flex gap-2 items-center border px-2 py-1 rounded-md border-gray-500 cursor-pointer hover:bg-gray-100 relative"
          >
            <FiFilter />
            <p className="font-bold">Filter</p>
            {(selectedCategory !== "all" ||
              selectedStatus !== "all" ||
              priceRange.min ||
              priceRange.max) && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {
                  Object.values({
                    selectedCategory,
                    selectedStatus,
                    priceRange,
                  }).filter((v) => v && v !== "all").length
                }
              </span>
            )}
          </div>
          <div
            onClick={() => navigate("/admin/categories")}
            className="flex gap-2 items-center text-white px-2 py-1 rounded-md border-gray-500 cursor-pointer bg-orange-500"
          >
            <p>+</p>
            <p>Add Category</p>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Filters</h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-bold mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all"
                        ? "All Categories"
                        : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-bold mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  Price Range
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Min Price"
                      className="w-full px-3 py-2 border rounded"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: e.target.value })
                      }
                      min="0"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Max Price"
                      className="w-full px-3 py-2 border rounded"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: e.target.value })
                      }
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-bold mb-2">Sort By</label>
                <div className="flex gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded"
                  >
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="category">Category</option>
                  </select>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Summary */}
              {(selectedCategory !== "all" ||
                selectedStatus !== "all" ||
                priceRange.min ||
                priceRange.max) && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600 font-bold">
                    Active Filters:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedCategory !== "all" && (
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        Category: {selectedCategory}
                        <button
                          onClick={() => setSelectedCategory("all")}
                          className="hover:text-orange-900"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {selectedStatus !== "all" && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        Status: {selectedStatus}
                        <button
                          onClick={() => setSelectedStatus("all")}
                          className="hover:text-blue-900"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {priceRange.min && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        Min: ${priceRange.min}
                        <button
                          onClick={() =>
                            setPriceRange({ ...priceRange, min: "" })
                          }
                          className="hover:text-green-900"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {priceRange.max && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        Max: ${priceRange.max}
                        <button
                          onClick={() =>
                            setPriceRange({ ...priceRange, max: "" })
                          }
                          className="hover:text-green-900"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-4 pt-4 border-t">
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 border rounded hover:bg-gray-100"
                >
                  Reset All
                </button>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="px-6 py-2 border rounded hover:bg-gray-100"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] gap-6 mt-4">
        <div className="shadow-2xl px-4 sm:px-6 rounded-2xl py-6 sm:py-9">
          <div className="flex gap-2 items-center justify-between">
            <div className="flex gap-2 items-center">
              <TbBowlSpoon className="text-orange-600" />
              <p className="font-bold">
                {isEditing ? "Edit Dish" : "Add New Dish"}
              </p>
            </div>
            {isEditing && (
              <button
                onClick={resetForm}
                className="text-sm text-orange-500 hover:text-orange-700"
              >
                Cancel Edit
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-6">
            {isEditing
              ? "Update the details of your menu item"
              : "Enter details to list a new item on the menu"}
          </p>
          <div>
            <form onSubmit={onSubmitHandler}>
              <div className="mb-4">
                <p className="text-sm font-bold mb-2">Product Image</p>
                <label htmlFor="image">
                  <img
                    className="w-40 h-40 object-cover"
                    src={imagePreview || assets.upload_area}
                    alt="Upload"
                  />
                  <input
                    onChange={handleImageChange}
                    type="file"
                    id="image"
                    name="image1"
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
                <input
                  type="text"
                  placeholder="Enter dish name (Amharic)"
                  className="px-3 py-1 mt-2 w-full border rounded"
                  value={nameAm}
                  onChange={(e) => setNameAm(e.target.value)}
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
                    <option value="">Select Category</option>
                    {allCategory &&
                      allCategory.map((item, index) => (
                        <option key={index} value={item.name}>
                          {adminLanguage === "am" ? item.name_am || item.name : item.name_en || item.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <p>Price</p>
                  <input
                    type="number"
                    placeholder="23.90"
                    min="0"
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
                <textarea
                  placeholder="Write description (Amharic) ..."
                  className="w-full border rounded px-3 py-2 mt-2"
                  value={descriptionAm}
                  onChange={(e) => setDescriptionAm(e.target.value)}
                  rows="3"
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
                <p className="text-xs text-gray-500 mt-1">
                  Separate ingredients with commas
                </p>
              </div>

              <div className="mt-3">
                <p>
                  Preparation Time (minutes){" "}
                  <span className="text-red-500">*</span>
                </p>
                <input
                  type="number"
                  placeholder="Enter preparation time in minutes"
                  className="w-full px-3 py-2 mt-2 border rounded"
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(e.target.value)}
                  min="1"
                  step="1"
                  required
                />
              </div>

              <div className="mt-4">
                <p>Food Classifications</p>
                <div className="flex gap-5 mt-3 mb-3">
                  <p
                    onClick={() => setIsFast(true)}
                    className={`px-2 rounded-2xl border-gray-400 cursor-pointer transition-all duration-200 
    ${
      isFast
        ? "bg-orange-600 text-white border-orange-600"
        : "border border-gray-400 hover:bg-gray-100"
    }`}
                  >
                    Fast Food
                  </p>
                  <p
                    onClick={() => setIsFast(false)}
                    className={`px-2 rounded-2xl border-gray-400 cursor-pointer transition-all duration-200 
    ${
      !isFast
        ? "bg-orange-600 text-white border-orange-600"
        : "border border-gray-400 hover:bg-gray-100"
    }`}
                  >
                    Non-Fast Food
                  </p>
                </div>
              </div>

              {/*popular */}

              <div className="border px-3 py-5 rounded-2xl border-gray-300 bg-gray-50 mb-7 mt-4">
                <p className="font-bold">Popular Food</p>
                <div className="flex justify-between gap-5">
                  <div>
                    <p className="text-sm text-gray-700">
                      Make this item visible on the home page popular section
                    </p>
                  </div>
                  <div
                    onClick={() => setPopular((prev) => !prev)}
                    className="bg-orange-600 w-10 h-6 rounded-2xl flex items-center cursor-pointer"
                  >
                    {popular ? (
                      <div className="bg-white w-5 ml-5 rounded-full h-6 border border-orange-600"></div>
                    ) : (
                      <div className="bg-white w-5 rounded-full h-6 border border-orange-600"></div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border px-3 py-5 rounded-2xl border-gray-300 bg-gray-50 mb-7 mt-4">
                <p className="font-bold">Instant Availability</p>
                <div className="flex justify-between gap-5">
                  <div>
                    <p className="text-sm text-gray-700">
                      Make this item visible on the menu immediately
                    </p>
                  </div>
                  <div
                    onClick={() => setMakeVisible((prev) => !prev)}
                    className="bg-orange-600 w-10 h-6 rounded-2xl flex items-center cursor-pointer"
                  >
                    {makeVisible ? (
                      <div className="bg-white w-5 ml-5 rounded-full h-6 border border-orange-600"></div>
                    ) : (
                      <div className="bg-white w-5 rounded-full h-6 border border-orange-600"></div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-around">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-sm border px-14 py-1 rounded-md border-gray-300 cursor-pointer hover:bg-gray-200"
                  disabled={isLoading}
                >
                  {isEditing ? "Cancel" : "Clear"}
                </button>
                <button
                  type="submit"
                  className="text-sm bg-orange-500 text-white hover:bg-orange-600 px-9 py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Saving..."
                    : isEditing
                      ? "Update Product"
                      : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right side - Inventory List */}
        <div>
          <div className="flex justify-between pt-4 ml-9">
            <div>
              <p className="text-3xl font-bold">Inventory List</p>
              <p>Managing items across the category.</p>
              {filteredFoods.length > 0 && searchedQuery && (
                <p className="text-sm text-orange-500">
                  Showing {filteredFoods.length} search results
                </p>
              )}
              <p className="text-sm text-gray-500">
                Total: {foods.length} items
              </p>
            </div>

            <div className="relative">
              <input
                onChange={(e) => setSearchedQuery(e.target.value)}
                value={searchedQuery}
                type="text"
                placeholder="Search Menu..."
                className="px-8 py-2 border rounded pl-8"
              />
              <img
                src={assets.search_icon}
                className="absolute left-2 top-5 transform -translate-y-1/2 w-4 h-4"
                alt="search"
              />
            </div>
          </div>

          <div className="shadow-2xl bg-gray-100">
            <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] ml-6 border-t mt-5 pt-3 border-gray-400">
              <p className="text-lg font-semibold">Image</p>
              <p className="text-lg font-semibold">Product Details</p>
              <p className="text-lg font-semibold">Category</p>
              <p className="text-lg font-semibold">Price</p>
              <p className="text-lg font-semibold">Status</p>
              <p className="text-lg font-semibold">Action</p>
            </div>

            {currentFood && currentFood.length > 0 ? (
              currentFood.map((food, indx) => (
                <div
                  key={indx}
                  className="grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr] ml-6 border-t mt-5 pt-3 border-gray-400 items-center"
                >
                  <img
                    src={
                      food.images?.[0] || food.image?.[0] || assets.upload_area
                    }
                    className="w-15 h-15 object-cover"
                    alt={food.name}
                    onError={(e) => {
                      e.target.src = assets.upload_area;
                    }}
                  />
                  <div>
                    {(() => {
                      const displayName =
                        adminLanguage === "am"
                          ? food.name_am || food.name
                          : food.name_en || food.name;
                      const displayDescription =
                        adminLanguage === "am"
                          ? food.description_am || food.description
                          : food.description_en || food.description;
                      return (
                        <>
                          <p className="font-medium">{displayName}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {displayDescription?.substring(0, 30)}...
                          </p>
                        </>
                      );
                    })()}
                  </div>
                  <p className="capitalize">{food.category}</p>
                  <p className="text-orange-600 font-semibold">
                    {currency}
                    {food.price}
                  </p>
                  <p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        (food.status || "available") === "available"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {food.status || "Available"}
                    </span>
                  </p>
                  <div className="flex gap-4">
                    <FaPencil
                      onClick={() => editFood(food)}
                      className="text-orange-500 cursor-pointer hover:text-orange-700"
                    />
                    <FaTrash
                      onClick={() => deleteAction(food._id)}
                      className="text-orange-500 cursor-pointer hover:text-orange-700"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchedQuery ||
                selectedCategory !== "all" ||
                selectedStatus !== "all" ||
                priceRange.min ||
                priceRange.max
                  ? "No food items found matching your filters"
                  : "No food items available"}
              </div>
            )}

            {currentData.length > productPerPage && (
              <div className="flex justify-between mx-4 border-t py-4 border-gray-400">
                <div className="px-3 text-gray-700">
                  Showing {startIndex + 1} -{" "}
                  {Math.min(startIndex + productPerPage, currentData.length)} of{" "}
                  {currentData.length}
                </div>
                <div className="flex gap-5 mb-7 px-4">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="border px-3 py-1 rounded-md border-gray-400 cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage(page + 1)}
                    className="border px-3 py-1 rounded-md border-gray-400 cursor-pointer hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
