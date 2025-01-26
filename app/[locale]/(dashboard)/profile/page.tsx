"use client";

import { deleteAccountAction } from "@/app/actions/supabase_actions";
import { SubmitButton } from "@/app/components/auth/SubmitButton";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import defaultImg from "@/public/images/default_image.jpeg";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/app/components/ui/input";
import { useEffect, useState } from "react";
import { CiMail } from "react-icons/ci";
import { GiFullMotorcycleHelmet } from "react-icons/gi";
import { LuUserRound } from "react-icons/lu";

const Profile = () => {
  const supabase = createClient();
  const [loading, setLoading] = useState<boolean>(true);
  const [updateImage, setUpdateImage] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setAvatar(data.user?.user_metadata?.avatar_url);
        setAvatarUrl(data.user?.user_metadata?.avatar_url);
        setName(data.user?.user_metadata?.name);
        setEmail(data.user?.email as string);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [supabase.auth]);

  async function updateUserMetadata(formData: FormData) {
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const avatar_url = formData.get("avatar") as string;
    const { data, error } = await supabase.auth.updateUser({
      email,
      data: { name, avatar_url },
    });

    if (error) {
      console.error("Error updating user metadata:", error.message);
    } else {
      console.log("Updated user metadata:", data);
    }
    window.location.reload();
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-grow flex-col justify-center items-center dark:bg-dark bg-gray-100 py-10">
      <form
        action={updateUserMetadata}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          User Info
        </h1>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <label
            htmlFor="avatar"
            className="text-gray-600 dark:text-gray-400 text-sm mb-2"
          >
            Avatar
          </label>
          <Image
            id="avatar"
            alt="profile picture"
            src={avatar ? avatar : defaultImg}
            width={100}
            height={100}
            style={{ width: "9rem", height: "auto" }}
            className="rounded-full border-2 border-gray-200 dark:border-gray-700"
            unoptimized
          />
          <button
            type="button"
            onClick={() => setUpdateImage((prev) => !prev)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {updateImage ? "Close Tab" : "Update Avatar"}
          </button>
        </div>

        {/* Update Avatar Input */}
        {updateImage && (
          <div className="mb-6">
            <Label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
            >
              New Avatar Link:
            </Label>
            <div className="relative flex items-center">
              <GiFullMotorcycleHelmet
                size="25"
                color="gray"
                className="absolute left-2 top-1/2 transform -translate-y-1/2"
              />
              <Input
                id="avatar"
                type="link"
                name="avatar"
                value={avatarUrl ?? ""}
                onChange={(e) => setAvatarUrl(e.target.value)}
                autoComplete="name"
                required
                className="w-full pl-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Name Input */}
        <div className="mb-6">
          <Label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
          >
            Name:
          </Label>
          <div className="relative flex items-center">
            <LuUserRound
              size="25"
              color="gray"
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            />
            <Input
              id="name"
              type="text"
              name="name"
              value={name ?? ""}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              className="w-full pl-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="mb-6">
          <Label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
          >
            Email:
          </Label>
          <div className="relative flex items-center">
            <CiMail
              size="25"
              color="gray"
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
            />
            <Input
              id="email"
              type="text"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email ?? ""}
              autoComplete="email"
              className="w-full pl-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Note: If you update your email, you need to confirm the changes from
          your old or updated email.
        </p>

        {/* Submit Button */}
        <SubmitButton
          pendingText="Updating..."
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Update User Info
        </SubmitButton>
      </form>

      {/* Delete Account Form */}
      <form
        action={deleteAccountAction}
        className="mt-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md"
      >
        <SubmitButton
          dataCy="delete-account-button"
          className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Delete Account
        </SubmitButton>
      </form>
    </main>
  );
};

export default Profile;
