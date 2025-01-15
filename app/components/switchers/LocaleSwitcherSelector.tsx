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
        "relative text-gray-400",
        isPending && "transition-opacity [&:disabled]:opacity-30"
      )}
    >
      <span className="sr-only">{label}</span>
      <select
        id="language-selector"
        className="inline-flex appearance-none bg-transparent py-3 pl-2 pr-6 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={onSelectChange}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2">
        ⌄
      </span>
    </label>
  );
};

export default LocaleSwitcherSelect;
