import { signOutAction } from "@/app/actions/supabase_actions";
import { Link } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";
import { Button } from "../ui/button";
const DisplayUser = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  const user = data.user;

  return user ? (
    <div className="text-white flex flex-row items-center gap-4">
      Hello {user.user_metadata.displayName.split(" ")[0]}
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <button>
      <Link
        className="text-primary underline text-white"
        href="/sign-in"
        data-cy="sign-in"
      >
        Sign in
      </Link>
    </button>
  );
};

export default DisplayUser;
