import { Locale } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { getLocale, getTranslations } from "next-intl/server";

interface LangTypes {
  en: string;
  ka: string;
}
interface Race {
  id: number;
  name: LangTypes;
  date: string;
  is_sprint: string;
  country: LangTypes;
  city: LangTypes;
  circuit: string;
}

export default async function RaceDetails({
  params,
}: {
  params: Promise<{ raceId: string }>;
}) {
  const { raceId } = await params;
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Tickets");
  const supabase = await createClient();
  const { data: races }: PostgrestSingleResponse<Race[]> = await supabase
    .from("races")
    .select("*")
    .order("id", {
      ascending: true,
    });
  if (!races?.[0]) {
    return <p>Race not found</p>;
  }
  const race = races.find((race) => race.id == Number(raceId));

  return (
    <div>
      {/* <h1>{race?.name}</h1> */}
      <p>{race?.date}</p>
      <p>{race?.is_sprint ? t("sprint") : ""}</p>
      <p>{race?.country?.[locale]}</p>
      <p>{race?.city?.[locale]}</p>
      <p>{race?.circuit}</p>
    </div>
  );
}
