import React from "react";
import { FaArrowLeft } from "react-icons/fa6";

const Less = ({ text, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-amber-600 transition hover:bg-amber-50 hover:text-amber-700"
    >
      <FaArrowLeft className="transition-transform duration-200" />
      <span>{text}</span>
    </button>
  );
};

export default Less;
