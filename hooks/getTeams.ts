import { Team } from "@/types/api";
import { createClient } from "@/utils/supabase/client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export const getTeams = async () => {
  const supabase = createClient();
  const {
    data: teams,
    error,
    status,
  }: PostgrestSingleResponse<Team[]> = await supabase
    .from("teams")
    .select("*")
    .order("id", {
      ascending: true,
    });

  if (error && status !== 406) {
    throw error;
  }

  return teams;
};
