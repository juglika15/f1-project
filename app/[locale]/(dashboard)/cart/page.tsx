import { getUserAction } from "@/app/actions/supabase";
import { getCartItems } from "@/hooks/getCartItems";
import { Locale } from "@/i18n/routing";
import { CartItem } from "@/types/api";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import React from "react";

const Cart = async ({ params }: { params: Promise<{ locale: Locale }> }) => {
  let cartItems: CartItem[] | null = [];

  const { locale } = await params;
  const t = await getTranslations("Cart");
  const user = await getUserAction();
  if (user) {
    cartItems = await getCartItems(user.id);
  }

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
                    className="object-cover w-full h-48"
                    priority
                  />
                </div>
                <div className="p-4 flex-1">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    {item[`name_${locale}`]}
                  </h2>
                  <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                    ${item.price / 100}
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                    >
                      {t("remove")}
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
