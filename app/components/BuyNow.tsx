"use client";
import { useTranslations } from "next-intl";
import { CreditCard } from "lucide-react";

const BuyNowButton = ({ className = "" }: { className?: string }) => {
  const t = useTranslations("Merchandise");

  return (
    <button
      className={`flex items-center justify-center w-32 px-4 py-2 bg-gradient-to-r from-gray-300 to-gray-400 border-2  border-cyan-500 text-sm font-semibold rounded-lg shadow-lg hover:from-cyan-400 text-black  dark:text-white hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200 ${className}`}
    >
      <CreditCard size={18} className="mr-2" />
      {t("buy_now")}
    </button>
  );
};

export default BuyNowButton;
