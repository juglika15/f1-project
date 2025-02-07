"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const PaginationControls = ({ totalPages }: { totalPages: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = Number(
    useMemo(() => searchParams?.get("page") ?? "1", [searchParams])
  );
  const limit = searchParams?.get("limit") ?? "12";

  const newSearchParams = useMemo(
    () => new URLSearchParams(searchParams!),
    [searchParams]
  );

  const navigateToPage = (page: number) => {
    newSearchParams.set("page", page.toString());
    newSearchParams.set("limit", limit);

    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      navigateToPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      navigateToPage(currentPage - 1);
    }
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-700 dark:text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => navigateToPage(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-full border transition 
              ${
                page === currentPage
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          aria-label="Next Page"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-700 dark:text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default PaginationControls;
