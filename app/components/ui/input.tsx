import * as React from "react";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { dataCy?: string }
>(({ className, type, dataCy, ...props }, ref) => {
  return (
    <input
      type={type}
      data-cy={dataCy}
      className={`pl-10 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black dark:text-white ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
