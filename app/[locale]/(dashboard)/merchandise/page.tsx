import Image from "next/image";
import SidebarFilter from "@/app/components/SidebarFilter";
import PaginationControls from "@/app/components/PaginationControls";
import AddProductModal from "@/app/components/AddProductModal";
import { getMerchandise } from "@/hooks/getMerchandise";
import { Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import EditProductModal from "@/app/components/EditProductModal";
import { getUserAction, geUserDataAction } from "@/app/actions/supabase";
import DeleteProductModal from "@/app/components/DeleteProductConfirm";
import { Link } from "@/i18n/routing";
import AddToCartButton from "@/app/components/AddToCart";
import BuyNowButton from "@/app/components/BuyNow";
import { MerchandiseResponse, Query } from "@/types/api";

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
  const user = await getUserAction();
  let userData = null;

  if (user) {
    userData = await geUserDataAction(user);
  }

  const { merchandise, totalPages } = (await getMerchandise(
    searchedParams,
    locale
  )) as MerchandiseResponse;

  return (
    <main className="bg-white dark:bg-gray-900 py-8 flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-extrabold text-gray-900 dark:text-gray-100 mb-4"></h2>
        <div className="flex flex-col md:flex-row min-h-[40rem]">
          <aside className="md:w-1/4 mb-4 md:mb-0 md:mr-4">
            <div className="flex flex-col gap-3 items-center">
              {userData?.is_subscribed && !userData?.end_date && (
                <AddProductModal locale={locale} />
              )}
              <SidebarFilter locale={locale} />
            </div>
          </aside>
          <section className="text-center md:w-3/4">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              {t("title")}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
              {merchandise.map((product) => (
                <div
                  key={product.id}
                  className="bg-gradient-to-b from-white to-gray-200 dark:from-gray-700 dark:to-gray-800 border-t-4 border-red-600 p-4 rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-300 flex flex-col justify-between"
                  style={{ height: "450px", minWidth: "100%" }}
                >
                  <Link
                    href={{
                      pathname: "/merchandise/[id]",
                      params: { id: product.id },
                    }}
                  >
                    <div className="cursor-pointer flex flex-col items-center">
                      <Image
                        src={product.images[0]}
                        alt={product[`name_${locale}`]}
                        width={180}
                        height={180}
                        priority
                        className="w-[180px] h-[180px] object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105"
                      />
                      <div className="mt-3 flex-grow text-center">
                        <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 hover:text-red-600 transition-colors duration-300">
                          {product[`name_${locale}`]}
                        </p>
                        <div className="mt-1 text-base sm:text-lg text-gray-600 dark:text-gray-400">
                          Price: ${product.price / 100}
                        </div>
                        <div
                          className={`text-sm ${
                            product.stock > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.stock > 0
                            ? t("in_stock")
                            : t("out_of_stock")}
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div
                    className="mt-auto
                   flex flex-col items-center gap-3"
                  >
                    {userData?.is_subscribed &&
                      !userData?.end_date &&
                      user?.id === product.user_id && (
                        <div className="flex justify-center gap-4">
                          <EditProductModal product={product} locale={locale} />
                          <DeleteProductModal
                            product={product}
                            locale={locale}
                          />
                        </div>
                      )}
                    <div className="flex justify-center gap-4">
                      <AddToCartButton />
                      <BuyNowButton />
                    </div>
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
