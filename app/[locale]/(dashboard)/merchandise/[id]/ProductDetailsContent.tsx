"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Locale } from "@/i18n/routing";
import { Product, Sizes } from "@/types/api";
import BuyNowButton from "@/app/components/BuyNow";
import { getSizes } from "@/hooks/getSizes";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { addToCart } from "@/app/actions/addProductToCart";
import { ShoppingCart } from "lucide-react";
import { getUserAction } from "@/app/actions/supabase";

interface ProductDetailsContentProps {
  product: Product;
  logo: string;
  locale: Locale;
}

type GlobalMessageType = "success" | "error" | "info";

export default function ProductDetailsContent({
  product,
  logo,
  locale,
}: ProductDetailsContentProps) {
  const t = useTranslations("Merchandise");

  const [currentImage, setCurrentImage] = useState(product.images[0]);
  const [sizeOptions, setSizeOptions] = useState<Sizes | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");

  const [globalMsg, setGlobalMsg] = useState<{
    message: string;
    type: GlobalMessageType;
  }>({
    message: "",
    type: "info",
  });

  useEffect(() => {
    const fetchSizes = async () => {
      const sizes = await getSizes();
      setSizeOptions(sizes);
    };
    fetchSizes();
  }, []);

  useEffect(() => {
    if (globalMsg.message) {
      const timer = setTimeout(() => {
        setGlobalMsg({ message: "", type: "info" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [globalMsg]);

  const productSchema = z.object({
    productSize: z.string().min(1, { message: t("sizes_required") }),
  });
  const [sizeError, setFieldError] = useState<{
    productSize?: string | string[];
  }>({});

  const addToCartHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const payload = {
      ...product,
      productSize: selectedSize,
    };

    setFieldError({});

    const validationResult = productSchema.safeParse(payload);
    if (!validationResult.success) {
      setFieldError(validationResult.error.flatten().fieldErrors);
      return;
    }

    try {
      const user = await getUserAction();
      if (!user) {
        setGlobalMsg({
          message: "Please log in to add items to your cart.",
          type: "error",
        });
        return;
      }
      console.log(product, selectedSize, quantity);
      await addToCart(product, selectedSize, quantity);
      setGlobalMsg({
        message: "Product added to cart successfully!",
        type: "success",
      });
      setSelectedSize("");
      setQuantity(1);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setGlobalMsg({ message: "Error adding product to cart.", type: "error" });
    }
  };

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
          <div className="relative w-full h-auto max-w-md">
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
                  className={`cursor-pointer border-2 w-20 h-auto rounded-lg overflow-hidden transition-all ${
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
                    className="w-full h-auto object-cover rounded-md"
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
              {sizeError.productSize && (
                <span className="text-sm text-red-500">
                  {sizeError.productSize}
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="font-semibold text-lg">{t("quantity")}</span>
              <select
                id="quantity"
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
              <button
                className="flex items-center justify-center px-3 py-3 bg-gradient-to-r from-teal-400 to-teal-500 text-white font-semibold rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-400 hover:from-teal-500 hover:to-teal-600 w-full text-lg hover:scale-105"
                onClick={addToCartHandler}
              >
                <span className="absolute inset-0 bg-teal-600 opacity-0 transition-opacity duration-300 hover:opacity-20"></span>
                <ShoppingCart size={18} className="mr-2 z-10" />
                <span className="z-10">{t("add_to_cart")}</span>
              </button>
              <BuyNowButton className="w-full text-lg font-semibold py-3 rounded-lg text-white hover:scale-105 transition-transform" />
            </div>
          </div>
          {globalMsg.message && (
            <div
              className={` transform -translate-x-1/2 px-4 py-2 rounded-md text-sm shadow-md ${
                globalMsg.type === "success"
                  ? "bg-green-500 text-white"
                  : globalMsg.type === "error"
                  ? "bg-red-500 text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              {globalMsg.message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
