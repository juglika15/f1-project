import { Link } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";

export default async function RacesList() {
  const supabase = await createClient();
  const {
    data: races,
    error,
    status,
  } = await supabase.from("f1_races").select("id, name");
  if (error && status !== 406) {
    throw error;
  }
  if (!races) {
    return <p>No races found</p>;
  }

  return (
    <>
      <ul>
        {races.map((race) => (
          <li key={race.id}>
            <Link
              href={{
                pathname: "/tickets/[raceId]",
                params: { raceId: race.id },
              }}
            >
              {race.id}. {race.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
