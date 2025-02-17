"use client";

import React, { useState } from "react";
import { createCheckoutSession } from "../actions/stripe";
import { CartItem } from "@/types/api";

interface CheckoutFormProps {
  locale: string;
  products: CartItem[];
}

export default function CheckoutFormCart({
  locale,
  products,
}: CheckoutFormProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const formAction = async (): Promise<void> => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("uiMode", "hosted");
      formData.append("locale", locale);
      formData.append("purchaseType", "cart");
      formData.append(
        "lineItems",
        JSON.stringify(
          products.map((product) => ({
            id: product.id,
            price: product.stripe_price_id,
            quantity: product.count,
          }))
        )
      );

      const { url } = await createCheckoutSession(formData);

      if (url) {
        window.location.assign(url);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        onClick={formAction}
        disabled={loading}
        data-cy="buy-button"
      >
        {loading ? "Processing..." : "Checkout"}
      </button>
    </>
  );
}
