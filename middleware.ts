import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { createClient } from "./utils/supabase/server";
import { getLocale } from "next-intl/server";

const restrictedPages = [
  "/en/cart",
  "/ka/cart",
  "/en/profile",
  "/ka/profile",
  "/ka/",
  "/en/",
  "/en/reset-password",
  "/ka/reset-password",
];

const authPages = [
  "/en/sign-in",
  "/en/sign-up",
  "/en/forgot-password",
  "/ka/sign-in",
  "/ka/sign-up",
  "/ka/forgot-password",
];

export default async function middleware(request: NextRequest) {
  const supabase = await createClient();

  const response = createMiddleware(routing)(request);

  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData?.session;

  const isAuthenticated = !!session;
  const currentPath = request.nextUrl.pathname;
  const locale = await getLocale();

  if (authPages.includes(currentPath) && isAuthenticated) {
    const homeUrl = new URL(`/${locale}`, request.url);
    return NextResponse.redirect(homeUrl);
  }

  if (restrictedPages.includes(currentPath)) {
    if (!isAuthenticated) {
      const signInUrl = new URL(`/${locale}/sign-in`, request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/", "/(ka|en)/:path*"],
};
