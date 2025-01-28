import SubscribeButton from "@/app/components/SubscribeButton";

import {
  getUserAction,
  geUserDataAction,
} from "@/app/actions/supabase_actions";
import NoUserPricingPage from "./NoUserPricing";
import CanceleSubscriptionPricingPage from "./CanceledSubscriptionPricing";
import SubscribedPricing from "./SubscribedPricing";
import updateSubscription from "@/hooks/updateSubscription";

interface Plan {
  name: string;
  price: string;
  features: string[];
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
  },
  {
    name: "Pro Plan",
    price: "$19.99/month",
    features: [
      "Get Premium offers",
      "Advanced Feature 2",
      "Advanced Feature 3",
    ],
  },
];

const PricingPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>;
}) => {
  const { session_id } = await searchParams;

  const user = await getUserAction();

  if (!user) {
    return <NoUserPricingPage />;
  }

  await updateSubscription(session_id, user);

  const userData = await geUserDataAction(user);

  if (userData?.is_subscribed && userData?.end_date) {
    return (
      <CanceleSubscriptionPricingPage
        subscriptionId={userData?.stripe_subscription_id}
        endDate={userData?.end_date}
      />
    );
  }

  if (userData?.is_subscribed) {
    return (
      <SubscribedPricing
        subscriptionId={userData?.stripe_subscription_id}
        startDate={userData?.start_date}
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
