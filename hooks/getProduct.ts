import { Product } from "@/types/api";
import { createClient } from "@/utils/supabase/server";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
const getProduct = async (id: string) => {
  const supabase = await createClient();

  const {
    data: product,
    error,
    status,
  }: PostgrestSingleResponse<Product> = await supabase
    .from("merchandise")
    .select("*")
    .eq("id", id)
    .single();

  if (error && status !== 406) {
    throw error;
  }

  const {
    data: logos,
    error: logoError,
    status: logoStatus,
  }: PostgrestSingleResponse<{ logo: string }> = await supabase
    .from("teams")
    .select("logo")
    .eq("code", product?.team)
    .single();

  if (logoError && logoStatus !== 406) {
    throw error;
  }
  const logo = logos?.logo;

  return {
    product,
    logo,
  };
};

export default getProduct;
