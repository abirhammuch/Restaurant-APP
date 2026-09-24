import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaClock, FaSearch, FaUtensils } from "react-icons/fa";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import KitchenSidebar from "./KitchenSidebar";

const KitchenMenu = () => {
  const { backendUrl } = useContext(AppContext);
  const [foods, setFoods] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const fetchFoods = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/food/list`);
      if (response.data.success) setFoods(response.data.foods || []);
      else toast.error(response.data.message || "Unable to load menu");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load menu");
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    const initialFetch = setTimeout(fetchFoods, 0);
    return () => clearTimeout(initialFetch);
  }, [fetchFoods]);

  const categories = useMemo(
    () => [
      "all",
      ...new Set(foods.map((food) => food.category).filter(Boolean)),
    ],
    [foods],
  );

  const filteredFoods = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return foods.filter((food) => {
      const matchesCategory = category === "all" || food.category === category;
      const matchesQuery =
        !normalizedQuery ||
        [food.name, food.name_en, food.description, food.category]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesCategory && matchesQuery;
    });
  }, [foods, query, category]);

  const totalPages = Math.max(1, Math.ceil(filteredFoods.length / pageSize));
  const paginatedFoods = filteredFoods.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const changeQuery = (value) => {
    setQuery(value);
    setPage(1);
  };

  const changeCategory = (value) => {
    setCategory(value);
    setPage(1);
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] text-[#10233f]">
      <KitchenSidebar />
      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Menu
          </h1>
          <p className="mt-1 text-sm text-[#49617f]">
            View available food and preparation details.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row">
          <label className="relative block flex-1">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              value={query}
              onChange={(event) => changeQuery(event.target.value)}
              placeholder="Search food or category..."
              className="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-orange-500"
            />
          </label>
          <select
            value={category}
            onChange={(event) => changeCategory(event.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-orange-500 sm:min-w-48"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All categories" : item}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white px-5 py-14 text-center text-sm text-gray-500">
            Loading menu...
          </div>
        ) : filteredFoods.length ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {paginatedFoods.map((food) => (
                <article
                  key={food._id || food.name}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="h-40 bg-orange-50">
                    {food.images?.[0] ? (
                      <img
                        src={food.images[0]}
                        alt={food.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl text-orange-300">
                        <FaUtensils />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-bold text-[#10233f]">
                        {food.name || food.name_en || "Menu item"}
                      </h2>
                      <span className="whitespace-nowrap font-bold text-orange-600">
                        ETB {Number(food.price || 0).toFixed(2)}
                      </span>
                    </div>
                    <p className="mt-2 min-h-10 text-sm text-gray-500">
                      {food.description ||
                        food.description_en ||
                        "No description available."}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">
                        {food.category || "Uncategorized"}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <FaClock /> {food.preparationTime || "--"} min
                      </span>
                    </div>
                    <div className="mt-3 border-t border-gray-100 pt-3 text-xs font-semibold">
                      <span
                        className={
                          food.status === "unavailable"
                            ? "text-red-600"
                            : "text-emerald-600"
                        }
                      >
                        {food.status === "unavailable"
                          ? "Unavailable"
                          : "Available"}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
                  Showing {(page - 1) * pageSize + 1}–
                  {Math.min(page * pageSize, filteredFoods.length)} of{" "}
                  {filteredFoods.length} menu items
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((currentPage) => currentPage - 1)}
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="px-2 py-1.5 text-sm text-gray-500">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((currentPage) => currentPage + 1)}
                    className="rounded-md bg-orange-500 px-3 py-1.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl bg-white px-5 py-14 text-center text-sm text-gray-500">
            No menu items match your search.
          </div>
        )}
      </main>
    </div>
  );
};

export default KitchenMenu;
