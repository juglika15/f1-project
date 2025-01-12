import AuthFrame from "@/app/components/auth/AuthFrame";
import { resetPasswordAction } from "../../../actions/supabase_actions";
import { FormMessage, Message } from "../../../components/auth/FormMessage";
import { SubmitButton } from "../../../components/auth/SubmitButton";
import PasswordInput from "../../../components/auth/PasswordInput";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <AuthFrame>
      <form className="w-full max-w-md bg-white p-8 dark:bg-dark rounded shadow text-black dark:text-white">
        <h1 className="text-2xl font-medium">Reset password</h1>
        <p className="text-sm text-foreground/60">
          Please enter your new password below.
        </p>
        <PasswordInput
          passwordId="reset-password"
          passwordType="new"
          placeholder="at least 6 characters"
        />
        <PasswordInput
          passwordId="reset-password-confirm"
          passwordType="new"
          placeholder="confirm password"
        />

        <SubmitButton formAction={resetPasswordAction}>
          Reset password & Sign in
        </SubmitButton>
        <FormMessage message={searchParams} />
      </form>
    </AuthFrame>
  );
}
