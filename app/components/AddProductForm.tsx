"use client";

import { addNewProduct } from "@/app/actions/add_product";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useState, useEffect } from "react";
import { SubmitButton } from "./auth/SubmitButton";
import { Label } from "@radix-ui/react-label";
import { BsCurrencyDollar } from "react-icons/bs";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

// Available size options by category.
const sizeOptions = {
  clothes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
  shoes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
  headwear: ["One size only", "S/M", "L/XL"],
  accessories: ["One size only"],
};

const colorOptions: { name: string; value: string }[] = [
  { name: "red", value: "#EF1A2D" },
  { name: "blue", value: "#23326A" },
  { name: "orange", value: "#FF8000" },
  { name: "grey", value: "#C8CCCE" },
  { name: "dark-green", value: "#0A7968" },
  { name: "white", value: "#F9FAFB" },
  { name: "black", value: "#111827" },
  { name: "yellow", value: "#FFF200" },
  { name: "green", value: "#15e102" },
  { name: "purple", value: "#8B5CF6" },
];

const categoryOptions = [
  "Shirts",
  "Hoodies",
  "Jackets",
  "Headwear",
  "Shoes",
  "Accessories",
];

interface ProductFormErrors {
  productName?: string | string[];
  productPrice?: string | string[] | number;
  productDescription?: string | string[];
  productImages?: string | string[];
  productSizes?: string | string[];
  productColors?: string | string[];
  productTeam?: string | string[];
  productCategory?: string | string[];
  productStock?: string | string[] | number;
}

interface Team {
  name: string;
  logo: string;
  code: string;
}

