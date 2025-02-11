"use client";
import { useTranslations } from "next-intl";
import { CreditCard } from "lucide-react";

const BuyNowButton = ({ className = "" }: { className?: string }) => {
  const t = useTranslations("Merchandise");

  return (
    <button
      className={`flex items-center justify-center w-32 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-sm font-semibold rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300  active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400 hover:from-amber-500 hover:to-amber-600 ${className}`}
    >
      <span className="absolute inset-0 bg-amber-600 opacity-0 transition-opacity duration-300 hover:opacity-20"></span>
      <CreditCard size={18} className="mr-2 z-10" />
      <span className="z-10">{t("buy_now")}</span>
    </button>
  );
};

export default BuyNowButton;
