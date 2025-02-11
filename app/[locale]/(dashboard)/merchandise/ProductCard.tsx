"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, Locale } from "@/i18n/routing";
import AddToCartButton from "@/app/components/AddToCart";
import BuyNowButton from "@/app/components/BuyNow";
import EditProductModal from "@/app/components/EditProductModal";
import DeleteProductModal from "@/app/components/DeleteProductConfirm";
import { Product, UserData } from "@/types/api";
import { User } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import EditProductForm from "@/app/components/EditProductForm";

const ProductCard = ({
  product,
  locale,
  userData,
  user,
}: {
  product: Product;
  locale: Locale;
  userData: UserData | null;
  user: User | null;
}) => {
  const t = useTranslations("Merchandise");
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const nextImage = () => {
    if (currentImage < product.images.length - 1) {
      setCurrentImage(currentImage + 1);
    }
  };

  const prevImage = () => {
    if (currentImage > 0) {
      setCurrentImage(currentImage - 1);
    }
  };

  const renderDots = () => {
    const totalImages = product.images.length;
    const maxDots = Math.min(totalImages, 5);
    const dotArray = [];

    let start = Math.max(0, currentImage - Math.floor(maxDots / 2));
    let end = Math.min(totalImages, start + maxDots);

    if (end - start < maxDots) {
      start = Math.max(0, end - maxDots);
    }

    if (totalImages <= 3) {
      start = 0;
      end = totalImages;
    }

    for (let i = start; i < end; i++) {
      let dotSize = "w-2.5 h-2.5";
      let dotColor = "bg-gray-400 border border-gray-600";

      if (i === currentImage) {
        dotSize = "w-3.5 h-3.5";
        dotColor = "bg-white border border-gray-700 shadow-md";
      } else if (Math.abs(i - currentImage) === 1) {
        dotSize = "w-2.5 h-2.5";
        dotColor = "bg-gray-300 border border-gray-500";
      } else {
        dotSize = "w-2 h-2";
        dotColor = "bg-gray-500 border border-gray-700";
      }

      dotArray.push(
        <span
          key={i}
          className={`inline-block rounded-full transition-all ${dotSize} ${dotColor}`}
        />
      );
    }

    return dotArray;
  };

  return (
    <div
      className="relative flex flex-col justify-between bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border-t-4 border-red-600 p-4 rounded-lg shadow-md hover:shadow-xl transition transform duration-300 z-40"
      style={{ minHeight: "500px", display: "flex", flexDirection: "column" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {userData?.is_subscribed &&
        !userData?.end_date &&
        user?.id === product.user_id && (
          <div className="flex flex-row justify-between mb-2">
            <EditProductModal
              product={product}
              locale={locale}
              openModal={openModal}
              closeModal={closeModal}
              isOpen={isOpen}
            />
            <DeleteProductModal product={product} locale={locale} />
          </div>
        )}
      <div className="relative w-full flex justify-center items-center">
        <button
          onClick={prevImage}
          disabled={currentImage === 0}
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition duration-200  ${
            currentImage === 0
              ? "bg-gray-500/40 cursor-not-allowed"
              : "bg-gray-800/70 hover:bg-gray-900/80 text-white"
          } ${isHovered ? "opacity-100" : "opacity-0"} ${
            product.images.length === 1 ? "hidden" : ""
          }`}
        >
          <ChevronLeft size={24} />
        </button>
        <Link
          href={{
            pathname: "/merchandise/[id]",
            params: { id: product.id },
          }}
          className="w-full"
        >
          <div className="w-full cursor-pointer">
            <Image
              src={product.images[currentImage]}
              alt={product[`name_${locale}`]}
              width={180}
              height={180}
              priority
              className="w-full h-[270px] object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md"
            />
          </div>
        </Link>
        <button
          onClick={nextImage}
          disabled={currentImage === product.images.length - 1}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition duration-200 ${
            currentImage === product.images.length - 1
              ? "bg-gray-500/50 cursor-not-allowed"
              : "bg-gray-800/70 hover:bg-gray-900/80 text-white"
          } ${isHovered ? "opacity-100" : "opacity-0"} ${
            product.images.length === 1 ? "hidden" : ""
          }`}
        >
          <ChevronRight size={24} />
        </button>

        {isHovered && product.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
            {renderDots()}
          </div>
        )}
      </div>
      <div className="cursor-pointer flex flex-col items-center my-2">
        <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 hover:text-red-600 transition-colors duration-300">
          {product[`name_${locale}`]}
        </p>
        <div className="mt-1 text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Price: ${product.price / 100}
        </div>
        <div
          className={`text-sm ${
            product.stock > 0 ? "text-green-600" : "text-red-600"
          } mt-1`}
        >
          {product.stock > 0 ? t("in_stock") : t("out_of_stock")}
        </div>
      </div>
      <div className="flex flex-col items-center gap-3 mt-auto">
        <div className="flex justify-center gap-4">
          <AddToCartButton />
          <BuyNowButton />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
