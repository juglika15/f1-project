import { Color, LangTypes } from "@/types/api";
import { createClient } from "@/utils/supabase/client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export const getColors = async () => {
  const supabase = createClient();
  const {
    data: colors,
    error,
    status,
  }: PostgrestSingleResponse<Color[]> = await supabase
    .from("colors")
    .select("*")
    .order("id", {
      ascending: true,
    });

  if (error && status !== 406) {
    throw error;
  }

  return colors;
};
