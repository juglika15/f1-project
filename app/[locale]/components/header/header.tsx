import LocaleSwitcher from "../Switchers/LocaleSwitcher";
import ThemeSwitcher from "../Switchers/ThemeSwitcher";
import { Link } from "@/i18n/routing";

const Header = () => {
  return (
    <header className="flex gap-4 justify-center items-center bg-red-600 dark:bg-yellow-500 p-1">
      <nav>
        <ul className="flex gap-3 justify-center">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/tickets">F1 Tickets</Link>
          </li>
          <li>
            <Link href="/faqs">FAQs</Link>
          </li>
          <li>
            <Link href="/contact">Contanct Us</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </nav>
      <LocaleSwitcher />
      <ThemeSwitcher />
    </header>
  );
};

export default Header;
