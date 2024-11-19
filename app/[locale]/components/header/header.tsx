import LocaleSwitcher from "../LocaleSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";

const Header = () => {
  return (
    <header>
      <nav>
        <ul className="flex gap-3 justify-center">
          <li>Home</li>
          <li>F1 Tickets</li>
          <li>FAQs</li>
          <li>Contanct Us</li>
          <li>About</li>
        </ul>
        <LocaleSwitcher />
        <ThemeSwitcher />
      </nav>
    </header>
  );
};

export default Header;
