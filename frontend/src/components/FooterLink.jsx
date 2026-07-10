import React from "react";
import { assets, footerLinks } from "../assets/assets/assets";
import { FaStar } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";

const FooterLink = () => {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:gap-10 grid-cols-2 lg:grid-cols-6">
          <div className="col-span-2 space-y-6 lg:col-span-1">
            <div className="flex justify-center md:justify-start">
              <img
                src={assets.logo}
                alt="Digital Menu logo"
                className="h-12 w-auto"
              />
            </div>
            <p className="max-w-sm text-sm leading-7 text-slate-300">
              Elevating your dining experience with seamless digital ordering
              and gourmet selection.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              {["Facebook", "Instagram", "Twitter"].map((network) => (
                <button
                  key={network}
                  className="rounded-full border border-slate-700 px-3 py-2 transition hover:border-amber-500 hover:text-amber-400"
                >
                  {network}
                </button>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">
                {group.title}
              </p>
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                {group.links.map((link) => (
                  <a
                    key={link.text}
                    href={link.url}
                    className="block transition hover:text-amber-400"
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">
              Contact Us
            </p>
            <div className="space-y-4 text-slate-300">
              <div className="flex gap-4">
                <FaLocationDot className="mt-1 text-amber-400" />
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
                    Our location
                  </p>
                  <p className="text-sm">Bahir Dar, Tana</p>
                </div>
              </div>
              <div className="flex gap-4">
                <FaClock className="mt-1 text-amber-400" />
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
                    Business hours
                  </p>
                  <p className="text-sm">Mon - Sun · 8:00am - 10:00pm</p>
                </div>
              </div>
              <div className="flex gap-4">
                <FaStar className="mt-1 text-amber-400" />
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
                    Contact
                  </p>
                  <p className="text-sm">+251 973 769 266</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 space-y-6 lg:col-span-1">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">
              Newsletter
            </p>
            <p className="text-sm leading-7 text-slate-300">
              Subscribe for exclusive offers and updates.
            </p>
            <form className="space-y-4">
              <label className="sr-only" htmlFor="footer-email">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Email address"
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
              />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-500"
              >
                Join now
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex sm:items-center sm:justify-between">
          <p>© 2026 Digital Menu. All rights reserved.</p>
          <p>Built for fast orders and tasty moments.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterLink;
