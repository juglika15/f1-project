import LocaleSwitcher from "../switchers/LocaleSwitcher";
import ThemeSwitcher from "../switchers/ThemeSwitcher";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import logo from "../../../public/images/F1.svg";
import { useTranslations } from "next-intl";
import { FaShoppingCart } from "react-icons/fa";
import DisplayUser from "./DisplayUser";
import Li from "../ui/li";

const Header = () => {
  const t = useTranslations("Navigation");

  return (
    <header className="flex gap-4 justify-center items-center bg-dark dark:bg-gold p-1">
      <Link href="/">
        <Image
          src={logo}
          alt="f1 logo"
          width="100"
          height="100"
          priority
          style={{ width: "6rem", height: "auto" }}
        />
      </Link>
      <nav>
        <ul className="flex gap-5 justify-center align-middle text-white ">
          <Li>
            <Link href="/tickets/1">{t("tickets")}</Link>
          </Li>
          <Li>
            <Link href="/merchandise">{t("merchandise")}</Link>
          </Li>
          <Li>
            <Link href="/help">{t("help")}</Link>
          </Li>
          <Li>
            <Link href="/contact">{t("contact")}</Link>
          </Li>
          <Li>
            <Link href="/pricing">{t("pricing")}</Link>
          </Li>
          <Li>
            <Link href="/about">{t("about")}</Link>
          </Li>
        </ul>
      </nav>
      <LocaleSwitcher />
      <ThemeSwitcher />
      <Link href={"/cart"}>
        <FaShoppingCart
          width={"10rem"}
          height={"10rem"}
          className="text-white dark:text-gray-800"
        />
      </Link>
      <DisplayUser />
    </header>
  );
};

export default Header;
