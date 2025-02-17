import { Product } from "@/types/api";
import { createClient } from "@/utils/supabase/client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

const getMerchByTeam = async (team: string, id: number) => {
  const supabase = createClient();

  const {
    data: teamProduct,
    error,
    status,
  }: PostgrestSingleResponse<Product[]> = await supabase
    .from("merchandise")
    .select("*")
    .eq("team", team)
    .neq("id", id)
    .order("id", { ascending: false })
    .limit(4);

  if (error && status !== 406) {
    throw error;
  }

  return teamProduct;
};

export default getMerchByTeam;
