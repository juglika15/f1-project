import SubscribeButton from "@/app/components/SubscribeButton";
import { Link } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/server";
import type { Stripe } from "stripe";
import { stripe } from "@/lib/stripe";
import { updateProfileAction } from "@/app/actions/supabase_actions";
import NoUserPricingPage from "./NoUserPricing";
import CanceleSubscriptionPricingPage from "./CanceledSubscriptionPricing";
import SubscribedPricing from "./SubscribedPricing";

interface Plan {
  name: string;
  price: string;
  features: string[];
  link: string;
  cta: string;
}

const plans: Plan[] = [
  {
    name: "Free Plan",
    price: "$0/month",
    features: [
      "Buy F1 Tickets",
      "Buy Newest F1 Merchandise",
      "Follow latest F1 trends",
    ],
    link: "merchandise",
    cta: "Get Started",
  },
  {
    name: "Pro Plan",
    price: "$19.99/month",
    features: [
      "Get Premium offers",
      "Advanced Feature 2",
      "Advanced Feature 3",
    ],
    link: "subscribe",
    cta: "Subscribe Now",
  },
];

const PricingPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>;
}) => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  const { session_id } = await searchParams;

  const { data: checkData } = await supabase
    .from("user_profiles")
    .select("is_subscribed")
    .eq("id", user?.id)
    .single();

  if (session_id && !checkData?.is_subscribed) {
    try {
      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.retrieve(session_id, {
          expand: ["line_items", "payment_intent"],
        });
      if (checkoutSession.status === "complete") {
        const startDate = new Date(
          checkoutSession.created * 1000
        ).toLocaleString();
        await updateProfileAction(
          true,
          checkoutSession.subscription as string,
          startDate
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!user) {
    return <NoUserPricingPage />;
  }

  const { data: subData } = await supabase
    .from("user_profiles")
    .select("is_subscribed, stripe_subscription_id, start_date, end_date")
    .eq("id", user.id)
    .single();

  if (subData?.is_subscribed && subData?.end_date) {
    return (
      <CanceleSubscriptionPricingPage
        subscriptionId={subData?.stripe_subscription_id}
        endDate={subData?.end_date}
      />
    );
  }

  if (subData?.is_subscribed) {
    return (
      <SubscribedPricing
        subscriptionId={subData?.stripe_subscription_id}
        startDate={subData?.start_date}
      />
    );
  }

  return (
    <main className="flex flex-grow flex-col justify-center bg-gray-100  dark:bg-dark items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100"></h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Choose the plan that best fits your needs.
          </p>
        </div>
        <div className="mt-10 flex justify-center">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="bg-white dark:bg-gray-700 shadow-md rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {plan.name}
                  </h3>
                  <p className="mt-4 text-gray-600 dark:text-gray-300">
                    {plan.price}
                  </p>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="h-6 w-6 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="ml-3 text-gray-700 dark:text-gray-400">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.link}>
                    <button className="mt-8 w-full bg-f1red text-white py-2 px-4 rounded-md hover:bg-red-700">
                      {plan.cta}
                    </button>
                  </Link>
                  <SubscribeButton userId={user?.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PricingPage;
