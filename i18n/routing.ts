import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "ka"],

  // Used when no locale matches
  defaultLocale: "en",
  pathnames: {
    "/": { en: "/", ka: "/" },
    "/sign-in": { en: "/sign-in", ka: "/შესვლა" },
    "/sign-up": { en: "/sign-up", ka: "/რეგისტრაცია" },
    "/forgot-password": { en: "/forgot-password", ka: "/პაროლის-აღდგება" },
    "/tickets/[raceId]": { en: "/tickets/[raceId]", ka: "/ბილეთები/[raceId]" },
    "/merchandise": { en: "/merchandise", ka: "/კოლექცია" },
    "/help": { en: "/help", ka: "/დახმარება" },
    "/contact": { en: "/contact", ka: "/დაგვიკავშირდი" },
    "/about": { en: "/about", ka: "/ჩვენს-შესახებ" },
    "/pricing": { en: "/pricing", ka: "/ფასები" },
    "/reset-password": { en: "/reset-password", ka: "/პაროლის-აღდგება" },
    "/profile": { en: "/profile", ka: "/პროფილი" },
    "/cart": { en: "/cart", ka: "/კალათა" },
  },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export type Locale = (typeof routing)["locales"][number];
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
