import { deleteAccountAction } from "@/app/actions/supabase_actions";
import { SubmitButton } from "@/app/components/auth/SubmitButton";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import defaultImg from "@/public/images/default_image.jpeg";

const Profile = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  const user = data.user;

  const name = user?.user_metadata?.name;

  return (
    <main className="flex flex-grow flex-col justify-center dark:bg-dark items-center bg-gray-100">
      <h1>Hello, {name && name.split(" ")[0]}</h1>

      <Image
        alt="profile picture"
        src={
          user?.user_metadata?.avatar_url
            ? user?.user_metadata?.avatar_url
            : defaultImg
        }
        width={100}
        height={100}
        style={{
          width: "9rem",
          height: "auto",
        }}
        priority
      />
      <div>Your Email:</div>
      {user?.user_metadata?.email && <p>{user.user_metadata.email}</p>}
      <form action={deleteAccountAction}>
        <SubmitButton dataCy="delete-account-button">
          delete account
        </SubmitButton>
      </form>
    </main>
  );
};

export default Profile;
