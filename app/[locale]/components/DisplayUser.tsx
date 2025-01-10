import { signOutAction } from "@/app/supabase_actions/actions";
import { Link } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";
const DisplayUser = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  const user = data.user;

  if (!user) {
    return (
      <Link className="text-primary underline text-white" href="/sign-in">
        Sign in
      </Link>
    );
  }

  return (
    <div>
      Hello {user.user_metadata.displayName.split(" ")[0]}
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  );
};

export default DisplayUser;
