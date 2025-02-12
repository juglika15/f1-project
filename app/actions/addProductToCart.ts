"use server";

import { createClient } from "@/utils/supabase/server";
import { Product } from "@/types/api";

export async function addToCart(product: Product, size: string, count: number) {
  const supabase = await createClient();

  if (!size) throw new Error("Product size is required.");

  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) throw new Error("User not authenticated.");

    const { data: existingCartItem, error: selectError } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", product.id)
      .eq("size", size)
      .maybeSingle();

    if (selectError) {
      throw new Error("Failed to check for an existing cart item.");
    }

    if (existingCartItem) {
      const newCount = existingCartItem.count + count;
      const { data: updatedData, error: updateError } = await supabase
        .from("cart")
        .update({ count: newCount })
        .eq("id", existingCartItem.id)
        .single();
      if (updateError) {
        throw new Error("Failed to update the cart item.");
      }
      return updatedData;
    } else {
      const { data, error } = await supabase
        .from("cart")
        .insert({
          user_id: product.user_id,
          product_id: product.id,
          name_en: product.name_en,
          name_ka: product.name_ka,
          price: product.price,
          stripe_product_id: product.stripe_product_id,
          stripe_price_id: product.stripe_price_id,
          image: product.images[0],
          size: size,
          count: count,
        })
        .single();

      if (error) {
        console.log(error?.message);
        throw new Error("Failed to add product to the cart.");
      }
      return data;
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    throw error;
  }
}
