"use server";

import { createClient } from "@/utils/supabase/server";
import { Product } from "@/types/api";

export async function addProductToCart({ product }: { product: Product }) {
  const supabaseClient = await createClient();

  const { data: authData, error: authError } =
    await supabaseClient.auth.getUser();
  if (authError || !authData.user) {
    console.error("Authentication failed:", authError);
    return { success: false, message: "User is not authenticated" };
  }
  const userId = authData.user.id;

  const { data: cartRecord, error: fetchCartError } = await supabaseClient
    .from("cart")
    .select("id, products")
    .eq("user_id", userId)
    .single();

  // If an unexpected error occurred during fetch, return early
  if (fetchCartError && fetchCartError.code !== "PGRST116") {
    console.error("Cart retrieval error:", fetchCartError);
    return { success: false, message: "Could not fetch user cart" };
  }

  let newProductsList: Product[] = [];

  if (cartRecord) {
    const alreadyInCart = cartRecord.products.some(
      (cartItem: Product) => cartItem.id === product.id
    );

    if (alreadyInCart) {
      return {
        success: false,
        message: "The product is already in your cart",
        products: cartRecord.products,
      };
    }

    newProductsList = [product, ...cartRecord.products];

    const { error: updateError } = await supabaseClient
      .from("user_cart")
      .update({ products: newProductsList })
      .eq("id", cartRecord.id);

    if (updateError) {
      console.error("Error updating the cart:", updateError);
      return { success: false, message: "Could not update the cart" };
    }
  } else {
    newProductsList = [product];
    const { error: insertError } = await supabaseClient
      .from("user_cart")
      .insert([{ user_id: userId, products: newProductsList }]);

    if (insertError) {
      console.error("Error creating a new cart:", insertError);
      return { success: false, message: "Could not create a cart" };
    }
  }

  return {
    success: true,
    message: "Product successfully added to cart",
    products: newProductsList,
  };
}
