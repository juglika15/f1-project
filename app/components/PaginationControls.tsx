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
  const limit = searchParams?.get("limit") ?? "15";

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
    if (+currentPage > 1) {
      navigateToPage(currentPage - 1);
    }
  };

  return (
    <div className="pagination dark:bg-orange-300">
      <button
        onClick={handlePreviousPage}
        disabled={currentPage <= 1}
        aria-label="Previous Page"
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNextPage}
        disabled={currentPage >= totalPages}
        aria-label="Next Page"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
