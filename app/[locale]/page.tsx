import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function HomePage() {
  const t = useTranslations("HomePage");
  return (
    <div>
      <h1 className="text-orange-400">{t("title")}</h1>
      <Link href="/about">{t("about")}</Link>
    </div>
  );
}
