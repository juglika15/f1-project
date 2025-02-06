import { LangTypes } from "@/types/api";
import { createClient } from "@/utils/supabase/client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export interface Type {
  id: number;
  name: string;
  value: LangTypes;
}

export const getTypes = async () => {
  const supabase = createClient();
  const {
    data: types,
    error,
    status,
  }: PostgrestSingleResponse<Type[]> = await supabase
    .from("types")
    .select("*")
    .order("id", {
      ascending: true,
    });

  if (error && status !== 406) {
    throw error;
  }

  return types;
};
