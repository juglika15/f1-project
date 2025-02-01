import { signOutAction } from "@/app/actions/supabase";
import { Link } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";
import { Button } from "../ui/button";
import Image from "next/image";
import defaultImg from "@/public/images/default_image.jpeg";

const DisplayUser = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  const user = data.user;

  return user ? (
    <div className="text-white flex flex-row items-center gap-4">
      <div className="relative group ">
        <Link href="/profile" data-cy="profile">
          <Image
            alt="profile picture"
            src={
              user?.user_metadata?.avatar_url
                ? user?.user_metadata?.avatar_url
                : defaultImg
            }
            width={45}
            height={45}
            className=" rounded-full  border-2 border-white hover:border-f1red transition-all duration-300 ease-in-out hover:shadow-[0_0_10px_f1red] hover:scale-105"
            priority
          />
        </Link>
        <div className="absolute left-0 pt-2 flex-col gap-2 bg-transparent dark:transparent  p-2 rounded-md shadow-lg hidden group-hover:block w-40">
          <div className="absolute left-0 pt-2 flex-col gap-2 bg-dark dark:bg-gold  p-2 rounded-md shadow-lg hidden group-hover:block ">
            <Link href="/profile">
              <button
                className={`flex items-center gap-2 hover:bg-f1red dark:hover:bg-dark p-2 rounded w-40`}
              >
                User Info
              </button>
            </Link>
            <Link href="/orders">
              <button
                className={`flex items-center gap-2 hover:bg-f1red dark:hover:bg-dark p-2 rounded w-40`}
              >
                Orders
              </button>
            </Link>
          </div>
        </div>
      </div>
      <form action={signOutAction}>
        <Button
          type="submit"
          variant={"outline"}
          dataCy="sign-out"
          className="border-2 border-white hover:border-f1red transition-all duration-300 ease-in-out hover:shadow-[0_0_10px_f1red] hover:scale-105"
        >
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
