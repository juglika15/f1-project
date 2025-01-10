import LocaleSwitcher from "../Switchers/LocaleSwitcher";
import ThemeSwitcher from "../Switchers/ThemeSwitcher";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import logo from "../../../../public/images/F1.svg";
import { useTranslations } from "next-intl";
// import { getTranslations } from "next-intl/server";
import { FaShoppingCart } from "react-icons/fa";
// import { createClient } from "@/utils/supabase/server";
import Display from "../display";

export default function Header() {
  const t = useTranslations("Navigation");

  // const supabase = await createClient();

  // const {
  //   data: { user },
  //   error: userError,
  // } = await supabase.auth.getUser();

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
        <ul className="flex gap-3 justify-center text-white">
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
      <Link href={"/cart"}>
        <FaShoppingCart
          width={"10rem"}
          height={"10rem"}
          className="text-white dark:text-gray-800"
        />
      </Link>
      <Display />
      <Link className="text-primary underline text-white" href="/sign-in">
        Sign in
      </Link>
    </header>
  );
}

// export default Header;
