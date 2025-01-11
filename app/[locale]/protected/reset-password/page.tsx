import { resetPasswordAction } from "../../../supabase_actions/actions";
import { FormMessage, Message } from "../../components/FormMessage";
import { SubmitButton } from "../../components/SubmitButton";
import { Input } from "../../components/Ui/input";
import { Label } from "../../components/Ui/label";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
      <h1 className="text-2xl font-medium">Reset password</h1>
      <p className="text-sm text-foreground/60">
        Please enter your new password below.
      </p>
      <Label htmlFor="reset-password-password">New password</Label>
      <Input
        id="reset-password-password"
        type="password"
        name="password"
        placeholder="New password"
        required
        autoComplete="new-password"
      />
      <Label htmlFor="reset-password-confirmPassword">Confirm password</Label>
      <Input
        id="reset-password-confirmPassword"
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        required
        autoComplete="new-password"
      />
      <SubmitButton formAction={resetPasswordAction}>
        Reset password & Sign in
      </SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  );
}
