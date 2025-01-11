"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export const signUpAction = async (formData: FormData) => {
  const displayName = formData.get("displayName")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const locale = formData.get("locale") || "en";

  if (!displayName || !email || !password || !confirmPassword) {
    return encodedRedirect(
      "error",
      `/${locale}/sign-up`,
      "name,email and passwords are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect("error", `/${locale}/sign-up`, "Passwords do not match");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName,
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
  const locale = formData.get("locale") || "en";

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
  const locale = formData.get("locale") || "en";

  if (!email) {
    return encodedRedirect(
      "error",
      `/${locale}/forgot-password`,
      "Email is required"
    );
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/${locale}/auth/callback?redirect_to=/${locale}/protected/reset-password`,
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
  const locale = formData.get("locale") || "en";

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      `${locale}/protected/reset-password`,
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      `${locale}/protected/reset-password`,
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      `${locale}/protected/reset-password`,
      "Password update failed"
    );
  }

  encodedRedirect("success", "/", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

type Provider = "facebook" | "twitter" | "apple" | "github" | "google";

const signInWith = (provider: Provider) => async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const locale = await getLocale();

  const auth_callback_url = `${origin}/${locale}/auth/callback`;

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
