"use client";

import { Locale } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Product } from "@/types/api";
import { Pencil } from "lucide-react";
import { useState } from "react";
import UpdateProductForm from "./UpdateProductForm";

const UpdateProductModal = ({
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
        className="flex items-center text-emerald-600 
        transition-all duration-300 ease-out
        hover:scale-110  hover:text-white
        active:scale-95 active:shadow-inner hover:bg-gradient-to-t hover:from-emerald-500 hover:to-emerald-600 px-3 py-1 rounded-lg ml-2"
      >
        <Pencil size={15} className="mr-1" />
        <span>{t("update_product")}</span>
      </button>

      {isOpen && (
        <UpdateProductForm
          locale={locale}
          product={product}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default UpdateProductModal;
