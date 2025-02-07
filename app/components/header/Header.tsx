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
    <header className="bg-gradient-to-r from-gray-900 to-red-600 dark:from-yellow-600 dark:to-yellow-400 shadow-xl py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <Image
              src={logo}
              alt="F1 logo"
              width="100"
              height="100"
              priority
              className="w-24 md:w-28"
            />
          </Link>
          <nav>
            <ul className="flex space-x-6 text-lg">
              <Li>
                <Link
                  href="/merchandise"
                  className="text-white dark:text-gray-900  hover:text-red-600 transition-colors duration-300"
                >
                  {t("merchandise")}
                </Link>
              </Li>
              <Li>
                <Link
                  href="/contact"
                  className="text-white dark:text-gray-900  hover:text-red-600 transition-colors duration-300"
                >
                  {t("contact")}
                </Link>
              </Li>
              <Li>
                <Link
                  href="/pricing"
                  className="text-white dark:text-gray-900  hover:text-red-600 transition-colors duration-300"
                >
                  {t("pricing")}
                </Link>
              </Li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <LocaleSwitcher />
          <ThemeSwitcher />
          <Link href="/cart" className="relative">
            <div className="flex items-center justify-center bg-white dark:bg-gray-100 rounded-full p-2  shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-110">
              <FaShoppingCart className="text-red-600 dark:text-yellow-600 text-lg sm:text-xl" />
            </div>
          </Link>
          <DisplayUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
