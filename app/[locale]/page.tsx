import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("HomePage");
  return (
    <main className="flex dark:bg-dark flex-grow flex-col justify-center items-center">
      <h1 className="text-orange-400">{t("title")}</h1>
    </main>
  );
}
