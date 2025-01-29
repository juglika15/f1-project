"use client";

import clsx from "clsx";
import "flag-icons/css/flag-icons.min.css";
import { useParams } from "next/navigation";
import { ChangeEvent, ReactNode, useTransition } from "react";
import { Locale, usePathname, useRouter } from "@/i18n/routing";

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

const LocaleSwitcherSelect = ({ children, defaultValue, label }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value as Locale;

    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  };

  return (
    <label
      htmlFor="language-selector"
      className={clsx(
        "relative inline-block text-sm font-medium",
        "text-gray-700 dark:text-gray-300"
      )}
    >
      <span className="sr-only">{label}</span>
      <select
        id="language-selector"
        className={clsx(
          "inline-flex appearance-none w-full max-w-xs bg-white dark:bg-gray-800",
          "py-2.5 pl-4 pr-10 rounded-lg border border-gray-300 dark:border-gray-700",
          "shadow-md hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "transition-all duration-200 ease-in-out",
          "text-gray-700 dark:text-gray-300"
        )}
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {children}
      </select>
      <span
        className={clsx(
          "pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2",
          "text-gray-400 dark:text-gray-500 transition-transform duration-200 ease-in-out"
        )}
      >
        ⌄
      </span>
    </label>
  );
};

export default LocaleSwitcherSelect;
