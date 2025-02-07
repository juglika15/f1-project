import RenewSubscription from "@/app/components/RenewSubscription";

interface CanceledSubscriptionPricingProps {
  subscriptionId: string;
  endDate: string;
}

const CanceledSubscriptionPricing = ({
  subscriptionId,
  endDate,
}: CanceledSubscriptionPricingProps) => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Subscription Ended
          </h2>
          <p className="mt-4 text-center text-lg text-gray-600 dark:text-gray-300">
            Your subscription ends on{" "}
            {new Date(endDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="mt-8">
            <RenewSubscription subscriptionId={subscriptionId} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CanceledSubscriptionPricing;
