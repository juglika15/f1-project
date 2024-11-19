import LocaleSwitcher from "../LocaleSwitcher";

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
      </nav>
    </header>
  );
};

export default Header;
