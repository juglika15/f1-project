"use server";

import { createClient } from "@/utils/supabase/server";
import { CartItem } from "@/types/api";

export async function removeFromCart(
  product: CartItem,
  size: string,
  count: number
) {
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
      .eq("product_id", product.product_id)
      .eq("size", size)
      .maybeSingle();

    if (selectError) {
      throw new Error("Failed to check for an existing cart item.");
    }

    if (!existingCartItem) {
      throw new Error("Cart item not found.");
    }

    if (existingCartItem.count <= count) {
      const { data: deletedData, error: deleteError } = await supabase
        .from("cart")
        .delete()
        .eq("id", existingCartItem.id)
        .single();

      if (deleteError) {
        throw new Error("Failed to remove the cart item.");
      }
      return deletedData;
    } else {
      const newCount = existingCartItem.count - count;
      const { data: updatedData, error: updateError } = await supabase
        .from("cart")
        .update({ count: newCount })
        .eq("id", existingCartItem.id)
        .single();

      if (updateError) {
        throw new Error("Failed to update the cart item count.");
      }
      return updatedData;
    }
  } catch (error) {
    console.error("Error removing product from cart:", error);
    throw error;
  }
}
