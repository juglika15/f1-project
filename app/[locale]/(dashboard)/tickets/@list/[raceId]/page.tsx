import { Link } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";

export default async function RacesList() {
  const locale = await getLocale();
  const supabase = await createClient();
  const {
    data: races,
    error,
    status,
  } = await supabase.from("races").select("id, name").order("id", {
    ascending: true,
  });
  if (error && status !== 406) {
    throw error;
  }
  if (!races) {
    return <p>No races found</p>;
  }

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
