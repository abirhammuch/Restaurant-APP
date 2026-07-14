import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import Menu from "../components/Menu";
import Search from "../components/Search";
import { AppContext } from "../context/AppContext";

const MenuPage = () => {
  const { showSearch } = useContext(AppContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tableNumber = searchParams.get("table");

  return (
    <main className="bg-slate-50 pt-8 sm:pt-10">
      {tableNumber && (
        <section className="mx-auto mb-6 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 shadow-sm">
            <p className="font-semibold">Ordering for Table {tableNumber}</p>
            <p className="text-sm">
              You are now viewing the menu for this table. Add your items and
              place the order.
            </p>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        {showSearch && (
          <div className="mt-8 sm:mt-10">
            <Search />
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-4xl bg-white px-4 py-6 shadow-lg shadow-slate-200/80 sm:px-6 sm:py-8">
          <Menu />
        </div>
      </section>
    </main>
  );
};

export default MenuPage;
