"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Link, Locale } from "@/i18n/routing";
import { Product, Sizes } from "@/types/api";
import BuyNowButton from "@/app/components/BuyNow";
import { getSizes } from "@/hooks/getSizes";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { addToCart } from "@/app/actions/addProductToCart";
import { ShoppingCart } from "lucide-react";
import { getUserAction } from "@/app/actions/supabase";
import getMerchByTeam from "@/hooks/getMerchByTeam";

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
  const [isSticky, setIsSticky] = useState(false);
  const [teamProducts, setTeamProducts] = useState<Product[] | null>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const stickyTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSizes = async () => {
      const sizes = await getSizes();
      setSizeOptions(sizes);
    };
    fetchSizes();
  }, []);

  useEffect(() => {
    const fetchTeamProducts = async () => {
      const products = await getMerchByTeam(product.team, product.id);
      setTeamProducts(products);
    };
    fetchTeamProducts();
  }, [product.team, product.id]);

  useEffect(() => {
    if (globalMsg.message) {
      const timer = setTimeout(
        () => setGlobalMsg({ message: "", type: "info" }),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [globalMsg]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 1.0 }
    );
    if (stickyTriggerRef.current) {
      observer.observe(stickyTriggerRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  const productSchema = z.object({
    productSize: z.string().min(1, { message: t("sizes_required") }),
  });
  const [sizeError, setFieldError] = useState<{
    productSize?: string | string[];
  }>({});

  const addToCartHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const payload = { ...product, productSize: selectedSize };

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
        {/* LEFT SIDE: Image slider */}
        <div className="md:w-1/2">
          <div ref={stickyTriggerRef} className="h-1 w-full"></div>
          <div className="flex flex-col items-center">
            {/* Carousel Container */}
            <div className="relative w-full h-auto max-w-md overflow-hidden rounded-xl shadow-lg">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentImageIndex * 100}%)`,
                }}
              >
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative min-w-full h-64 sm:h-72 md:h-96 lg:h-[40rem]"
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
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-2 justify-center">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer border-2 w-20 rounded-lg overflow-hidden transition-all duration-300 ${
                      currentImageIndex === index
                        ? "border-red-600 scale-105 shadow-lg"
                        : "border-transparent hover:scale-105"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
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
        </div>

        {/* RIGHT SIDE: Sticky details panel */}
        <div className="md:w-1/2 flex flex-col gap-6 sticky top-8">
          <div
            className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 ${
              isSticky ? "shadow-2xl" : ""
            }`}
          >
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
              <span className="text-xl font-medium text-gray-900">
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
              className={`transform -translate-x-1/2 px-4 py-2 rounded-md text-sm shadow-md ${
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
      {/* BOTTOM: "You May Also Like" section */}
      <div className="mt-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
          {teamProducts?.map((teamProduct) => (
            <div key={teamProduct.id} className="relative group">
              <div className="overflow-hidden ">
                <div className="flex transition-transform duration-500 ease-in-out">
                  <div className="relative min-w-full h-64 sm:h-72 md:h-80 lg:h-96">
                    <Link
                      href={{
                        pathname: "/merchandise/[id]",
                        params: { id: teamProduct.id },
                      }}
                      className="relative block w-full h-full cursor-pointer"
                    >
                      <Image
                        src={teamProduct.images[0]}
                        alt={teamProduct[`name_${locale}`]}
                        fill
                        quality={100}
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover shadow-md transition-opacity duration-500 group-hover:opacity-0"
                      />
                      <Image
                        src={teamProduct.images[1]}
                        alt={teamProduct[`name_${locale}`]}
                        fill
                        quality={100}
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover shadow-md absolute top-0 left-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                      />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex flex-col  my-1 ml-1">
                <Link
                  href={{
                    pathname: "/merchandise/[id]",
                    params: { id: teamProduct.id },
                  }}
                  className="cursor-pointer text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 hover:text-red-600 transition-colors duration-300"
                >
                  {teamProduct[`name_${locale}`]}
                </Link>
                <div className="mt-1 text-base  text-gray-600 dark:text-gray-400">
                  {t("price")}: ${teamProduct.price / 100}
                </div>

                <Link
                  href={{
                    pathname: "/merchandise/[id]",
                    params: { id: teamProduct.id },
                  }}
                  className="cursor-pointer text-sm mt-1 underline"
                >
                  {t("shop")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
