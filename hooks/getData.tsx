// import { createClient } from "@/utils/supabase/client";
// import { PostgrestSingleResponse } from "@supabase/supabase-js";
// import { Merchandise } from "./getMerchandise";

// export const getData = async (selected?: string[], selected2?: string[]) => {
//   const supabase = createClient();

//   const {
//     data: merchandise,
//     error,
//     status,
//   }: PostgrestSingleResponse<Merchandise[]> = await supabase
//     .from("merchandise")
//     .select("*")
//     .order("id", {
//       ascending: true,
//     })
//     .in("team", selected)
//     .in("category", selected2);

//   if (error && status !== 406) {
//     throw error;
//   }
//   const filteredMerchandise = [
//     ...new Set(merchandise?.flatMap((m) => m.colors)),
//   ];
//   return filteredMerchandise;
// };
