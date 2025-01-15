"use client";

import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { CiLock } from "react-icons/ci";
import { GoEye, GoEyeClosed } from "react-icons/go";

const PasswordInput = ({
  passwordVisible,
  setPasswordVisible,
  passwordName = "password",
  passwordId,
  passwordType,
  placeholder,
  dataCy,
}: {
  passwordVisible: boolean;
  setPasswordVisible: React.Dispatch<React.SetStateAction<boolean>>;
  passwordName?: string;
  passwordId: string;
  passwordType: string;
  placeholder?: string;
  dataCy: string;
}) => {
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
          type={passwordVisible ? "text" : "password"}
          name={passwordName}
          placeholder={placeholder}
          autoComplete={`${passwordType}-password`}
          required
          dataCy={dataCy}
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
