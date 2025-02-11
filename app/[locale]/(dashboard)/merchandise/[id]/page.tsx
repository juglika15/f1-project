import getProduct from "@/hooks/getProduct";
import ProductDetailsContent from "./ProductDetailsContent";
import { Locale } from "@/i18n/routing";

const ProductDetails = async ({
  params,
}: {
  params: Promise<{ id: string; locale: Locale }>;
}) => {
  const { id } = await params;
  const { locale } = await params;
  const { product, logo } = await getProduct(id);

  if (!product || !logo) {
    return <div>Product not found</div>;
  }
  return (
    <main className="flex flex-grow flex-col justify-center bg-gray-100  dark:bg-dark items-center">
      <ProductDetailsContent product={product} logo={logo} locale={locale} />
    </main>
  );
};

export default ProductDetails;
