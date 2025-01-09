import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { createClient } from "./utils/supabase/server";
import { getLocale } from "next-intl/server";

const restrictedPages = [
  "/en/cart",
  "/ka/cart",
  "/ka/protected",
  "/en/protected",
  "/en/protected/reset-password",
  "/ka/protected/reset-password",
];

const authPages = [
  "/en/sign-in",
  "/en/sign-up",
  "/en/forgot-password",
  "/ka/sign-in",
  "/ka/sign-up",
  "/ka/forgot-password",
];

export default async function middleware(req: NextRequest) {
  const supabase = await createClient();

  const response = createMiddleware(routing)(req);

  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData?.session;

  const isAuthenticated = !!session;
  const currentPath = req.nextUrl.pathname;

  if (authPages.includes(currentPath) && isAuthenticated) {
    const locale = currentPath.startsWith("/ka") ? "ka" : "en";
    const homeUrl = new URL(`/${locale}`, req.url);
    return NextResponse.redirect(homeUrl);
  }

  if (restrictedPages.includes(currentPath)) {
    if (!isAuthenticated) {
      const locale = await getLocale();
      const loginUrl = new URL(`/${locale}/sign-in`, req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/", "/(ka|en)/:path*"],
};
