import "./globals.css";
import Analytics from "./[locale]/components/analitics/Analytics";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "F1 Plus",
  description:
    "F1 Plus - The best place to buy F1 tickets, merchandises and more",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <Analytics />
      </head>
      <body>{children}</body>
    </html>
  );
}
