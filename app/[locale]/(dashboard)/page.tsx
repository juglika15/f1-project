import { Link } from "@/i18n/routing";

export default function HomePage() {
  return (
    <main className="flex dark:bg-dark flex-grow flex-col justify-center items-center">
      <ul className="card-list">
        <li>
          <Link
            href="/donate-with-embedded-checkout"
            className="card checkout-style-background"
          >
            <h2 className="bottom">Donate with embedded Checkout</h2>
          </Link>
        </li>
        <li>
          <Link
            href="/donate-with-checkout"
            className="card checkout-style-background"
          >
            <h2 className="bottom">Donate with hosted Checkout</h2>
          </Link>
        </li>
        <li>
          <Link
            href="/donate-with-elements"
            className="card elements-style-background"
          >
            <h2 className="bottom">Donate with Elements</h2>
          </Link>
        </li>
      </ul>
    </main>
  );
}
