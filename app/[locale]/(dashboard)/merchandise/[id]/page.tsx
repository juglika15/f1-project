import getProduct from "@/hooks/getProduct";
import ProductDetailsContent from "./ProductDetailsContent";
import { Link, Locale } from "@/i18n/routing";
import Logo from "@/public/images/F1.svg";
import Image from "next/image";

const ProductDetails = async ({
  params,
}: {
  params: Promise<{ id: string; locale: Locale }>;
}) => {
  const { id, locale } = await params;
  const { product, logo } = await getProduct(id);

  if (!product || !logo) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="max-w-lg w-full text-center">
          <Image
            src={Logo}
            alt="F1 Logo"
            width={32}
            height={32}
            className="w-32 h-auto mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Oops! Product Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            It seems like the product you’re looking for doesn’t exist. Please
            check the link or return to our homepage to discover our latest F1
            merchandise.
          </p>
          <Link
            href="/merchandise"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors duration-300"
          >
            Back to Merchandise
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-grow flex-col justify-center bg-gray-100 dark:bg-dark items-center">
      <ProductDetailsContent product={product} logo={logo} locale={locale} />
    </main>
  );
};

export default ProductDetails;
