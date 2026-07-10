import React, { useContext } from "react";
import { FaArrowRight } from "react-icons/fa";
import { AppContext } from "../context/AppContext";

const ReadyToOrder = () => {
  const { navigate } = useContext(AppContext);

  return (
    <section className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-[2fr_1fr] items-center">
          <div className="space-y-4">
            <span className="inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
              Ready to order
            </span>
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
              Your next meal is just a click away.
            </h2>
            <p className="max-w-xl text-sm leading-6 text-white/90">
              Browse our chef-curated menu, discover favorites, and place your
              order in seconds.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/menu")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Order Now
                <FaArrowRight className="text-lg" />
              </button>
              <span className="rounded-full border border-white/30 bg-white/10 px-4 py-3 text-sm text-white/90">
                Free delivery on orders over $25
              </span>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/15 bg-white/10 p-5 shadow-2xl ring-1 ring-white/10 backdrop-blur-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-3xl bg-white/10 p-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-amber-200">
                  <FaArrowRight />
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-white/70">
                    Quick & easy
                  </p>
                  <p className="text-base font-semibold text-white">
                    Choose meals in seconds
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="rounded-3xl bg-white/10 p-4 text-sm text-white/80">
                  Best sellers picked daily for every craving.
                </div>
                <div className="rounded-3xl bg-white/10 p-4 text-sm text-white/80">
                  Secure checkout and fast confirmation.
                </div>
                <div className="rounded-3xl bg-white/10 p-4 text-sm text-white/80">
                  Track your order from kitchen to table.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadyToOrder;
