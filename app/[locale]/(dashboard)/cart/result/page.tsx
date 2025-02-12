import type { Stripe } from "stripe";
import { createClient } from "@/utils/supabase/server";
import { stripe } from "@/lib/stripe";
import { Link } from "@/i18n/routing";

export default async function ResultPage(props: {
  searchParams: Promise<{ session_id: string }>;
}) {
  const supabase = await createClient();

  const searchParams = await props.searchParams;
  if (!searchParams.session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.retrieve(searchParams.session_id, {
      expand: ["line_items", "payment_intent"],
    });

  const productIdsString = checkoutSession.metadata?.product_ids;
  if (!productIdsString) {
    throw new Error("No product IDs found in the session metadata.");
  }

  const productIds = productIdsString.split(",").map((id) => parseInt(id));

  const { data: products, error } = await supabase
    .from("merchandise")
    .select("*")
    .in("id", productIds);

  if (error) {
    console.error("Error fetching products from Supabase:", error);
    throw new Error("Failed to fetch product details.");
  }

  const userResponse = await supabase.auth.getUser();
  const userId = userResponse.data.user?.id;

  if (!userId) throw new Error("User is not authenticated.");

  const orderInsertPromises = products?.map((product) => {
    return supabase.from("orders").insert({
      user_id: userId,
      product_id: product.id,
      stripe_product_id: product.stripe_product_id,
      stripe_price_id: product.stripe_price_id,
      stripe_purchase_id: checkoutSession.id,
      description: product.description,
      price: product.price,
    });
  });

  await supabase.from("cart").delete().gt("id", 0);

  await Promise.all(orderInsertPromises);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="p-8 rounded-lg text-center shadow-xl bg-white dark:bg-gray-800 max-w-md mx-4">
        <h1 className="text-4xl font-bold mb-4 text-red-600 dark:text-red-400">
          Thank you for your purchase!
        </h1>
        <p className="text-2xl text-gray-800 dark:text-gray-200 mb-6">
          Your order has been successfully placed.
        </p>

        <Link
          href="/orders"
          className="inline-block bg-gradient-to-r from-red-500 to-black dark:from-red-600 dark:to-gray-800 text-white font-semibold py-4 px-8 rounded-full transition-all hover:opacity-90"
        >
          See Orders
        </Link>
      </div>
    </div>
  );
}
