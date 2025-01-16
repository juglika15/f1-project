import "./globals.css";
import { Metadata } from "next";
import { Providers } from "./components/Providers";

export const metadata: Metadata = {
  title: "F1 Plus",
  description:
    "F1 Plus - The best place to buy F1 tickets, merchandises and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head></head>
      <body className="flex flex-col min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
