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
    "https://mincpqoaeqklbiwyayuw.supabase.co/storage/v1/object/public/f1/catalogue/6f675e76-22e0-43e6-bca7-b89a7883ae48__1600X600.webp",
    "https://mincpqoaeqklbiwyayuw.supabase.co/storage/v1/object/public/f1/catalogue/4053339d-eebe-4dd1-a6ca-0dd7abe5b4a6__1600X600.avif",
    "https://mincpqoaeqklbiwyayuw.supabase.co/storage/v1/object/public/f1/catalogue/19ae10e6-bc3e-4f8f-841f-7cf424f3a122__1600X600.avif",
    "https://mincpqoaeqklbiwyayuw.supabase.co/storage/v1/object/public/f1/catalogue/3cbcdaf0-3675-43ae-ba2d-1476977403a4__1600X600.avif",
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
      <section className="relative w-full lg:h-[33rem] 2xl:h-[43rem] overflow-hidden">
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
              quality={100}
              priority
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
        <div className="absolute bottom-5 left-6 2xl:bottom-8 2xl:left-8">
          {/* <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
            {t("welcome")}
          </h1>
          <p className="mt-4 text-lg md:text-2xl drop-shadow-lg">
            {t("experience")}
          </p> */}
          <Link href="/merchandise">
            <button className="mt-6 px-8 py-3 bg-white text-black hover:bg-f1red hover:text-white rounded-full font-semibold transition duration-300">
              {t("shop")}
            </button>
          </Link>
        </div>
      </section>

      <section className="py-12 px-4 md:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">
          {t("newest")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {newestProduct?.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 border-t-4 border-red-600 p-4 rounded-lg shadow-md hover:shadow-xl transition transform duration-300 min-h-[350px] flex flex-col justify-between relative group"
            >
              <div className="overflow-hidden ">
                <div className="flex transition-transform duration-500 ease-in-out">
                  <div className="relative min-w-full h-64 sm:h-72 md:h-80 lg:h-96 2xl:h-[33rem]">
                    <Link
                      href={{
                        pathname: "/merchandise/[id]",
                        params: { id: product.id },
                      }}
                      className="relative block w-full h-full cursor-pointer"
                    >
                      <Image
                        src={product.images[0]}
                        alt={product[`name_${locale}`]}
                        fill
                        quality={100}
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover shadow-md transition-opacity duration-500 group-hover:opacity-0"
                      />
                      <Image
                        src={product.images[1]}
                        alt={product[`name_${locale}`]}
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
              <div className="mt-3">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 hover:text-red-600 transition-colors duration-300 cursor-pointer">
                  {product[`name_${locale}`]}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  ${product.price / 100}
                </p>
              </div>
              <Link
                href={{
                  pathname: "/merchandise/[id]",
                  params: { id: product.id },
                }}
              >
                <button className="mt-4 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition duration-300">
                  {t("buy")}
                </button>
              </Link>
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
