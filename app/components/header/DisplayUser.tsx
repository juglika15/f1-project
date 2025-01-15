import { signOutAction } from "@/app/actions/supabase_actions";
import { Link } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";
import { Button } from "../ui/Button";
import { CgProfile } from "react-icons/cg";

const DisplayUser = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  const user = data.user;

  return user ? (
    <div className="text-white flex flex-row items-center gap-4">
      <Link href="/profile" data-cy="profile">
        <CgProfile className="w-7 h-7" />
      </Link>
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"} dataCy="sign-out">
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <Link
      className="text-primary underline text-white"
      href="/sign-in"
      data-cy="sign-in"
    >
      <Button variant={"outline"}>Sign in</Button>
    </Link>
  );
};

export default DisplayUser;
