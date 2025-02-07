// components/LoadingPage.tsx
import React from "react";

const LoadingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <svg
        className="animate-spin h-12 w-12 text-blue-500 dark:text-blue-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <p className="mt-4 text-xl font-medium text-gray-800 dark:text-gray-200">
        Loading F1 Action...
      </p>
    </div>
  );
};

export default LoadingPage;
