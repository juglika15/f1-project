"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IoIosDesktop } from "react-icons/io";
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";
import { useTranslations } from "next-intl";

const ThemeSwitcher = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Modes");

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (resolvedTheme !== "dark" && resolvedTheme !== "light") return null;

  const options = {
    light: { label: t("light"), icon: <BsSunFill /> },
    dark: { label: t("dark"), icon: <FaMoon /> },
    system: { label: t("system"), icon: <IoIosDesktop /> },
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg outline-none transition duration-200 ease-in-out p-2">
        {options[resolvedTheme].icon} {options[resolvedTheme].label}
      </button>
      <div className="absolute left-0 pt-2 flex-col gap-2 bg-gray-100 dark:bg-gray-600 p-2 rounded-md shadow-lg group-hover:block hidden ">
        {Object.entries(options).map(([key, { label, icon }]) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className={`flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-900 p-2 rounded w-40 ${
              theme === key ? "bg-gray-200 dark:bg-gray-900" : ""
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
