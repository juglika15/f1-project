"use client";

import { useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";

const AddToCartButton = ({ className = "" }) => {
  const t = useTranslations("Merchandise");

  return (
    <button
      className={`flex items-center justify-center w-[7.5rem] px-3 py-3 bg-gradient-to-r from-teal-400 to-teal-500 text-white text-sm font-semibold rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300  active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-400 hover:from-teal-500 hover:to-teal-600 ${className}`}
    >
      <span className="absolute inset-0 bg-teal-600 opacity-0 transition-opacity duration-300 hover:opacity-20"></span>
      <ShoppingCart size={18} className="mr-2 z-10" />
      <span className="z-10">{t("add_to_cart")}</span>
    </button>
  );
};

export default AddToCartButton;
