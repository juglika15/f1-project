import { Link } from "@/i18n/routing";

const Footer = () => {
  return (
    <footer className="flex gap-4 justify-center items-center bg-dark dark:bg-gold p-1">
      <nav className="text-white">
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
