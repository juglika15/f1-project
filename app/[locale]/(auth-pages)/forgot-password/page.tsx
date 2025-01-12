import { forgotPasswordAction } from "../../../actions/supabase_actions";
import { FormMessage, Message } from "../../../components/auth/FormMessage";
import { SubmitButton } from "../../../components/auth/SubmitButton";
import { Link } from "@/i18n/routing";
import EmailInput from "../../../components/auth/EmailInput";
import AuthFrame from "@/app/components/auth/AuthFrame";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <AuthFrame>
      <form className="w-full max-w-md bg-white p-8 dark:bg-dark rounded shadow text-black dark:text-white">
        <div>
          <h1 className="text-2xl font-medium">Reset Password</h1>
          <p className="text-sm text-secondary-foreground">
            Already have an account?{" "}
            <Link className="text-primary underline" href="/sign-in">
              Sign in
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-3 [&>input]:mb-3 mt-8">
          <EmailInput emailId="forgot-password" />
          <SubmitButton formAction={forgotPasswordAction}>
            Reset Password
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </AuthFrame>
  );
}
