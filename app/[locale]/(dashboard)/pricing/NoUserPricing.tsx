const NoUserPricing = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Pricing Plans
          </h2>
          <p className="mt-4 text-center text-lg text-gray-600 dark:text-gray-300">
            You are not logged in.
          </p>
        </div>
      </div>
    </main>
  );
};

export default NoUserPricing;
