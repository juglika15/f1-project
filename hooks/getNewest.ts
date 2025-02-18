import { Product } from "@/types/api";
import { createClient } from "@/utils/supabase/client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

const getNewest = async () => {
  const supabase = createClient();

  const {
    data: newest,
    error,
    status,
  }: PostgrestSingleResponse<Product[]> = await supabase
    .from("merchandise")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error && status !== 406) {
    throw error;
  }

  return newest;
};

export default getNewest;
