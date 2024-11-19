import LocaleSwitcher from "../Switchers/LocaleSwitcher";
import ThemeSwitcher from "../Switchers/ThemeSwitcher";

const Header = () => {
  return (
    <header className="flex gap-4 justify-center align-top">
      <nav>
        <ul className="flex gap-3 justify-center">
          <li>Home</li>
          <li>F1 Tickets</li>
          <li>FAQs</li>
          <li>Contanct Us</li>
          <li>About</li>
        </ul>
      </nav>
      <LocaleSwitcher />
      <ThemeSwitcher />
    </header>
  );
};

export default Header;
