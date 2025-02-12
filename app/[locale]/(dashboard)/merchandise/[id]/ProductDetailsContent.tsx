"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Locale } from "@/i18n/routing";
import { Product, Sizes } from "@/types/api";
import AddToCartButton from "@/app/components/AddToCart";
import BuyNowButton from "@/app/components/BuyNow";
import { getSizes } from "@/hooks/getSizes";
import { useTranslations } from "next-intl";

interface ProductDetailsContentProps {
  product: Product;
  logo: string;
  locale: Locale;
}

export default function ProductDetailsContent({
  product,
  logo,
  locale,
}: ProductDetailsContentProps) {
  const t = useTranslations("Merchandise");

  const [currentImage, setCurrentImage] = useState(product.images[0]);
  const [sizeOptions, setSizeOptions] = useState<Sizes | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchSizes = async () => {
      const sizes = await getSizes();
      setSizeOptions(sizes);
    };
    fetchSizes();
  }, []);

  const currentSizeOptions =
    product.category === "shoes"
      ? sizeOptions?.shoes
      : product.category === "headwear"
      ? sizeOptions?.headwear
      : product.category === "accessories"
      ? sizeOptions?.accessories
      : sizeOptions?.clothes;

  return (
    <main className="flex flex-col bg-gray-100 dark:bg-dark py-8 flex-grow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="relative w-full max-w-md">
            <Image
              src={currentImage}
              alt={product[`name_${locale}`]}
              width={600}
              height={400}
              className="w-full h-auto object-cover rounded-xl shadow-lg"
              priority
            />
          </div>

          {product.images.length > 1 && (
            <div className="mt-4 flex gap-2 justify-center">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                    currentImage === img
                      ? "border-red-600 scale-105 shadow-lg"
                      : "border-transparent"
                  }`}
                  onClick={() => setCurrentImage(img)}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    width={80}
                    height={60}
                    className="object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:w-1/2 flex flex-col justify-between gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              {product[`name_${locale}`]}
            </h1>

            <div className="mt-2">
              <span className="text-2xl font-bold text-f1red">
                ${product.price / 100}
              </span>
            </div>

            <div className="mt-4 flex items-center bg-white border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-md">
              {logo && (
                <Image
                  src={logo}
                  alt="Team Logo"
                  width={50}
                  height={50}
                  className="object-contain mr-3"
                />
              )}
              <span className="text-xl font-medium text-gray-900 ">
                {product.team}
              </span>
            </div>

            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {product[`description_${locale}`]}
            </p>

            <div className="mt-4">
              <span className="font-semibold text-lg">{t("sizes")}</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentSizeOptions?.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    disabled={!product.sizes.includes(size)}
                    className={`py-2 px-4 border-2 rounded-md transition-all duration-200 text-sm font-medium 
                   ${
                     selectedSize === size
                       ? "bg-blue-600 text-white border-blue-500 shadow-lg scale-105"
                       : product.sizes.includes(size)
                       ? "bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
                       : "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-500 border-gray-400 dark:border-gray-600 cursor-not-allowed opacity-50"
                   }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="font-semibold text-lg">{t("quantity")}</span>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="p-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-600"
              >
                {[...Array(10).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex gap-4">
              <AddToCartButton className="w-full text-lg font-semibold py-3 rounded-lg  text-white hover:scale-105 transition-transform" />
              <BuyNowButton className="w-full text-lg font-semibold py-3 rounded-lg text-white hover:scale-105 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
