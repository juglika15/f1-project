import { Link } from "@/i18n/routing";

const Footer = () => {
  return (
    <footer className="flex gap-4 justify-center items-center bg-red-600 dark:bg-yellow-500 p-1">
      <nav>
        <ul>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
