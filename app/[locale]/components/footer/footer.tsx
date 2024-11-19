import { Link } from "@/i18n/routing";

const Footer = () => {
  return (
    <footer>
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
