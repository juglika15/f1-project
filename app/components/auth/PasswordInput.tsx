"use client";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { CiLock } from "react-icons/ci";
import { GoEye, GoEyeClosed } from "react-icons/go";

const PasswordInput = ({
  passwordId,
  passwordType,
  placeholder = "******",
}: {
  passwordId: string;
  passwordType: string;
  placeholder?: string;
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div>
      <Label htmlFor={`${passwordId}-password`}>Password</Label>
      <div className="relative flex items-center">
        <CiLock
          size="25"
          color="gray"
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
        />
        <Input
          id={`${passwordId}-password`}
          type="password"
          name="password"
          placeholder={placeholder}
          autoComplete={`${passwordType}-password`}
          required
        />
        {passwordVisible ? (
          <GoEye
            onClick={() => setPasswordVisible(false)}
            size="20"
            color="grey"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          />
        ) : (
          <GoEyeClosed
            onClick={() => setPasswordVisible(true)}
            size="20"
            color="grey"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
