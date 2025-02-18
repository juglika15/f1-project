"use client";

import { useState } from "react";
import AddProductForm from "./AddProductForm";
import { Locale } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const AddProductModal = ({ locale }: { locale: Locale }) => {
  const t = useTranslations("Merchandise");
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="p-4 w-64 text-lg py-2 bg-f1red text-white rounded hover:bg-red-700 transition"
      >
        {t("add_product")}
      </button>

      {isOpen && <AddProductForm locale={locale} onClose={closeModal} />}
    </>
  );
};

export default AddProductModal;
