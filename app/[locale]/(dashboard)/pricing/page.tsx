import { Link } from "@/i18n/routing";
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
    price: "$29/month",
    features: [
      "Get Premium offers",
      "Advanced Feature 2",
      "Advanced Feature 3",
    ],
    link: "subscribe",
    cta: "Subscribe Now",
  },
];

const Pricing = () => {
  return (
    <main className="flex flex-grow flex-col justify-center bg-gray-100  dark:bg-dark items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Pricing Plans
          </h2>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Pricing;
