"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { getTeams, Team } from "@/hooks/getTeams";
import { Category, getCategories } from "@/hooks/gatCategories";
import { getSizes, Sizes } from "@/hooks/getSizes";
import { getTypes, Type } from "@/hooks/getTypes";
import { Color, getColors } from "@/hooks/getColors";
import { Locale } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";

const SidebarFilter = ({ locale }: { locale: Locale }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const sortType = searchParams?.get("sortBy") ?? "";
  const t = useTranslations("Merchandise");

  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>("all");

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

  const buildFilterParams = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedTeams.length > 0) params.set("team", selectedTeams.join(","));
    if (selectedCategories.length > 0)
      params.set("category", selectedCategories.join(","));
    if (selectedSizes.length > 0) params.set("size", selectedSizes.join(","));
    if (selectedColors.length > 0)
      params.set("color", selectedColors.join(","));
    if (selectedTypes.length > 0) params.set("type", selectedTypes.join(","));
    if (selectedStock !== "all") params.set("stock", selectedStock);
    return params;
  }, [
    selectedTeams,
    selectedCategories,
    selectedSizes,
    selectedColors,
    selectedTypes,
    selectedStock,
  ]);

  const prevFilterParamsRef = useRef<string>("");

  useEffect(() => {
    const filterParams = buildFilterParams();
    const currentFilterString = filterParams.toString();

    if (prevFilterParamsRef.current !== currentFilterString) {
      prevFilterParamsRef.current = currentFilterString;

      const newParams = new URLSearchParams(searchParams?.toString() || "");
      ["team", "category", "size", "color", "type", "stock"].forEach((key) =>
        newParams.delete(key)
      );
      filterParams.forEach((value, key) => newParams.set(key, value));
      newParams.set("page", "1");

      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    }
  }, [buildFilterParams, router, pathname, searchParams]);

  const sortOptions = [
    { name: t("newest"), value: "id-desc" },
    { name: t("oldest"), value: "id-asc" },
    { name: t("name_a_z"), value: `name_${locale}-asc` },
    { name: t("name_z_a"), value: `name_${locale}-desc` },
    { name: t("price_low_to_high"), value: "price-asc" },
    { name: t("price_high_to_low"), value: "price-desc" },
  ];

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newParams = new URLSearchParams(searchParams?.toString() || "");
    newParams.set("sortBy", e.target.value);
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  }

  const handleSearch = useDebouncedCallback((e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams?.toString() || "");
    newParams.set("search", e.target.value);
    newParams.set("page", "1");
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  }, 1000);

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

  return (
    <div className="w-64 p-4 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="mb-4">
        <input
          id="sidebar-search"
          name="sidebar-search"
          type="text"
          placeholder={t("search_placeholder")}
          onChange={handleSearch}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring focus:border-blue-300 dark:focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
        />
      </div>

      <div className="mb-4">
        <label
          className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
          htmlFor="sidebar-sort "
        >
          {t("sort_by")}
        </label>
        <select
          id="sidebar-sort"
          name="sidebar-sort"
          value={sortType}
          onChange={handleSortChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring focus:border-blue-300 dark:focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-medium mb-2 text-gray-700 dark:text-gray-200">
          {t("filters")}
        </h3>

        <div className="mb-2">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-200">
              {t("team")}
            </summary>
            <div className="mt-1 pl-4 space-y-1">
              {teamOptions.map((team) => (
                <label
                  key={team.id}
                  className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                  htmlFor={`team-${team.id}`}
                >
                  {team.logo && (
                    <Image
                      src={team.logo}
                      alt={team.name}
                      width={36}
                      height={36}
                      className=" mr-2 object-contain rounded-full bg-white p-1 "
                    />
                  )}
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

        <div className="mb-2">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-200">
              {t("category")}
            </summary>
            <div className="mt-1 pl-4 space-y-1">
              {categoryOptions.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center text-sm text-gray-600 dark:text-gray-300"
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

        <div className="mb-2">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-200">
              {t("size")}
            </summary>
            <div className="mt-1 pl-4 space-y-1">
              {currentSizeOptions?.map((size) => (
                <label
                  key={size}
                  className="flex items-center text-sm text-gray-600 dark:text-gray-300"
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

        <div className="mb-2">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-200">
              {t("color")}
            </summary>
            <div className="mt-1 pl-4 space-y-1">
              {colorOptions.map((color) => (
                <label
                  key={color.id}
                  className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                  htmlFor={`color-${color.id}`}
                >
                  <span
                    className="w-4 h-4 inline-block rounded-full mr-2 border"
                    style={{ backgroundColor: color.value }}
                  />
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

        <div className="mb-2">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-200">
              {t("type")}
            </summary>
            <div className="mt-1 pl-4 space-y-1">
              {typeOptions.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center text-sm text-gray-600 dark:text-gray-300"
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

        <div className="mb-2">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-200">
              {t("stock")}
            </summary>
            <div className="mt-1 pl-4 space-y-1">
              <label
                className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                htmlFor="stock-in"
              >
                <input
                  id="stock-in"
                  name="stock"
                  type="radio"
                  className="mr-2"
                  onChange={() => handleStockChange("in")}
                  checked={selectedStock === "in"}
                />
                {t("in_stock")}
              </label>
              <label
                className="flex items-center text-sm text-gray-600 dark:text-gray-300"
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
                {t("out_of_stock")}
              </label>
              <label
                className="flex items-center text-sm text-gray-600 dark:text-gray-300"
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
                {t("all")}
              </label>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default SidebarFilter;
