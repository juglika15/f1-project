import { getRaces } from "@/hooks/getRaces";
import { Link, Locale } from "@/i18n/routing";
import { Race } from "@/types/api";

export default async function RacesList({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const races = (await getRaces()) as Race[];

  return (
    <ul className="flex flex-col gap-2 m-2">
      {races.map((race) => (
        <li key={race.id} className="">
          <Link
            href={{
              pathname: "/tickets/[raceId]",
              params: { raceId: race.id },
            }}
            className="group-hover:text-f1red transition-all duration-300 ease-in-out hover:shadow-[0_0_10px_f1red] hover:scale-110 cursor-pointer"
          >
            <button className="border-red-500 border-2 p-2 w-full">
              {race.name[locale]}
            </button>
          </Link>
        </li>
      ))}
    </ul>
  );
}
