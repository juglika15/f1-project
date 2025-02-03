"use client";

import { Button } from "../ui/button";
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
  className,
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      aria-disabled={pending}
      dataCy={dataCy}
      {...props}
      className={`w-full bg-f1red text-white font-bold py-2 px-4 rounded  hover:text-gray-100 transition-colors  hover:bg-red-700  ${
        pending ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {pending ? pendingText : children}
    </Button>
  );
}
