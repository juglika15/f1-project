import AustralianGP from "@/app/components/circuits/AustralianGP";
import { getRaces, Race } from "@/hooks/getRaces";
import { Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function RaceDetails({
  params,
}: {
  params: Promise<{ raceId: string; locale: Locale }>;
}) {
  const { raceId } = await params;
  const { locale } = await params;
  const t = await getTranslations("Tickets");
  const races = (await getRaces()) as Race[];

  const race = races.find((race) => race.id == Number(raceId));

  return (
    <div>
      <h1>{race?.name[locale]}</h1>
      <p>{race?.date}</p>
      <p>{race?.is_sprint ? t("sprint") : ""}</p>
      <p>{race?.country[locale]}</p>
      <p>{race?.city[locale]}</p>
      <p>{race?.circuit}</p>
      <div className="flex justify-center items-center w-full">
        {race?.id === 1 && (
          <ul>
            {race?.hospitality?.map((hospitality) => (
              <li key={hospitality}>{hospitality}</li>
            ))}
          </ul>
        )}
        {race?.id === 1 && <AustralianGP selected="rame" />}
      </div>
    </div>
  );
}
