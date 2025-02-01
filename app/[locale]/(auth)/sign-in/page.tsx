import {
  signInAction,
  signInWithGithub,
  signInWithGoogle,
} from "@/app/actions/supabase";
import { FormMessage, Message } from "@/app/components/auth/FormMessage";
import { SubmitButton } from "@/app/components/auth/SubmitButton";
import { Link } from "@/i18n/routing";
import EmailInput from "@/app/components/auth/EmailInput";
import AuthFrame from "@/app/components/auth/AuthFrame";
import github from "@/public/images/github.svg";
import githubDark from "@/public/images/github_dark.svg";
import google from "@/public/images/google.svg";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import PasswordFrame from "@/app/components/auth/PasswordFrame";

const SignIn = async (props: { searchParams: Promise<Message> }) => {
  const searchParams = await props.searchParams;

  return (
    <AuthFrame>
      <div className="w-full max-w-md bg-white p-8 dark:bg-dark rounded shadow text-black dark:text-white">
        <form className="">
          <h1 className="text-2xl font-medium">Sign in</h1>
          <p className="text-sm text-foreground">
            Don&apos;t have an account?{" "}
            <Link
              className="text-foreground font-medium underline"
              href="/sign-up"
              data-cy="sign-up"
            >
              Sign up
            </Link>
          </p>
          <div className="flex flex-col gap-4 [&>input]:mb-3 mt-8">
            <EmailInput emailId="sign-in" dataCy="sign-in-email" />
            <div className="flex justify-between items-center">
              <Link
                className="text-xs text-foreground underline"
                href="/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>
            <PasswordFrame
              passwordId="signin"
              passwordType="new"
              dataCy="sign-in-password"
            />
            <SubmitButton
              pendingText="Signing In..."
              formAction={signInAction}
              dataCy="sign-in-button"
            >
              Sign in
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
        <div className="flex flex-col gap-3 mt-6 items-center">
          <form
            action={signInWithGoogle}
            className="flex flex-row items-center gap-1 border-grey-300 border-2 p-2 rounded hover:border-gray-700 transition-colors dark:border-gray-500 dark:hover:border-white"
          >
            <Button>Sign in with Google</Button>
            <Image src={google} alt="google logo" width={25} height={25} />
          </form>
          <form
            action={signInWithGithub}
            className="flex flex-row items-center gap-1 border-grey-300 border-2 p-2 rounded  hover:border-gray-700 transition-colors dark:border-gray-500 dark:hover:border-white"
          >
            <Button>Sign in with Github</Button>
            <Image
              src={github}
              alt="github logo"
              width={25}
              height={25}
              className="block dark:hidden"
            />
            <Image
              src={githubDark}
              alt="github logo"
              width={30}
              height={30}
              className="hidden dark:block"
            />
          </form>
        </div>
      </div>
    </AuthFrame>
  );
};

export default SignIn;
