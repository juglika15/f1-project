"use client";

import { Button } from "../ui/Button";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
  dataCy?: string;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  dataCy,
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      aria-disabled={pending}
      dataCy={dataCy}
      {...props}
      className={`w-full bg-red-600 text-white font-bold py-2 px-4 rounded  hover:text-gray-100 transition-colors  hover:bg-red-800  ${
        pending ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {pending ? pendingText : children}
    </Button>
  );
}
