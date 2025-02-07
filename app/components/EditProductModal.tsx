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
        className="p-4 w-32 text-lg py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700 transition"
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
