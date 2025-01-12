"use client";

import { useState } from "react";
import PasswordInput from "./PasswordInput";

const PasswordFrame = ({
  passwordId,
  passwordType,
  confirm = false,
  placeholder = "******",
}: {
  passwordId: string;
  passwordType: string;
  confirm?: boolean;
  placeholder?: string;
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <>
      <PasswordInput
        passwordId={passwordId}
        passwordVisible={passwordVisible}
        setPasswordVisible={setPasswordVisible}
        passwordType={passwordType}
        placeholder={placeholder}
      />
      {confirm && (
        <PasswordInput
          passwordName="confirmPassword"
          passwordId={`${passwordId}-confirm`}
          passwordVisible={passwordVisible}
          setPasswordVisible={setPasswordVisible}
          passwordType={passwordType}
          placeholder="confirm password"
        />
      )}
    </>
  );
};
export default PasswordFrame;
