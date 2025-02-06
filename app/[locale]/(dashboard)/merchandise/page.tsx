import AddProductForm from "@/app/components/AddProductForm";
import SidebarFilter from "@/app/components/SidebarFilter";
import PaginationControls from "@/app/components/PaginationControls";
import {
  getMerchandise,
  MerchandiseResponse,
  Query,
} from "@/hooks/getMerchandise";
import { Locale } from "@/i18n/routing";
import Image from "next/image";

const MerchandiseDisplay = async ({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Query>;
}) => {
  const { locale } = await params;
  const searchedParams = await searchParams;

  const { merchandise, totalPages } = (await getMerchandise(
    searchedParams,
    locale
  )) as MerchandiseResponse;

  return (
    <main className="flex flex-col items-center justify-center flex-grow bg-white dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Merchandise
          </h2>
          <AddProductForm locale={locale} />
          <SidebarFilter locale={locale} />
          <div>
            {merchandise.map((product) => (
              <div key={product.id}>
                <Image
                  src={product.images[0]}
                  alt={product[`name_${locale}`]}
                  width={200}
                  height={200}
                  priority
                />
                <div>Price: ${product.price / 100}</div>
                <p>{product[`name_${locale}`]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <PaginationControls totalPages={totalPages} />
    </main>
  );
};

export default MerchandiseDisplay;
