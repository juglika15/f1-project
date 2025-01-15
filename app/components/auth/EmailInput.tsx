import { Input } from "@/app/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { CiMail } from "react-icons/ci";

const EmailInput = ({
  emailId,
  dataCy,
}: {
  emailId: string;
  dataCy: string;
}) => {
  return (
    <>
      <Label htmlFor={`${emailId}-email`}>Email</Label>
      <div className="relative flex items-center">
        <CiMail
          size="25"
          color="gray"
          className="absolute left-2 top-1/2 transform -translate-y-1/2"
        />
        <Input
          id={`${emailId}-email`}
          type="email"
          name="email"
          placeholder="you@example.com"
          required
          autoComplete="email"
          dataCy={dataCy}
        />
      </div>
    </>
  );
};
export default EmailInput;
