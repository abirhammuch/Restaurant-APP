import { FaArrowRight } from "react-icons/fa";
import React from "react";

const More = ({ text, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-amber-600 transition hover:bg-amber-50 hover:text-amber-700"
    >
      <span>{text}</span>
      <FaArrowRight className="transition-transform duration-200" />
    </button>
  );
};

export default More;
