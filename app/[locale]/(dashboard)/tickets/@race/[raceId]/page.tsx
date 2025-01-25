import { createClient } from "@/utils/supabase/server";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

interface Race {
  id: string;
  name: string;
  date: string;
  is_sprint: string;
  country: string;
  city: string;
  circuit: string;
}

export default async function RaceDetails({
  params,
}: {
  params: Promise<{ raceId: string }>;
}) {
  const { raceId } = await params;

  const supabase = await createClient();
  const { data: races }: PostgrestSingleResponse<Race[]> = await supabase
    .from("f1_races")
    .select("*");

  if (!races?.[0]) {
    return <p>Race not found</p>;
  }
  const race = races[Number(raceId) - 1];

  return (
    <div>
      <h1>{race?.name}</h1>
      <p>{race?.date}</p>
      <p>{race?.is_sprint ? "sprint weekend" : "normal weekend"}</p>
      <p>{race?.country}</p>
      <p>{race?.city}</p>
      <p>{race?.circuit}</p>
    </div>
  );
}
