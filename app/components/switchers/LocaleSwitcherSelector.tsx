"use client";

import "flag-icons/css/flag-icons.min.css";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { motion, LayoutGroup } from "framer-motion";
import Image from "next/image";
import britishFlag from "@/public/images/british_flag.png";
import georgianFlag from "@/public/images/georgian_flag.png";

const LocaleSwitcherSelect = ({ defaultValue }: { defaultValue: string }) => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  const handleToggle = (nextLocale: string) => {
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
    <LayoutGroup>
      <div className="relative flex items-center justify-between w-36 h-10 p-1 bg-gradient-to-br from-gray-600 to-gray-800 dark:from-gray-800 dark:to-gray-600 rounded-full cursor-pointer select-none shadow-lg transition-colors duration-300">
        {defaultValue === "en" && (
          <motion.div
            layout
            className="absolute top-1 left-1 bottom-1 w-1/2 bg-white dark:bg-gray-900 rounded-full shadow-md"
            transition={{ type: "spring", stiffness: 300, damping: 40 }}
          />
        )}
        {defaultValue === "ka" && (
          <motion.div
            layout
            className="absolute top-1 right-1 bottom-1 w-1/2 bg-white dark:bg-gray-900 rounded-full shadow-md"
            transition={{ type: "spring", stiffness: 300, damping: 40 }}
          />
        )}
        <div
          onClick={() => handleToggle("en")}
          className="flex-1 flex items-center justify-center relative z-10 hover:scale-110 transition-transform duration-200"
        >
          <Image
            src={britishFlag}
            alt="English"
            width="27"
            height="27"
            className="rounded-full"
          />
        </div>
        <div
          onClick={() => handleToggle("ka")}
          className="flex-1 flex items-center justify-center relative z-10 hover:scale-110 transition-transform duration-200"
        >
          <Image
            src={georgianFlag}
            alt="Georgian"
            width="30"
            height="30"
            className="rounded-full"
          />
        </div>
      </div>
    </LayoutGroup>
  );
};

export default LocaleSwitcherSelect;
