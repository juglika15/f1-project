import { createClient } from "@/utils/supabase/server";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { LangTypes } from "@/types/api";

export interface Race {
  id: number;
  name: LangTypes;
  date: string;
  city: LangTypes;
  country: LangTypes;
  circuit: string;
  is_sprint: boolean;
}

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
