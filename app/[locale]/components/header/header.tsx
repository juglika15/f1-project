import LocaleSwitcher from "../Switchers/LocaleSwitcher";
import ThemeSwitcher from "../Switchers/ThemeSwitcher";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import logo from "../../../../public/images/F1.svg";
import { useTranslations } from "next-intl";

const Header = () => {
  const t = useTranslations("Navigation");

  return (
    <header className="flex gap-4 justify-center items-center bg-dark dark:bg-gold p-1">
      <Image
        src={logo}
        alt="f1 logo"
        width="100"
        height="100"
        priority
        style={{ width: "6rem", height: "auto" }}
      />
      <nav>
        <ul className="flex gap-3 justify-center text-white">
          <li>
            <Link href="/">{t("home")}</Link>
          </li>
          <li>
            <Link href="/tickets">{t("tickets")}</Link>
          </li>
          <li>
            <Link href="/merchandise">{t("merchandise")}</Link>
          </li>
          <li>
            <Link href="/help">{t("help")}</Link>
          </li>
          <li>
            <Link href="/contact">{t("contact")}</Link>
          </li>
          <li>
            <Link href="/about">{t("about")}</Link>
          </li>
        </ul>
      </nav>
      <LocaleSwitcher />
      <ThemeSwitcher />
      <Link className="text-primary underline text-white" href="/sign-in">
        Sign in
      </Link>
    </header>
  );
};

export default Header;
