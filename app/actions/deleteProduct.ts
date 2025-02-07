"use server";

import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

export async function deleteProduct(stripeProductId: string) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const supabase = await createClient();

  const { data: productData, error: fetchError } = await supabase
    .from("merchandise")
    .select("stripe_product_id")
    .eq("stripe_product_id", stripeProductId)
    .single();

  if (fetchError || !productData) {
    throw new Error("Product not found in the database.");
  }

  try {
    await stripe.products.update(stripeProductId, {
      active: false,
    });
  } catch (error) {
    console.error("Error deleting product from Stripe:", error);
    throw new Error("Failed to delete product from Stripe.");
  }

  const { error: deleteError } = await supabase
    .from("merchandise")
    .delete()
    .eq("stripe_product_id", stripeProductId);

  if (deleteError) {
    console.error("Error deleting product from Supabase:", deleteError);
    throw new Error("Failed to delete product from Supabase.");
  }

  return { message: "Product deleted successfully." };
}
