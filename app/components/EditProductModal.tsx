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
}: {
  locale: Locale;
  product: Product;
}) => {
  const t = useTranslations("Merchandise");
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center justify-center w-32 px-4 py-2 bg-gradient-to-r from-gray-300 to-gray-400 border-2  border-yellow-500 text-black  dark:text-white  font-semibold rounded-lg shadow-lg text-sm hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-200"
      >
        <Pencil size={18} className="mr-2" />
        {t("edit_product")}
      </button>

      {isOpen && (
        <EditProductForm
          locale={locale}
          product={product}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default EditProductModal;
