"use client";
import { Link } from "@/i18n/routing";
// import { useTranslations } from "next-intl";s
import Image from "next/image";
// import { createClient } from "../../../utils/supabase/client";
// import { useState } from "react";
// import { User } from "@supabase/supabase-js";

export default function HomePage() {
  // const t = useTranslations("HomePage");

  // const [user, setUser] = useState<User | null>(null);

  // const { auth } = createClient();

  // auth.onAuthStateChange((event, session) => {
  //   setUser(session?.user ?? null);
  // });

  return (
    <main className="flex dark:bg-dark flex-grow flex-col justify-center items-center">
      {/* <h1>{user?.email}</h1> */}
      <ul className="card-list">
        <li>
          <Link
            href="/donate-with-embedded-checkout"
            className="card checkout-style-background"
          >
            <h2 className="bottom">Donate with embedded Checkout</h2>
            <Image
              src="/checkout-one-time-payments.svg"
              alt="f1 logo"
              width={100}
              height={100}
            />
          </Link>
        </li>
        <li>
          <Link
            href="/donate-with-checkout"
            className="card checkout-style-background"
          >
            <h2 className="bottom">Donate with hosted Checkout</h2>
            <Image
              src="/checkout-one-time-payments.svg"
              alt="f1 logo"
              width={100}
              height={100}
            />
          </Link>
        </li>
        <li>
          <Link
            href="/donate-with-elements"
            className="card elements-style-background"
          >
            <h2 className="bottom">Donate with Elements</h2>
            <Image
              src="/elements-card-payment.svg"
              alt="f1 logo"
              width={100}
              height={100}
            />
          </Link>
        </li>
      </ul>
    </main>
  );
}
