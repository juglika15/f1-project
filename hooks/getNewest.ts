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
    .order("id", { ascending: false })
    .limit(3);

  if (error && status !== 406) {
    throw error;
  }

  return newest;
};

export default getNewest;
