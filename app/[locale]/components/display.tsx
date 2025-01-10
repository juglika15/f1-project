import { createClient } from "@/utils/supabase/server";
export default async function Display() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <div>{user?.email}</div>;
}
