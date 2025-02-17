"use client";

import { useCallback, useState, useTransition, useEffect, useRef } from "react";
import { deleteProduct } from "../actions/deleteProduct";
import { Product } from "@/types/api";
import { Locale } from "@/i18n/routing";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";

interface DeleteProductModalProps {
  product: Product;
  onDeleted?: () => void;
  locale: Locale;
}

export default function DeleteProductModal({
  product,
  onDeleted,
  locale,
}: DeleteProductModalProps) {
  const t = useTranslations("ProductForm");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleClose = useCallback(() => {
    setIsOpen(false);
    router.refresh();
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteProduct(product.stripe_product_id);
        setSuccess(true);
        setError(null);
        setTimeout(() => {
          handleClose();
          if (onDeleted) onDeleted();
        }, 750);
      } catch (err) {
        console.error("Error deleting product:", err);
        setError("Failed to delete product. Please try again.");
      }
    });
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          setSuccess(false);
          setError(null);
        }}
        className="flex items-center text-red-600
        transition-all duration-300 ease-out
        hover:scale-110  hover:text-white
        active:scale-95 active:shadow-inner hover:bg-gradient-to-t hover:from-red-500
      hover:to-red-600 px-2 rounded-lg mr-2"
      >
        <Trash2 size={16.5} className="mr-1" />
        <span>{t("delete")}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50 transition-opacity duration-300">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100"
          >
            <div className="flex flex-col items-center">
              <Image
                src={product.images[0]}
                alt={product[`name_${locale}`]}
                width={128}
                height={120}
                className="w-32 h-32 object-cover p-2  border-4 border-grey-600"
              />
              <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
                {product[`name_${locale}`]}
              </h2>
              <p className="mt-2 text-xl text-gray-600 dark:text-gray-300">
                ${(product.price / 100).toFixed(2)}
              </p>
            </div>

            {success ? (
              <p className="mt-4 text-center text-green-600 font-medium">
                {t("deleted")}
              </p>
            ) : (
              <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
                {t("deleteConfirmation")}
              </p>
            )}

            {error && (
              <p className="mt-2 text-center text-red-600 font-medium">
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleClose}
                className="px-5 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-300"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending || success}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors duration-300"
              >
                {isPending ? t("deleting") : t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
