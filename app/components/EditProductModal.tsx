"use client";

import { useState } from "react";
import { Locale } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import EditProductForm from "./EditProductForm";
import { Product } from "@/types/api";
import { Pencil } from "lucide-react";

const EditProductModal = ({
  locale,
  product,
  isOpen,
  openModal,
}: {
  locale: Locale;
  product: Product;
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}) => {
  const t = useTranslations("Merchandise");

  return (
    <button
      onClick={openModal}
      className="flex items-center text-emerald-600 
        transition-all duration-300 ease-out
        hover:scale-110  hover:text-white
        active:scale-95 active:shadow-inner hover:bg-gradient-to-t hover:from-emerald-500 hover:to-emerald-600 px-3 py-1 rounded-lg"
    >
      <Pencil size={16} className="mr-2" />
      <span>{t("edit_product")}</span>
    </button>
  );
};

export default EditProductModal;
