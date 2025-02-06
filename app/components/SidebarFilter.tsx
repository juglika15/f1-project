"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { getTeams, Team } from "@/hooks/getTeams";
import { Category, getCategories } from "@/hooks/gatCategories";
import { getSizes, Sizes } from "@/hooks/getSizes";
import { getTypes, Type } from "@/hooks/getTypes";
import { Color, getColors } from "@/hooks/getColors";
import { Locale } from "@/i18n/routing";

const SidebarFilter = ({ locale }: { locale: Locale }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const sortType = searchParams?.get("sortBy") ?? "";

  // Filter states
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>("all");

  // Options from API/hooks
  const [teamOptions, setTeamOptions] = useState<Team[]>([]);
  const [colorOptions, setColorOptions] = useState<Color[]>([]);
  const [sizeOptions, setSizeOptions] = useState<Sizes | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [typeOptions, setTypeOptions] = useState<Type[]>([]);

  const currentSizeOptions = selectedCategories.includes("shoes")
    ? sizeOptions?.shoes
    : selectedCategories.includes("headwear")
    ? sizeOptions?.headwear
    : selectedCategories.includes("accessories")
    ? sizeOptions?.accessories
    : sizeOptions?.clothes;

  // Fetch filter options on mount
  useEffect(() => {
    const fetchData = async () => {
      const teams = (await getTeams()) as Team[];
      const categories = (await getCategories()) as Category[];
      const sizes = (await getSizes()) as Sizes;
      const types = (await getTypes()) as Type[];
      const colors = (await getColors()) as Color[];

      setTeamOptions(teams);
      setCategoryOptions(categories);
      setSizeOptions(sizes);
      setTypeOptions(types);
      setColorOptions(colors);
    };
    fetchData();
  }, []);

  // When the pathname changes, push to the new URL (optional)
  useEffect(() => {
    router.push(`${pathname}`);
  }, [router, pathname]);

  // Sorting options remain unchanged
  const sortOptions = [
    { name: "Newest", value: "id-desc" },
    { name: "Oldest", value: "id-asc" },
    { name: "Name: A-Z", value: `name_${locale}-asc` },
    { name: "Name: Z-A", value: `name_${locale}-desc` },
    { name: "Price: Low to High", value: "price-asc" },
    { name: "Price: High to Low", value: "price-desc" },
  ];

  // Memoize search params to avoid recreating the URLSearchParams object on every render
  const memoizedSearchParams = useMemo(
    () => new URLSearchParams(searchParams!),
    [searchParams]
  );

  // Update search params based on the selected filters
  const updateSearchParams = useCallback(() => {
    // Remove existing filter keys
    memoizedSearchParams.delete("team");
    memoizedSearchParams.delete("category");
    memoizedSearchParams.delete("size");
    memoizedSearchParams.delete("color");
    memoizedSearchParams.delete("type");
    memoizedSearchParams.delete("stock");

    // Set new values if they exist
    if (selectedTeams.length > 0) {
      memoizedSearchParams.set("team", selectedTeams.join(","));
    }
    if (selectedCategories.length > 0) {
      memoizedSearchParams.set("category", selectedCategories.join(","));
    }
    if (selectedSizes.length > 0) {
      memoizedSearchParams.set("size", selectedSizes.join(","));
    }
    if (selectedColors.length > 0) {
      memoizedSearchParams.set("color", selectedColors.join(","));
    }
    if (selectedTypes.length > 0) {
      memoizedSearchParams.set("type", selectedTypes.join(","));
    }
    if (selectedStock !== "all") {
      memoizedSearchParams.set("stock", selectedStock);
    } else {
      memoizedSearchParams.delete("stock");
    }

    // Reset page to 1 if necessary
    if (Number(memoizedSearchParams.get("page")) > 1) {
      memoizedSearchParams.set("page", "1");
    }

    router.push(`${pathname}?${memoizedSearchParams.toString()}`);
  }, [
    memoizedSearchParams,
    router,
    pathname,
    selectedTeams,
    selectedCategories,
    selectedSizes,
    selectedColors,
    selectedTypes,
    selectedStock,
  ]);

  // Handlers for sort and search
  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    memoizedSearchParams.set("sortBy", e.target.value);
    router.push(`${pathname}?${memoizedSearchParams.toString()}`);
  }

  const handleSearch = useDebouncedCallback((e) => {
    e.preventDefault();
    memoizedSearchParams.set("search", e.target.value);
    if (Number(memoizedSearchParams.get("page")) > 1) {
      memoizedSearchParams.set("page", "1");
    }
    router.push(`${pathname}?${memoizedSearchParams.toString()}`);
  }, 1000);

  // Handlers for each filter option
  const handleTeamChange = (teamCode: string, checked: boolean) => {
    setSelectedTeams((prev) =>
      checked ? [...prev, teamCode] : prev.filter((t) => t !== teamCode)
    );
  };

  const handleCategoryChange = (categoryValue: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked
        ? [...prev, categoryValue]
        : prev.filter((c) => c !== categoryValue)
    );
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    setSelectedSizes((prev) =>
      checked ? [...prev, size] : prev.filter((s) => s !== size)
    );
  };

  const handleColorChange = (colorCode: string, checked: boolean) => {
    setSelectedColors((prev) =>
      checked ? [...prev, colorCode] : prev.filter((c) => c !== colorCode)
    );
  };

  const handleTypeChange = (typeValue: string, checked: boolean) => {
    setSelectedTypes((prev) =>
      checked ? [...prev, typeValue] : prev.filter((t) => t !== typeValue)
    );
  };

  const handleStockChange = (stock: string) => {
    setSelectedStock(stock);
  };

  useEffect(() => {
    updateSearchParams();
  }, [updateSearchParams]);

  return (
    <div className="w-64 p-4 border-r border-gray-300">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          id="sidebar-search"
          name="sidebar-search"
          type="text"
          placeholder="Search..."
          onChange={handleSearch}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* Sorting Options */}
      <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor="sidebar-sort">
          Sort Options
        </label>
        <select
          id="sidebar-sort"
          name="sidebar-sort"
          value={sortType}
          onChange={handleSortChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      {/* Filters */}
      <div>
        <h3 className="font-medium mb-2">Filters</h3>

        {/* Team Filter */}
        <div className="mb-2">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700">
              Team
            </summary>
            <div className="mt-1 pl-4">
              {teamOptions.map((team) => (
                <label
                  key={team.id}
                  className="block text-sm text-gray-600"
                  htmlFor={`team-${team.id}`}
                >
                  <input
                    id={`team-${team.id}`}
                    name="team"
                    type="checkbox"
                    className="mr-2"
                    onChange={(e) =>
                      handleTeamChange(team.code, e.target.checked)
                    }
                  />
                  {team.name}
                </label>
              ))}
            </div>
          </details>
        </div>

        {/* Category Filter */}
        <div className="mb-2">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700">
              Category
            </summary>
            <div className="mt-1 pl-4">
              {categoryOptions.map((category) => (
                <label
                  key={category.id}
                  className="block text-sm text-gray-600"
                  htmlFor={`category-${category.id}`}
                >
                  <input
                    id={`category-${category.id}`}
                    name="category"
                    type="checkbox"
                    className="mr-2"
                    onChange={(e) =>
                      handleCategoryChange(category.name, e.target.checked)
                    }
                  />
                  {category.value[locale]}
                </label>
              ))}
            </div>
          </details>
        </div>

        {/* Size Filter */}
        <div className="mb-2">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700">
              Size
            </summary>
            <div className="mt-1 pl-4">
              {currentSizeOptions?.map((size) => (
                <label
                  key={size}
                  className="block text-sm text-gray-600"
                  htmlFor={`size-${size}`}
                >
                  <input
                    id={`size-${size}`}
                    name="size"
                    type="checkbox"
                    className="mr-2"
                    onChange={(e) => handleSizeChange(size, e.target.checked)}
                  />
                  {size}
                </label>
              ))}
            </div>
          </details>
        </div>

        {/* Color Filter */}
        <div className="mb-2">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700">
              Color
            </summary>
            <div className="mt-1 pl-4">
              {colorOptions.map((color) => (
                <label
                  key={color.id}
                  className="block text-sm text-gray-600"
                  htmlFor={`color-${color.id}`}
                >
                  <input
                    id={`color-${color.id}`}
                    name="color"
                    type="checkbox"
                    className="mr-2"
                    onChange={(e) =>
                      handleColorChange(color.code, e.target.checked)
                    }
                  />
                  {color.name[locale]}
                </label>
              ))}
            </div>
          </details>
        </div>

        {/* Type Filter */}
        <div className="mb-2">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700">
              Type
            </summary>
            <div className="mt-1 pl-4">
              {typeOptions.map((type) => (
                <label
                  key={type.id}
                  className="block text-sm text-gray-600"
                  htmlFor={`type-${type.id}`}
                >
                  <input
                    id={`type-${type.id}`}
                    name="type"
                    type="checkbox"
                    className="mr-2"
                    onChange={(e) =>
                      handleTypeChange(type.name, e.target.checked)
                    }
                  />
                  {type.value[locale]}
                </label>
              ))}
            </div>
          </details>
        </div>

        {/* Stock Availability */}
        <div className="mb-2">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700">
              Stock
            </summary>
            <div className="mt-1 pl-4">
              <label className="block text-sm text-gray-600" htmlFor="stock-in">
                <input
                  id="stock-in"
                  name="stock"
                  type="radio"
                  className="mr-2"
                  onChange={() => handleStockChange("in")}
                  checked={selectedStock === "in"}
                />
                In Stock
              </label>
              <label
                className="block text-sm text-gray-600"
                htmlFor="stock-out"
              >
                <input
                  id="stock-out"
                  name="stock"
                  type="radio"
                  className="mr-2"
                  onChange={() => handleStockChange("out")}
                  checked={selectedStock === "out"}
                />
                Out of Stock
              </label>
              <label
                className="block text-sm text-gray-600"
                htmlFor="stock-all"
              >
                <input
                  id="stock-all"
                  name="stock"
                  type="radio"
                  className="mr-2"
                  onChange={() => handleStockChange("all")}
                  checked={selectedStock === "all"}
                />
                All
              </label>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default SidebarFilter;
