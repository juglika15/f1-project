"use client";

import {
  deleteAccountAction,
  updateUserMetadata,
} from "@/app/actions/supabase";
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
import ConfirmModal from "@/app/components/ConfirmModal";
import validateImageURL from "@/app/actions/validate_imageUrl";

const Profile = () => {
  const supabase = createClient();
  const [loading, setLoading] = useState<boolean>(true);
  const [updateUser, setUpdateUser] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setAvatar(data.user?.user_metadata?.avatar_url);
        setAvatarUrl(data.user?.user_metadata?.avatar_url);
        console.log(data.user?.user_metadata?.avatar_url);
        setName(data.user?.user_metadata?.name);
        setEmail(data.user?.email as string);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [supabase.auth, updateUser]);

  const handleUpdateAction = () => {
    setIsUpdateModalOpen(true);
  };

  const handleDeleteAction = () => {
    setIsDeleteModalOpen(true);
  };

  const handleUpdateConfirm = () => {
    setIsUpdateModalOpen(false);
    setUpdateUser(false);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteModalOpen(false);
  };

  const handleUpdateClose = () => {
    setIsUpdateModalOpen(false);
  };

  const handleDeleteClose = () => {
    setIsDeleteModalOpen(false);
  };

  const validateUrl = async (value: string) => {
    if (value) {
      const isValid: boolean = await validateImageURL(value);
      if (!isValid) {
        setIsValidUrl(false);
        setMessage("Invalid image URL");
      } else {
        setIsValidUrl(true);
        setMessage("valid image URL");
      }
    } else {
      setIsValidUrl(true);
      setMessage("");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-grow flex-col justify-center items-center dark:bg-dark bg-gray-100 py-10">
      <form
        action={updateUserMetadata}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md flex-grow"
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setUpdateUser((prev) => !prev)}
            className="text-black dark:text-white underline hover:text-gray-600 dark:hover:text-gray-300"
          >
            {updateUser ? "cancel edit" : "edit user info"}
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          User
        </h1>
        <div className="flex flex-col items-center mb-6">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            Avatar
          </div>
          <Image
            id="avatar"
            alt="profile picture"
            src={avatar ? avatar : defaultImg}
            width={100}
            height={100}
            className="w-44 h-auto rounded-full border-2 border-gray-200 dark:border-gray-700"
            unoptimized
            priority
          />
        </div>
        <div className={`mb-6 ${updateUser ? "block" : "hidden"}`}>
          <Label
            htmlFor="avatarUrl"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2"
          >
            Avatar Link:
          </Label>
          <div className="relative flex items-center">
            <GiFullMotorcycleHelmet
              size="25"
              color="gray"
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
            />
            <Input
              id="avatarUrl"
              type="link"
              name="avatarUrl"
              value={avatarUrl ?? ""}
              onChange={async (e) => {
                setAvatarUrl(e.target.value);
                await validateUrl(e.target.value);
              }}
              autoComplete="name"
              className="w-full pl-10 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <p className={`${isValidUrl ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        </div>
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
              readOnly={!updateUser}
            />
          </div>
        </div>
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
              readOnly={!updateUser}
            />
          </div>
        </div>
        <p
          className={`text-sm text-gray-600 dark:text-gray-400 mb-6 ${
            updateUser ? "block" : "hidden"
          }`}
        >
          Note: If you update your email, you need to confirm the changes from
          your old or updated email.
        </p>
        <button
          type="button"
          className="w-full py-2 bg-f1red text-white rounded-lg hover:bg-red-600  transition disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={handleUpdateAction}
          disabled={!updateUser || !isValidUrl}
        >
          Update User Info
        </button>
        <ConfirmModal
          isOpen={isUpdateModalOpen}
          onClose={handleUpdateClose}
          onConfirm={handleUpdateConfirm}
          message="Are you sure you want to update your user info?"
          type="update"
        />
      </form>
      <form
        action={deleteAccountAction}
        className="mt-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md"
      >
        <SubmitButton
          dataCy="delete-account-button"
          className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          type="button"
          onClick={handleDeleteAction}
        >
          Delete Account
        </SubmitButton>
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteClose}
          onConfirm={handleDeleteConfirm}
          message="Are you sure you want to delete your user?"
          type="delete"
        />
      </form>
    </main>
  );
};

export default Profile;
