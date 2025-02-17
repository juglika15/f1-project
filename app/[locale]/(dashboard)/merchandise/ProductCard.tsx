"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link, Locale } from "@/i18n/routing";
// import AddToCartButton from "@/app/components/AddToCart";
// import BuyNowButton from "@/app/components/BuyNow";
import DeleteProductModal from "@/app/components/DeleteProductConfirm";
import { Product, UserData } from "@/types/api";
import { User } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import EditProductModal from "@/app/components/EditProductModal";

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

  const nextImage = () => {
    setCurrentImage((currentImage + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (currentImage - 1 + product.images.length) % product.images.length
    );
  };

  const segmentPercentage = 100 / product.images.length;

  return (
    <div className="relative flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 border-t-4 border-red-600 py-2 rounded-lg shadow-md hover:shadow-xl transition duration-300 min-h-[400px] sm:min-h-[500px]">
      {userData?.is_subscribed &&
        !userData?.end_date &&
        user?.id === product.user_id && (
          <div className="flex flex-row justify-between mb-2">
            <EditProductModal product={product} locale={locale} />
            <DeleteProductModal product={product} locale={locale} />
          </div>
        )}

      <div
        className="relative w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="overflow-hidden relative">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentImage * 100}%)` }}
          >
            {product.images.map((img, index) => (
              <div
                key={index}
                className="relative min-w-full h-64 sm:h-72 md:h-80 lg:h-96"
              >
                <Link
                  href={{
                    pathname: "/merchandise/[id]",
                    params: { id: product.id },
                  }}
                  className="relative block w-full h-full cursor-pointer"
                >
                  <Image
                    src={img}
                    alt={product[`name_${locale}`]}
                    fill
                    quality={100}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover shadow-md"
                  />
                </Link>
              </div>
            ))}
          </div>
          {isHovered && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white">
              <div
                className="absolute h-full bg-red-600 transition-all duration-500"
                style={{
                  left: `${currentImage * segmentPercentage}%`,
                  width: `${segmentPercentage}%`,
                }}
              ></div>
            </div>
          )}
        </div>
        <button
          onClick={prevImage}
          className={`absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          } bg-gray-800/70 hover:bg-gray-900/80 text-white`}
        >
          <ChevronLeft size={17} />
        </button>
        <button
          onClick={nextImage}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          } bg-gray-800/70 hover:bg-gray-900/80 text-white`}
        >
          <ChevronRight size={17} />
        </button>
      </div>

      <div className="flex flex-col  my-1 ml-1">
        <Link
          href={{
            pathname: "/merchandise/[id]",
            params: { id: product.id },
          }}
          className="cursor-pointer text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 hover:text-red-600 transition-colors duration-300"
        >
          {product[`name_${locale}`]}
        </Link>
        <div className="mt-1 text-base  text-gray-600 dark:text-gray-400">
          {t("price")}: ${product.price / 100}
        </div>
        <div
          className={`text-sm ${
            product.stock > 0 ? "text-green-600" : "text-red-600"
          } mt-1`}
        >
          {product.stock > 0 ? t("in_stock") : t("out_of_stock")}
        </div>
        <Link
          href={{
            pathname: "/merchandise/[id]",
            params: { id: product.id },
          }}
          className="cursor-pointer text-sm mt-1 underline"
        >
          {t("shop")}
        </Link>
      </div>

      {/* <div className="flex flex-col items-center gap-3 mt-auto">
        <div className="flex justify-center gap-4">
          <AddToCartButton />
          <BuyNowButton />
        </div>
      </div> */}
    </div>
  );
};

export default ProductCard;
