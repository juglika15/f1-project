"use client";

import { getUserAction } from "@/app/actions/supabase";
import CheckoutFormCart from "@/app/components/CheckoutFormCart";
import RemoveButton from "@/app/components/RemoveButton";
import { getCartItems } from "@/hooks/getCartItems";
import { Locale } from "@/i18n/routing";
import { CartItem } from "@/types/api";
import { User } from "@supabase/supabase-js";
import { useLocale } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

const Cart = () => {
  const locale = useLocale() as Locale;
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const cartItems = async () => {
      const userTemp = await getUserAction();
      setUser(userTemp);

      if (user) {
        const items = await getCartItems(user.id);
        if (items) {
          setCartItems(items);
        }
      }
    };
    cartItems();
  }, [user]);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
          Your Cart
        </h1>
        {cartItems?.length === 0 ? (
          <p className="text-center text-lg text-gray-700 dark:text-gray-300">
            Your cart is empty.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {cartItems?.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="w-full md:w-1/3">
                  <Image
                    src={item.image}
                    alt={item[`name_${locale}`]}
                    width={600}
                    height={600}
                    className="w-40 object-cover h-40"
                    priority
                  />
                </div>
                <div className="p-4 flex-1">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    {item[`name_${locale}`]}
                  </h2>
                  <div>Size: {item.size}</div>
                  <div>Count: {item.count}</div>
                  <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                    ${item.price / 100}
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                    <RemoveButton
                      item={item}
                      size={item.size}
                      count={item.count}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <CheckoutFormCart
            uiMode={"hosted"}
            locale={locale}
            products={cartItems!}
          />
        </div>
      </div>
    </main>
  );
};

export default Cart;
