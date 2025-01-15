import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { redirect } from "next/navigation";
import { Locale, routing } from "@/i18n/routing";
import Header from "../../components/header/Header";
import { Providers } from "../../components/Providers";
import Footer from "../../components/footer/Footer";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    redirect("/");
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <Header />
        {children}
        <Footer />
      </Providers>
    </NextIntlClientProvider>
  );
}
