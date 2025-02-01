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

  const origin: string = (await headers()).get("origin") as string;
  const locale = getLocale();

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "donate",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: "Custom amount donation",
            },
            unit_amount: formatAmountForStripe(
              Number(data.get("customDonation") as string),
              CURRENCY
            ),
          },
        },
      ],
      ...(ui_mode === "hosted" && {
        success_url: `${origin}/${locale}/donate-with-checkout/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/${locale}/donate-with-checkout`,
      }),
      ...(ui_mode === "embedded" && {
        return_url: `${origin}/${locale}/donate-with-embedded-checkout/result?session_id={CHECKOUT_SESSION_ID}`,
      }),
      ui_mode,
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