const AddProductForm = () => {
  const t = useTranslations("AddProductForm");
  const [teamOptions, setTeamOptions] = useState<Team[]>([]);
  const [hasFiles, setHasFiles] = useState<boolean | null>(false);

  // New state for category, sizes, colors, team and stock.
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [stock, setStock] = useState<string>("");

  // Fetch F1 team options.
  useEffect(() => {
    const fetchTeams = async () => {
      const supabase = createClient();
      const { data: teams, error }: PostgrestSingleResponse<Team[]> =
        await supabase.from("teams").select("*");
      if (error) {
        throw error;
      }
      setTeamOptions(teams);
    };
    fetchTeams();
  }, []);

  // When category changes, update sizes.
  useEffect(() => {
    if (selectedCategory === "Accessories") {
      setSelectedSizes(["One size only"]);
    } else {
      setSelectedSizes([]);
    }
    // Clear error on category change.
    setFieldErrors((prev) => ({ ...prev, productCategory: undefined }));
  }, [selectedCategory]);

  const getLanguage = (input: string) => {
    const geoRegex = /[\u10A0-\u10FF]/;
    return geoRegex.test(input) ? "ka" : "en";
  };

  // Extend the schema to include category and stock.
  const productSchema = z
    .object({
      productName: z.string().min(3, { message: t("name_required") }),
      productPrice: z.number().min(0.01, { message: t("price_required") }),
      productDescription: z
        .string()
        .min(10, { message: t("description_required") }),
      productImages: z.preprocess((val) => {
        if (val instanceof FileList) {
          return Array.from(val).filter((file) => file && file.name);
        }
        if (Array.isArray(val)) {
          return val.filter((file) => file && file.name);
        }
        return [];
      }, z.array(z.custom<File>((file) => file && typeof file.name === "string", { message: t("images_required") })).min(1, { message: t("images_required") })),
      productSizes: z
        .array(z.string())
        .min(1, { message: t("sizes_required") }),
      productColors: z
        .array(z.string())
        .min(1, { message: t("colors_required") }),
      productTeam: z.string().min(1, { message: t("team_required") }),
      productCategory: z.string().min(1, { message: t("category_required") }),
      productStock: z.preprocess(
        (val) => parseInt(val as string, 10),
        z
          .number()
          .int()
          .positive({ message: t("stock_invalid") })
      ),
    })
    .refine(
      (data) =>
        getLanguage(data.productName) === getLanguage(data.productDescription),
      {
        message: t("language_mismatch"),
        path: ["productDescription"],
      }
    );

  const [fieldErrors, setFieldErrors] = useState<ProductFormErrors>({});
  const [globalMsg, setGlobalMsg] = useState<{
    error: string | null;
    success: string | null;
  }>({
    error: null,
    success: null,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Automatically clear global messages after 5 seconds.
  useEffect(() => {
    if (globalMsg.error || globalMsg.success) {
      const timer = setTimeout(() => {
        setGlobalMsg({ error: null, success: null });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [globalMsg]);

  const toggleSize = (size: string) => {
    if (selectedCategory === "Accessories") return;
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    // Clear size error on toggle.
    setFieldErrors((prev) => ({ ...prev, productSizes: undefined }));
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
    // Clear color error on toggle.
    setFieldErrors((prev) => ({ ...prev, productColors: undefined }));
  };

  const onSubmitHandler = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const formElem = evt.currentTarget;
    const rawData = new FormData(formElem);
    const payload = {
      productName: rawData.get("productName") as string,
      productPrice: parseFloat(rawData.get("productPrice") as string),
      productDescription: rawData.get("productDescription") as string,
      productImages: rawData.getAll("productImages") as File[],
      productTeam: selectedTeam,
      productCategory: selectedCategory,
      productSizes: selectedSizes,
      productColors: selectedColors,
      productStock: rawData.get("productStock") as string,
    };

    setFieldErrors({});
    setGlobalMsg({ error: null, success: null });
    setIsSubmitting(true);

    const validationResult = productSchema.safeParse(payload);
    if (!validationResult.success) {
      setFieldErrors(validationResult.error.flatten().fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData(formElem);
      formData.append("productTeam", selectedTeam);
      formData.append("productCategory", selectedCategory);
      formData.append("productStock", rawData.get("productStock") as string);
      selectedSizes.forEach((size) => formData.append("productSizes", size));
      selectedColors.forEach((color) =>
        formData.append("productColors", color)
      );

      await addNewProduct(formData);
      setGlobalMsg({ error: null, success: t("success_message") });
      formElem.reset();
      setSelectedSizes([]);
      setSelectedColors([]);
      setSelectedTeam("");
      setSelectedCategory("");
      setStock("");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setGlobalMsg({
          error: err.errors.map((e) => e.message).join(", "),
          success: null,
        });
      } else {
        setGlobalMsg({ error: t("unknown_error"), success: null });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine current size options based on selected category.
  const currentSizeOptions =
    selectedCategory === "Shoes"
      ? sizeOptions.shoes
      : selectedCategory === "Headwear"
      ? sizeOptions.headwear
      : selectedCategory === "Accessories"
      ? sizeOptions.accessories
      : sizeOptions.clothes;

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col gap-6 p-8 rounded-xl shadow-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 mb-24 max-w-lg"
    >
      <h1 className="text-2xl font-semibold text-f1red mx-auto">
        {t("title")}
      </h1>

      {/* Product Name Field */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="productName" className="font-semibold">
          {t("name")}
        </Label>
        <input
          type="text"
          id="productName"
          name="productName"
          placeholder={t("name_placeholder")}
          onChange={() =>
            setFieldErrors((prev) => ({ ...prev, productName: undefined }))
          }
          className="p-3 pl-5 rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {fieldErrors.productName && (
          <span className="text-sm text-red-500">
            {fieldErrors.productName}
          </span>
        )}
      </div>

      {/* Product Price Field */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="productPrice" className="font-semibold">
          {t("price")}
        </Label>
        <div className="relative flex items-center">
          <BsCurrencyDollar
            size="21"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-black dark:text-gold"
          />
          <input
            type="number"
            id="productPrice"
            placeholder="0.00"
            name="productPrice"
            min="0.01"
            step="0.01"
            onChange={() =>
              setFieldErrors((prev) => ({ ...prev, productPrice: undefined }))
            }
            className="w-full p-3 pl-7 rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        {fieldErrors.productPrice && (
          <span className="text-sm text-red-500">
            {fieldErrors.productPrice}
          </span>
        )}
      </div>

      {/* Product Description Field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="productDescription" className="font-semibold">
          {t("description")}
        </label>
        <textarea
          id="productDescription"
          name="productDescription"
          rows={3}
          placeholder={t("description_placeholder")}
          onChange={() =>
            setFieldErrors((prev) => ({
              ...prev,
              productDescription: undefined,
            }))
          }
          className="p-3 pl-5 rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        ></textarea>
        {fieldErrors.productDescription && (
          <span className="text-sm text-red-500">
            {fieldErrors.productDescription}
          </span>
        )}
      </div>

      {/* Product Images Field */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="productImages" className="font-semibold">
          {t("images")}
        </Label>
        <input
          type="file"
          id="productImages"
          name="productImages"
          accept="image/*"
          multiple
          onChange={(e) => {
            setHasFiles(e.target.files && e.target.files.length > 0);
            setFieldErrors((prev) => ({ ...prev, productImages: undefined }));
          }}
          className={`block w-full text-sm text-gray-500 border rounded-lg cursor-pointer bg-gray-50 focus:outline-none 
            file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold transition-colors duration-500 file:bg-gray-200 
            ${
              fieldErrors.productImages
                ? "border-red-500 bg-gradient-to-br from-gray-200 to-red-300 file:text-dark"
                : hasFiles
                ? "file:text-green-600 bg-gradient-to-br from-gray-200 to-green-400 border-green-500"
                : "file:text-blue-700"
            } hover:file:bg-blue-100`}
        />
        {fieldErrors.productImages && (
          <span className="text-sm text-red-500">
            {fieldErrors.productImages}
          </span>
        )}
      </div>

      {/* F1 Team Selector */}
      <div className="flex flex-col gap-2">
        <Label className="font-semibold">{t("team")}</Label>
        <div className="flex flex-wrap gap-4">
          {teamOptions.map((team) => (
            <button
              key={team.code}
              type="button"
              onClick={() => {
                setSelectedTeam(team.code);
                setFieldErrors((prev) => ({ ...prev, productTeam: undefined }));
              }}
              className={`p-4 border-2 rounded-md transition-all duration-200 bg-white hover:scale-110 hover:border-blue-600 ${
                selectedTeam === team.code
                  ? "border-blue-600"
                  : "border-gray-300"
              }`}
              aria-label={team.name}
            >
              <Image
                src={team.logo}
                alt={team.name}
                width={32}
                height={32}
                className="w-10 h-10 object-contain"
              />
            </button>
          ))}
        </div>
        {fieldErrors.productTeam && (
          <span className="text-sm text-red-500">
            {fieldErrors.productTeam}
          </span>
        )}
      </div>

      {/* Product Category Selector as Dropdown */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="productCategory" className="font-semibold">
          {t("category")}
        </Label>
        <select
          id="productCategory"
          name="productCategory"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setFieldErrors((prev) => ({ ...prev, productCategory: undefined }));
          }}
          className={`p-3 rounded-md border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-dark
            ${
              fieldErrors.productCategory
                ? "bg-gradient-to-br from-gray-200 to-red-300 border-red-500"
                : selectedCategory
                ? "bg-gradient-to-br from-gray-200 to-green-300"
                : "bg-gray-50 border-gray-300"
            }`}
        >
          <option value="">Select a category</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {fieldErrors.productCategory && (
          <span className="text-sm text-red-500">
            {fieldErrors.productCategory}
          </span>
        )}
      </div>

      {/* Conditional: Display Size Selector only if a category is selected */}
      {selectedCategory && (
        <div className="flex flex-col gap-2">
          <span className="font-semibold">{t("sizes")}</span>
          <div className="flex flex-wrap gap-2">
            {selectedCategory === "Accessories" ? (
              <div className="pl-5 w-32 py-1 border rounded-md bg-blue-600 text-white border-blue-500">
                {sizeOptions.accessories[0]}
              </div>
            ) : (
              currentSizeOptions.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`py-1 border-2 rounded-md transition-colors duration-200 hover:bg-blue-600 hover:text-white hover:border-blue-500 w-12 ${
                    selectedCategory === "Headwear" && "w-36 "
                  } ${selectedCategory === "Shoes" && "w-20"} ${
                    selectedSizes.includes(size)
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))
            )}
          </div>
          {fieldErrors.productSizes && (
            <span className="text-sm text-red-500">
              {fieldErrors.productSizes}
            </span>
          )}
        </div>
      )}

      {/* Product Colors Selector */}
      <div className="flex flex-col gap-2">
        <span className="font-semibold">{t("colors")}</span>
        <div className="flex flex-wrap gap-3">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => toggleColor(color.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:border-blue-500 ${
                selectedColors.includes(color.value)
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color.value }}
              aria-label={color.name}
            />
          ))}
        </div>
        {fieldErrors.productColors && (
          <span className="text-sm text-red-500">
            {fieldErrors.productColors}
          </span>
        )}
      </div>

      {/* Product Stock Field */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="productStock" className="font-semibold">
          {t("stock")}
        </Label>
        <input
          type="number"
          id="productStock"
          name="productStock"
          placeholder="Enter stock quantity"
          min="1"
          step="1"
          value={stock}
          onChange={(e) => {
            setStock(e.target.value);
            setFieldErrors((prev) => ({ ...prev, productStock: undefined }));
          }}
          className="p-3 pl-5 rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {fieldErrors.productStock && (
          <span className="text-sm text-red-500">
            {fieldErrors.productStock}
          </span>
        )}
      </div>

      {isSubmitting && (
        <div className="flex items-center justify-center gap-4">
          <span>{t("adding")}</span>
        </div>
      )}
      {globalMsg.error && (
        <p className="text-center text-red-500 text-base">{globalMsg.error}</p>
      )}
      {globalMsg.success && (
        <p className="text-center text-green-500 text-base">
          {globalMsg.success}
        </p>
      )}
      <SubmitButton
        type="submit"
        disabled={isSubmitting}
        className="h-12 text-lg font-semibold"
        pendingText={t("adding")}
      >
        {t("add")}
      </SubmitButton>
    </form>
  );
};

export default AddProductForm;
