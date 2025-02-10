import { createClient } from "@/utils/supabase/server";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { LangTypes, Race } from "@/types/api";

export const getRaces = async () => {
  const supabase = await createClient();
  const {
    data: races,
    error,
    status,
  }: PostgrestSingleResponse<Race[]> = await supabase
    .from("races")
    .select("*")
    .order("id", {
      ascending: true,
    });

  if (error && status !== 406) {
    throw error;
  }
  return races;
};
