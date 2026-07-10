import React, { useContext } from "react";
import Menu from "../components/Menu";
import Search from "../components/Search";
import { AppContext } from "../context/AppContext";

const MenuPage = () => {
  const { showSearch } = useContext(AppContext);

  return (
    <main className="bg-slate-50 pt-8 sm:pt-10">
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[40px] bg-gradient-to-r from-amber-500 via-orange-400 to-rose-500 p-6 text-white shadow-2xl shadow-amber-500/20 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr] lg:items-center">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.36em] text-white/80">
                Featured Menu
              </p>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                Discover your next favorite dish.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-white/90 sm:text-base">
                Explore our curated selection of meals, from chef specials to
                best-selling comfort foods. Order in just a few clicks and enjoy
                delivery fast.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Fresh Picks", value: "Daily updated" },
                  { label: "Fast delivery", value: "Under 30 min" },
                  { label: "Top-rated", value: "Customer favorites" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl bg-white/15 px-4 py-3"
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-white/70">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[30px] border border-white/20 bg-white/10 p-6 shadow-xl shadow-black/10 backdrop-blur-sm">
              <div className="space-y-5">
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-white/70">
                    Chef tip
                  </p>
                  <p className="mt-3 text-base font-semibold text-white">
                    Try our spicy honey glazed chicken with a side of zesty
                    coleslaw.
                  </p>
                </div>
                <div className="grid gap-3 text-white/90 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="text-sm font-semibold">Limited time offer</p>
                    <p className="text-xs text-white/70">
                      20% off on selected meals
                    </p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="text-sm font-semibold">Easy search</p>
                    <p className="text-xs text-white/70">
                      Find dishes by name or category
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
