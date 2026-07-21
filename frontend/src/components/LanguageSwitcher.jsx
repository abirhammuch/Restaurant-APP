import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const LanguageSwitcher = () => {
  const { language, changeLanguage, currencyType, changeCurrency, t } =
    useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 transition-all duration-300"
      >
        <span className="text-xl">🌐</span>
        <span className="text-sm font-medium hidden sm:inline">
          {language === "en" ? "EN" : "AM"} / {currencyType}
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          {/* Language Section */}
          <div className="border-b border-gray-200 p-3">
            <p className="text-xs font-semibold text-gray-600 mb-2">
              {t("language")}
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                <input
                  type="radio"
                  name="language"
                  value="en"
                  checked={language === "en"}
                  onChange={() => changeLanguage("en")}
                  className="w-4 h-4 text-amber-600"
                />
                <span className="text-sm text-gray-700">{t("english")}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                <input
                  type="radio"
                  name="language"
                  value="am"
                  checked={language === "am"}
                  onChange={() => changeLanguage("am")}
                  className="w-4 h-4 text-amber-600"
                />
                <span className="text-sm text-gray-700">{t("amharic")}</span>
              </label>
            </div>
          </div>

          {/* Currency Section */}
          <div className="p-3">
            <p className="text-xs font-semibold text-gray-600 mb-2">
              {t("currency")}
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                <input
                  type="radio"
                  name="currency"
                  value="USD"
                  checked={currencyType === "USD"}
                  onChange={() => changeCurrency("USD")}
                  className="w-4 h-4 text-amber-600"
                />
                <span className="text-sm text-gray-700">{t("usd")}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                <input
                  type="radio"
                  name="currency"
                  value="ETB"
                  checked={currencyType === "ETB"}
                  onChange={() => changeCurrency("ETB")}
                  className="w-4 h-4 text-amber-600"
                />
                <span className="text-sm text-gray-700">{t("etb")}</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
