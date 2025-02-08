import "./globals.css";
import { Metadata } from "next";
import { Providers } from "./components/Providers";
import { Roboto_Condensed } from "next/font/google";

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-roboto-condensed",
});

export const metadata: Metadata = {
  title: "F1 Plus",
  description:
    "F1 Plus - The best place to buy F1 tickets, merchandises and more",
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head></head>
      <body
        className={`${robotoCondensed.variable} flex flex-col min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
