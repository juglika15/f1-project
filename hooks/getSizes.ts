import { createClient } from "@/utils/supabase/client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export interface Sizes {
  id: number;
  clothes: string[];
  shoes: string[];
  headwear: string[];
  accessories: string[];
}

export const getSizes = async () => {
  const supabase = createClient();
  const {
    data: sizes,
    error,
    status,
  }: PostgrestSingleResponse<Sizes[]> = await supabase
    .from("sizes")
    .select("*");

  if (error && status !== 406) {
    throw error;
  }

  return sizes?.[0];
};
