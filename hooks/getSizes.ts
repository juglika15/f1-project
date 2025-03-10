import { Sizes } from "@/types/api";
import { createClient } from "@/utils/supabase/client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
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
