import { deleteAccountAction } from "@/app/actions/supabase_actions";
import { SubmitButton } from "@/app/components/auth/SubmitButton";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

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
            : "https://img.freepik.com/premium-photo/formula-one-driver-awaits-beginning-race-generative-ai_914383-426.jpg?w=360"
        }
        width={100}
        height={100}
        style={{ width: "9rem", height: "auto" }}
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
