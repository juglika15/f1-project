"use client";

import { addNewProduct } from "../actions/add_product";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useState, useEffect } from "react";
import { SubmitButton } from "./auth/SubmitButton";
import { Label } from "@radix-ui/react-label";
import { BsCurrencyDollar } from "react-icons/bs";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

// Available options.
const sizeOptions = ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"];

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

interface ProductFormErrors {
  productName?: string | string[];
  productPrice?: string | string[] | number;
  productDescription?: string | string[];
  productImages?: string | string[];
  productSizes?: string | string[];
  productColors?: string | string[];
  productTeam?: string | string[];
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

  const getLanguage = (input: string) => {
    const geoRegex = /[\u10A0-\u10FF]/;
    return geoRegex.test(input) ? "ka" : "en";
  };

  // F1 team options.
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

  // Extend the schema to include sizes, colors, and team selection.
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
  }>({ error: null, success: null });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");

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
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
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
      productSizes: selectedSizes,
      productColors: selectedColors,
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
      // Append sizes, colors, and team selection to FormData.
      formData.append("productTeam", selectedTeam);
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

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col gap-6 p-8 rounded-xl shadow-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-w-[320px] mb-24 max-w-lg"
    >
      <h1 className="text-2xl font-semibold text-f1red mx-auto">
        {t("title")}
      </h1>
      <div className="flex flex-col gap-2">
        <Label htmlFor="productName" className="font-semibold">
          {t("name")}
        </Label>
        <input
          type="text"
          id="productName"
          name="productName"
          placeholder={t("name_placeholder")}
          className="p-3 pl-5 rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        {fieldErrors.productName && (
          <span className="text-sm text-red-500">
            {fieldErrors.productName}
          </span>
        )}
      </div>

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
          className="p-3 pl-5 rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 "
        ></textarea>
        {fieldErrors.productDescription && (
          <span className="text-sm text-red-500">
            {fieldErrors.productDescription}
          </span>
        )}
      </div>

      {/* Product Images Field */}
      <div className="flex flex-col gap-2">
        <label htmlFor="productImages" className="font-semibold">
          {t("images")}
        </label>
        <input
          type="file"
          id="productImages"
          name="productImages"
          accept="image/*"
          multiple
          onChange={(e) => {
            setHasFiles(e.target.files && e.target.files.length > 0);
          }}
          className={`block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0  file:text-sm file:font-semibold transition-colors duration-500 file:bg-gray-200
    ${
      hasFiles
        ? "file:text-green-600 bg-gradient-to-br from-gray-200 to-green-400 border-green-500"
        : "file:text-blue-700"
    }  hover:file:bg-blue-100`}
        />
        {fieldErrors.productImages && (
          <span className="text-sm text-red-500">
            {fieldErrors.productImages}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 ">
        <span className="font-semibold">{t("team")}</span>
        <div className="flex flex-wrap gap-4">
          {teamOptions.map((team) => (
            <button
              key={team.code}
              type="button"
              onClick={() => setSelectedTeam(team.code)}
              className={`p-4  border-2 rounded-md transition-all duration-200 bg-white 
                hover:scale-110 hover:border-blue-600
                ${
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

      <div className="flex flex-col gap-2">
        <span className="font-semibold">{t("sizes")}</span>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`w-12 py-1 border rounded-md transition-colors duration-200 hover:bg-blue-600 hover:text-white hover:border-blue-500 ${
                selectedSizes.includes(size)
                  ? "bg-blue-600 text-white border-blue-500"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
        {fieldErrors.productSizes && (
          <span className="text-sm text-red-500">
            {fieldErrors.productSizes}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-semibold">{t("colors")}</span>
        <div className="flex flex-wrap gap-3">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => toggleColor(color.name)}
              className={`w-8 h-8 rounded-full border-2  transition-all duration-200 hover:border-blue-500 ${
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
        {globalMsg.error ? t("retry") : t("add")}
      </SubmitButton>
    </form>
  );
};

export default AddProductForm;
