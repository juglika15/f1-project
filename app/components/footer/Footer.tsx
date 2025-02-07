import { Link } from "@/i18n/routing";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-dark dark:bg-gold py-8 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <nav className="w-full md:w-auto text-center">
          <ul className="flex flex-col md:flex-row gap-4 text-lg">
            <li>
              <Link
                href="/contact"
                className="text-white dark:text-gray-900 hover:text-red-500 transition-colors"
                data-cy="footer-contact"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-white dark:text-gray-900 hover:text-red-500 transition-colors"
                data-cy="footer-about"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/help"
                className="text-white dark:text-gray-900 hover:text-red-500 transition-colors"
                data-cy="footer-help"
              >
                Help
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex gap-4">
          <a
            href="https://www.facebook.com/Formula1/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-100 p-2 rounded-full shadow-md hover:shadow-xl transition-transform transform hover:scale-105 text-2xl text-blue-600"
            data-cy="footer-facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.instagram.com/f1/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-100 p-2 rounded-full shadow-md hover:shadow-xl transition-transform transform hover:scale-105 text-2xl text-pink-600"
            data-cy="footer-instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://x.com/F1?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-100 p-2 rounded-full shadow-md hover:shadow-xl transition-transform transform hover:scale-105 text-2xl text-black"
            data-cy="footer-x"
          >
            <FaXTwitter />
          </a>
        </div>
        <div className="w-full md:w-auto text-center text-sm text-white dark:text-gray-900">
          <p>© 2025 F1 Store. All Rights Reserved.</p>
          <p>Designed by F1 Enthusiast</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
