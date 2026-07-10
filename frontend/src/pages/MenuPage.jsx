import React, { useContext } from "react";
import Menu from "../components/Menu";
import Search from "../components/Search";
import { AppContext } from "../context/AppContext";

const MenuPage = () => {
  const { showSearch } = useContext(AppContext);

  return (
    <main className="bg-slate-50 pt-8 sm:pt-10">
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        {showSearch && (
          <div className="mt-8 sm:mt-10">
            <Search />
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] bg-white px-4 py-6 shadow-lg shadow-slate-200/80 sm:px-6 sm:py-8">
          <Menu />
        </div>
      </section>
    </main>
  );
};

export default MenuPage;
