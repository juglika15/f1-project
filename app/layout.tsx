import "./globals.css";
import Analytics from "./[locale]/components/Analitics/Analytics";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <head>
        <Analytics />
      </head>
      <body>{children}</body>
    </html>
  );
}
