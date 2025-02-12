"use server";

import type { Stripe } from "stripe";
import { headers } from "next/headers";
import { CURRENCY } from "@/config";
import { formatAmountForStripe } from "@/utils/stripe-helpers";
import { stripe } from "@/lib/stripe";
import { getLocale } from "next-intl/server";

export async function createCheckoutSession(
  data: FormData
): Promise<{ client_secret: string | null; url: string | null }> {
  const ui_mode = data.get(
    "uiMode"
  ) as Stripe.Checkout.SessionCreateParams.UiMode;

  const origin: string =
    (await headers()).get("origin") || process.env.NEXT_PUBLIC_SITE_URL!;
  const locale = data.get("locale") || "en";

  const purchaseType = data.get("purchaseType") as "subscription" | "cart";
  if (!["subscription", "cart"].includes(purchaseType)) {
    throw new Error("Invalid purchase type. Must be 'subscription' or 'cart'.");
  }

  const lineItemsRaw = data.get("lineItems");
  let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let productIds: number[] = [];

  if (purchaseType === "subscription") {
    const priceId = data.get("priceId") as string;

    if (!priceId) {
      throw new Error(
        "Price ID is required for subscriptions but was not provided."
      );
    }

    lineItems = [
      {
        price: priceId,
        quantity: 1,
      },
    ];
  } else if (purchaseType === "cart") {
    if (!lineItemsRaw) {
      throw new Error(
        "Line items are required for cart purchases but were not provided."
      );
    }

    try {
      const parsedLineItems = JSON.parse(lineItemsRaw as string) as {
        price: string;
        quantity: number;
        id: number;
      }[];

      lineItems = parsedLineItems.map((item) => ({
        price: item.price,
        quantity: item.quantity,
      }));

      productIds = parsedLineItems.map((item) => item.id);
    } catch {
      throw new Error("Invalid line items format. Must be a JSON string.");
    }

    if (ui_mode === "embedded") {
      throw new Error("Embedded UI mode is not supported for cart purchases.");
    }
  }

  const mode: Stripe.Checkout.SessionCreateParams.Mode =
    purchaseType === "subscription" ? "subscription" : "payment";

  const successUrl =
    purchaseType === "subscription"
      ? `${origin}/${locale}/pricing/result?session_id={CHECKOUT_SESSION_ID}`
      : `${origin}/${locale}/cart/result?session_id={CHECKOUT_SESSION_ID}`;

  const cancelUrl =
    purchaseType === "subscription"
      ? `${origin}/${locale}/subscribe/cancel`
      : `${origin}/${locale}/cart`;

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      ui_mode,
      metadata: { product_ids: productIds.join(",") },
    });

  return {
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  };
}

export async function createPaymentIntent(
  data: FormData
): Promise<{ client_secret: string }> {
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.create({
      amount: formatAmountForStripe(
        Number(data.get("customDonation") as string),
        CURRENCY
      ),
      automatic_payment_methods: { enabled: true },
      currency: CURRENCY,
    });

  return { client_secret: paymentIntent.client_secret as string };
}

export const subscribeAction = async ({ userId }: { userId: string }) => {
  const origin: string = (await headers()).get("origin") as string;
  const locale = await getLocale();

  const { url } = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.SUBSCRIBE_PRICE_ID as string,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
    },
    mode: "subscription",
    success_url: `${origin}/${locale}/pricing?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/${locale}/pricing`,
  });

  return url;
};

export async function cancelSubscriptionImmediately(subscriptionId: string) {
  try {
    await stripe.subscriptions.cancel(subscriptionId);
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw error;
  }
}

export async function updateSubscription(
  subscriptionId: string,
  subscriptionState: boolean = true
) {
  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: subscriptionState,
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw error;
  }
}
