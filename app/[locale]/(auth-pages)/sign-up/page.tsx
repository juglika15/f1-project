import { signUpAction } from "../../../actions/supabase_actions";
import { FormMessage, Message } from "../../../components/auth/FormMessage";
import { SubmitButton } from "../../../components/auth/SubmitButton";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/label";
import { Link } from "@/i18n/routing";
import Password from "../../../components/auth/PasswordInput";
import EmailInput from "../../../components/auth/EmailInput";
import { LuUserRound } from "react-icons/lu";
import AuthFrame from "@/app/components/auth/AuthFrame";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <AuthFrame>
      <form className="w-full max-w-md bg-white p-8 dark:bg-dark rounded shadow text-black dark:text-white">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="displayName">Full Name</Label>
          <div className="relative flex items-center">
            <LuUserRound
              size="25"
              color="gray"
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            />
            <Input
              id="displayName"
              type="text"
              name="displayName"
              placeholder="first and last name"
              required
              autoComplete="name"
            />
          </div>
          <EmailInput emailId="sign-up" />
          <Password
            passwordId="sign-up"
            passwordType="new"
            placeholder="at least 6 characters"
          />
          <Password
            passwordId="sign-up-confirm"
            passwordType="new"
            placeholder="confirm password"
          />
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up & Sign in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </AuthFrame>
  );
}
