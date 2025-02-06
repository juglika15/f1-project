import { createClient } from "@/utils/supabase/client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { LangTypes } from "@/types/api";

export interface Category {
  id: number;
  name: string;
  value: LangTypes;
}

export const getCategories = async () => {
  const supabase = createClient();
  const {
    data: categories,
    error,
    status,
  }: PostgrestSingleResponse<Category[]> = await supabase
    .from("categories")
    .select("*")
    .order("id", {
      ascending: true,
    });

  if (error && status !== 406) {
    throw error;
  }

  return categories;
};
