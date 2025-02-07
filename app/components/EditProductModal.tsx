"use client";

import { useState } from "react";
import { Locale } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import EditProductForm from "./EditProductForm";
import { Product } from "@/types/api";

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
        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg shadow-lg hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
      >
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
