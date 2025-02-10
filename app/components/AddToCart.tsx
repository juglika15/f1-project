"use client";
import { useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";

const AddToCartButton = ({ className = "" }: { className?: string }) => {
  const t = useTranslations("Merchandise");

  return (
    <button
      className={`flex items-center justify-center w-32 px-4 py-2 bg-gradient-to-r from-gray-300 to-gray-400 border-2  border-green-400 text-sm font-semibold rounded-lg shadow-lg hover:from-green-400 text-black dark:text-white  hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 ${className}`}
    >
      <ShoppingCart size={18} className="mr-2" />
      {t("add_to_cart")}
    </button>
  );
};

export default AddToCartButton;
