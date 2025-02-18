import SidebarFilter from "@/app/components/SidebarFilter";
import PaginationControls from "@/app/components/PaginationControls";
import AddProductModal from "@/app/components/AddProductModal";
import { getMerchandise } from "@/hooks/getMerchandise";
import { Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { getUserAction } from "@/app/actions/supabase";
import { MerchandiseResponse, Query } from "@/types/api";
import ProductCard from "./ProductCard";
import { User } from "@supabase/supabase-js";
import BackToTopButton from "@/app/components/BackToTopButton";

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
  const user: User | null = await getUserAction();
  // let userData = null;

  // if (user) {
  //   userData = await geUserDataAction(user);
  // }

  const { merchandise, totalPages } = (await getMerchandise(
    searchedParams,
    locale
  )) as MerchandiseResponse;

  return (
    <main className="bg-white dark:bg-gray-900 py-8 flex-grow min-h-screen transition-colors duration-300">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-extrabold text-gray-900 dark:text-gray-100 mb-6 text-center text-3xl">
          {t("title")}
        </h2>
        <div className="flex flex-col md:flex-row min-h-[40rem]">
          <aside className="w-full md:w-1/6 mb-6 md:mb-0 md:mr-14">
            <div className="flex flex-col gap-4 items-center md:items-start">
              {user?.id && <AddProductModal locale={locale} />}
              <SidebarFilter locale={locale} />
            </div>
          </aside>
          {/* <section className="w-full md:flex-1"> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
            {merchandise.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                // userData={userData}
                user={user}
              />
            ))}
          </div>
          {/* </section> */}
        </div>
      </div>
      <PaginationControls totalPages={totalPages} />
      <BackToTopButton />
    </main>
  );
};

export default MerchandiseDisplay;
