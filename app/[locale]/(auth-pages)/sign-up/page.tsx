import { signUpAction } from "../../../actions/supabase_actions";
import { FormMessage, Message } from "../../../components/FormMessage";
import { SubmitButton } from "../../../components/SubmitButton";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Link } from "@/i18n/routing";
import { SmtpMessage } from "../SmtpMessage";

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
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text text-foreground">
          Already have an account?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="displayName">Full Name</Label>
          <Input
            id="displayName"
            type="text"
            name="displayName"
            placeholder="first and last name"
            required
            autoComplete="name"
          />
          <Label htmlFor="sign-up-email">Email</Label>
          <Input
            id="sign-up-email"
            type="email"
            name="email"
            placeholder="name@example.com"
            required
            autoComplete="email"
          />
          <Label htmlFor="sign-up-password">Password</Label>
          <Input
            id="sign-up-password"
            type="password"
            name="password"
            placeholder="at least 6 characters"
            minLength={6}
            required
            autoComplete="new-password"
          />
          <Label htmlFor="sign-up-confirmPassword">Confirm password</Label>
          <Input
            id="sign-up-confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="confirm password"
            required
            autoComplete="new-password"
          />
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            Sign up & Sign in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <SmtpMessage />
    </>
  );
}
