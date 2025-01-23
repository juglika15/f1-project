const CanceleSubscriptionPricing = ({ endDate }: { endDate: string }) => {
  return (
    <main className="flex flex-grow flex-col justify-center bg-gray-100  dark:bg-dark items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Pricing Plans
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Your Subscription plan end at{" "}
            {new Date(endDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          renew your subscription
        </div>
      </div>
    </main>
  );
};

export default CanceleSubscriptionPricing;
