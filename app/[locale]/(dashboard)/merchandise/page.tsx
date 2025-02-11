import SidebarFilter from "@/app/components/SidebarFilter";
import PaginationControls from "@/app/components/PaginationControls";
import AddProductModal from "@/app/components/AddProductModal";
import { getMerchandise } from "@/hooks/getMerchandise";
import { Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { getUserAction, geUserDataAction } from "@/app/actions/supabase";
import { MerchandiseResponse, Query } from "@/types/api";
import ProductCard from "./ProductCard";

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
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  userData={userData}
                  user={user}
                />
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
