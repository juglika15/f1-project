"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { getLocale } from "next-intl/server";

export const signUpAction = async (formData: FormData) => {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const locale = (await getLocale()) || "en";

  if (!name || !email || !password || !confirmPassword) {
    return encodedRedirect(
      "error",
      `/${locale}/sign-up`,
      "name,email and passwords are required"
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      `/${locale}/sign-up`,
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", `/${locale}/sign-up`, error.message);
  } else {
    return encodedRedirect("success", `/${locale}`, "Thanks for signing up.");
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const locale = (await getLocale()) || "en";

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", `/${locale}/sign-in`, error.message);
  }

  return redirect(`/${locale}`);
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();
  const locale = (await getLocale()) || "en";

  if (!email) {
    return encodedRedirect(
      "error",
      `/${locale}/forgot-password`,
      "Email is required"
    );
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/${locale}/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      `/${locale}/forgot-password`,
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    `/${locale}/forgot-password`,
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const origin = (await headers()).get("origin");
  const locale = (await getLocale()) || "en";

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      `${origin}/${locale}/reset-password`,
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      `${origin}/${locale}/reset-password`,
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect(
      "error",
      `${origin}/${locale}/reset-password`,
      "Password update failed"
    );
  }

  encodedRedirect("success", `${origin}/${locale}`, "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

type Provider = "facebook" | "twitter" | "apple" | "github" | "google";

const signInWith = (provider: Provider) => async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const auth_callback_url = `${origin}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
    },
  });

  if (error) {
    console.log(error.message);
  }

  if (data.url) redirect(data.url);
};

export const signInWithGithub = signInWith("github");
export const signInWithGoogle = signInWith("google");

export const getUserAction = async () => {
  const supabase = await createClient();
  const { data: existingUser } = await supabase.auth.getUser();
  return existingUser.user;
};

export const updateUserMetadata = async (formData: FormData) => {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const avatar_url = formData.get("avatarUrl") as string | "";
  const locale = (await getLocale()) || "en";

  try {
    const { data } = await supabase.auth.updateUser({
      email,
      data: { name, avatar_url },
    });
    console.log("Updated user metadata:", data);
  } catch (error) {
    console.error("Error updating user metadata:", error);
  }

  redirect(`/${locale}/profile`);
};

export const geUserDataAction = async (user: User) => {
  const supabase = await createClient();

  const { data: userData } = await supabase
    .from("user_profiles")
    .select("is_subscribed, stripe_subscription_id, start_date, end_date")
    .eq("id", user.id)
    .single();

  return userData;
};

export const deleteAccountAction = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const auth = await createClient("deleteAccount");

  await supabase.auth.signOut();
  const { error } = await auth.auth.admin.deleteUser(user.id);

  if (error) {
    console.error(error.message);
    return;
  }

  return redirect("/");
};

export const updateProfileAction = async (
  subscriptionStatus: boolean,
  subscriptionId: string | null,
  startDate: string | null = null,
  endDate: string | null = null
) => {
  const supabase = await createClient();
  const { data: existingUser } = await supabase.auth.getUser();
  const userId = existingUser.user?.id;
  const locale = (await getLocale()) || "en";

  if (!userId) {
    return;
  }

  await supabase
    .from("user_profiles")
    .update({
      is_subscribed: subscriptionStatus,
      stripe_subscription_id: subscriptionId,
      start_date: startDate,
      end_date: endDate,
    })
    .eq("id", userId);

  redirect(`/${locale}/pricing`);
};

export const updateEndDate = async () => {
  const supabase = await createClient();
  const { data: existingUser } = await supabase.auth.getUser();
  const userId = existingUser.user?.id;
  const locale = (await getLocale()) || "en";

  if (!userId) {
    return;
  }

  await supabase
    .from("user_profiles")
    .update({
      end_date: null,
    })
    .eq("id", userId);

  redirect(`/${locale}/pricing`);
};
