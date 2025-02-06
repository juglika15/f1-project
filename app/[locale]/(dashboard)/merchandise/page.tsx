import Image from "next/image";
import SidebarFilter from "@/app/components/SidebarFilter";
import PaginationControls from "@/app/components/PaginationControls";
import AddProductModal from "@/app/components/AddProductModal";
import {
  getMerchandise,
  MerchandiseResponse,
  Query,
} from "@/hooks/getMerchandise";
import { Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

const MerchandiseDisplay = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Query>;
}) => {
  const { locale } = await params;
  const searchedParams = await searchParams;
  const t = await getTranslations("Merchandise");

  const { merchandise, totalPages } = (await getMerchandise(
    searchedParams,
    locale
  )) as MerchandiseResponse;

  return (
    <main className="bg-white dark:bg-gray-900 py-8 flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <h2 className=" font-extrabold text-gray-900 dark:text-gray-100 mb-4 "></h2>
        <div className="flex flex-col md:flex-row min-h-[40rem]">
          <aside className="md:w-1/4 mb-4 md:mb-0 md:mr-4 ">
            <div className="flex flex-col gap-3  items-center">
              <AddProductModal locale={locale} />
              <SidebarFilter locale={locale} />
            </div>
          </aside>
          <section className="text-center  md:w-3/4">
            <span className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              {t("title")}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              {merchandise.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition"
                >
                  <Image
                    src={product.images[0]}
                    alt={product[`name_${locale}`]}
                    width={200}
                    height={200}
                    priority
                    className="w-full h-auto object-cover rounded"
                  />
                  <div className="mt-2 font-semibold text-gray-800 dark:text-gray-200">
                    <p className="hover:text-blue-500 cursor-pointer transition duration-300 active:text-blue-700">
                      {product[`name_${locale}`]}
                    </p>
                  </div>
                  <div className="mt-1 text-gray-600 dark:text-gray-400">
                    Price: ${product.price / 100}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <PaginationControls totalPages={totalPages} />
    </main>
  );
};

export default MerchandiseDisplay;
