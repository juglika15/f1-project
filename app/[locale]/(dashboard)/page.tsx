"use client";

import getNewest from "@/hooks/getNewest";
import { Link, Locale } from "@/i18n/routing";
import { Product } from "@/types/api";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("en");
  const params = useParams() as { locale: Locale };
  const t = useTranslations("HomePage");

  const images = [
    "https://mincpqoaeqklbiwyayuw.supabase.co/storage/v1/object/public/f1/catalogue/pexels-jonathanborba-29406740.jpg",
    "https://mincpqoaeqklbiwyayuw.supabase.co/storage/v1/object/public/f1/catalogue/e9j4wysieac61.webp",
    "https://mincpqoaeqklbiwyayuw.supabase.co/storage/v1/object/public/f1/catalogue/nicholas-latifi-making-a-splash-in-his-williams-racing-fw44-v0-vd07bmfadzj81.webp",
    "https://mincpqoaeqklbiwyayuw.supabase.co/storage/v1/object/public/f1/catalogue/fRdKRUFoq7ZSVVvbRpPrqA.jpg",
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newestProduct, setNewestProduct] = useState<Product[] | null>(null);

  useEffect(() => {
    setLocale(params?.locale);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length, params?.locale]);

  useEffect(() => {
    const getNewestProduct = async () => {
      const products = await getNewest();
      setNewestProduct(products);
    };
    getNewestProduct();
  }, [locale]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <main className="flex flex-col flex-grow bg-gray-100 dark:bg-gray-900">
      <section className="relative w-full h-[35rem] overflow-hidden">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={img}
              alt={`F1 image ${index + 1}`}
              fill
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute bottom-4 w-full flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full focus:outline-none transition-colors ${
                index === currentSlide
                  ? "bg-red-600"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
            {t("welcome")}
          </h1>
          <p className="mt-4 text-lg md:text-2xl drop-shadow-lg">
            {t("experience")}
          </p>
          <Link href="/merchandise">
            <button className="mt-6 px-8 py-3 bg-red-600 hover:bg-red-700 rounded-full font-semibold transition duration-300">
              {t("shop")}
            </button>
          </Link>
        </div>
      </section>

      <section className="py-12 px-4 md:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">
          {t("newest")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newestProduct?.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 border-t-4 border-red-600 p-4 rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-300 min-h-[350px] flex flex-col justify-between"
            >
              <Image
                src={product.images[0]}
                alt={product[`name_${locale}`]}
                width={600}
                height={400}
                className="w-full h-82 object-cover rounded"
              />
              <div className="mt-3">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 hover:text-red-600 transition-colors duration-300 cursor-pointer">
                  {product[`name_${locale}`]}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  ${product.price / 100}
                </p>
              </div>
              <button className="mt-4 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition duration-300">
                {t("buy")}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 bg-red-600 dark:bg-red-700 text-white text-center">
        <h2 className="text-3xl font-bold">{t("premium")}</h2>
        <p className="mt-4 text-lg">{t("package")}</p>
        <Link href="/pricing">
          <button className="mt-6 px-8 py-3 bg-white text-red-600 font-semibold rounded-full hover:bg-gray-200 transition duration-300">
            {t("subscribe")}
          </button>
        </Link>
      </section>

      <section className="py-12 px-4 md:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">
          {t("about")}
        </h2>
        <p className="max-w-3xl mx-auto text-gray-700 dark:text-gray-300 text-center leading-relaxed">
          {t("about_text")}
        </p>
      </section>
    </main>
  );
}
