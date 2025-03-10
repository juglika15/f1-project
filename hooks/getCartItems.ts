import { CartItem } from "@/types/api";
import { createClient } from "@/utils/supabase/client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
export const getCartItems = async (id: string) => {
  const supabase = createClient();
  const {
    data: cartItems,
    error,
    status,
  }: PostgrestSingleResponse<CartItem[]> = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", id)
    .order("created_at", {
      ascending: true,
    });

  if (error && status !== 406) {
    throw error;
  }

  return cartItems;
};
