import { useTranslations } from "next-intl";

const Loading = () => {
  const t = useTranslations("LoadingPage");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300 p-4">
      <h1 className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-500 mb-6">
        Loading...
      </h1>

      <div className="w-20 h-20 md:w-32 md:h-32 relative">
        <div className="absolute inset-0 rounded-full border-4 border-red-600 dark:border-red-500 opacity-20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-red-600 dark:border-t-transparent dark:border-red-500 animate-spin" />
      </div>

      <p className="mt-6 text-lg text-gray-800 dark:text-gray-200 text-center">
        {t("loading")}
      </p>
    </div>
  );
};

export default Loading;
