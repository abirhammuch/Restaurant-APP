import { NavLink } from "react-router-dom";
import { FaHome, FaSignOutAlt, FaStar, FaStore } from "react-icons/fa";
import { MdDashboard, MdRestaurantMenu } from "react-icons/md";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-3 transition ${
    isActive
      ? "bg-[#9d4e1e] font-semibold text-white"
      : "text-gray-300 hover:bg-white/10 hover:text-white"
  }`;

const KitchenSidebar = () => {
  const { navigate } = useContext(AppContext);

  const logout = () => {
    localStorage.removeItem("kitchentoken");
    navigate("/kitchen/login", { replace: true });
  };

  return (
    <aside className="hidden w-52.5 shrink-0 flex-col justify-between bg-[#17130f] px-4 py-7 text-white lg:flex">
      <div>
        <div className="mb-12 flex items-center gap-2 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e87a22] text-xl">
            <FaStore />
          </div>
          <div>
            <p className="font-bold tracking-wide">Tana Cafe</p>
            <p className="text-[9px] text-gray-400">Good Food · Better Mood</p>
          </div>
        </div>
        <nav className="space-y-3 text-sm">
          <NavLink to="/kitchen/dashboard" className={linkClass}>
            <FaHome /> Dashboard
          </NavLink>
          <NavLink to="/kitchen" end className={linkClass}>
            <MdDashboard /> Orders
          </NavLink>
          <NavLink to="/kitchen/reviews" className={linkClass}>
            <FaStar /> Reviews
          </NavLink>
          <NavLink to="/kitchen/menu" className={linkClass}>
            <MdRestaurantMenu /> Menu
          </NavLink>
        </nav>
      </div>
      <div>
        <div className="mb-5 px-3 text-center font-serif italic text-[#c87839]">
          Great Food
          <br />
          Great Vibes
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-300 transition hover:bg-red-900/40 hover:text-white"
        >
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default KitchenSidebar;
