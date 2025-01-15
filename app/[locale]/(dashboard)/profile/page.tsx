import { deleteAccountAction } from "@/app/actions/supabase_actions";
import { SubmitButton } from "@/app/components/auth/SubmitButton";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

const Profile = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  const user = data.user;

  return (
    <main className="flex flex-grow flex-col justify-center dark:bg-dark items-center">
      <h1>Hello {user?.user_metadata?.displayName.split(" ")[0]}</h1>

      <Image
        alt="profile picture"
        src={
          user?.user_metadata?.avatar_url ??
          "https://img.freepik.com/premium-photo/formula-one-driver-awaits-beginning-race-generative-ai_914383-426.jpg?w=360"
        }
        width={100}
        height={100}
        style={{ width: "9rem", height: "auto" }}
        priority
      />
      <div>Your Email:</div>
      {user?.user_metadata?.email && <p>{user.user_metadata.email}</p>}
      <form action={deleteAccountAction}>
        <SubmitButton>delete account</SubmitButton>
      </form>
    </main>
  );
};

export default Profile;
