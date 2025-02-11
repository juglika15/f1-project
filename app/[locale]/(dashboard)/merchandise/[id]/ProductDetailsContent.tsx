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

  useEffect(() => {
    const setSizes = async () => {
      const sizes = await getSizes();
      setSizeOptions(sizes);
    };
    setSizes();
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
    <main className="flex flex-col bg-gray-100 dark:bg-gray-900 py-8 flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="w-full relative">
            <Image
              src={currentImage}
              alt={product[`name_${locale}`]}
              width={600}
              height={400}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-2 justify-center">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border-2 rounded ${
                    currentImage === img
                      ? "border-red-600"
                      : "border-transparent"
                  }`}
                  onClick={() => setCurrentImage(img)}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    width={100}
                    height={70}
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              {product[`name_${locale}`]}
            </h1>
            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
              {product[`description_${locale}`]}
            </p>
            <div className="mt-4">
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                ${product.price / 100}
              </span>
            </div>

            <div className="mt-4 flex items-center bg-white  border border-gray-200 dark:border-gray-700   rounded-lg p-4">
              {logo && (
                <Image
                  src={logo}
                  alt="Team Logo"
                  width={50}
                  height={50}
                  className="object-contain mr-2"
                />
              )}
              <span className="text-xl font-medium text-gray-800 ">
                {product.team}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm">{t("sizes")}</span>
              <div className="flex flex-wrap gap-1">
                {product.category === "accessories" ? (
                  <div className="pl-5 w-32 py-1 border rounded-md bg-blue-600 text-white border-blue-500">
                    {sizeOptions?.accessories[0]}
                  </div>
                ) : (
                  currentSizeOptions?.map((size) => (
                    <button
                      key={size}
                      type="button"
                      //   onClick={() => toggleSize(size)}
                      className={`py-1 border-2 rounded-md transition-colors duration-200 hover:bg-blue-600 hover:text-white hover:border-blue-500  ${
                        product.category === "headwear"
                          ? "w-[8.15rem]"
                          : product.category === "shoes"
                          ? "w-[4.8rem]"
                          : "w-[2.9rem]"
                      } ${
                        false
                          ? "bg-blue-600 text-white border-blue-500"
                          : "bg-white text-gray-800 border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))
                )}
              </div>
              {/* {fieldErrors.productSizes && (
                <span className="text-sm text-red-500">
                  {fieldErrors.productSizes}
                </span>
              )} */}
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <AddToCartButton className="w-full from-green-500 to-green-600" />
            <BuyNowButton className="w-full from-cyan-500 to-cyan-600" />
          </div>
        </div>
      </div>
    </main>
  );
}
