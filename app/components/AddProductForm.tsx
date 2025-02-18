"use client";

import { addNewProduct } from "@/app/actions/addProduct";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useState, useEffect, useRef, useCallback } from "react";
import { SubmitButton } from "./auth/SubmitButton";
import { Label } from "@radix-ui/react-label";
import { BsCurrencyDollar } from "react-icons/bs";
import Image from "next/image";
import { getTeams } from "@/hooks/getTeams";
import { getColors } from "@/hooks/getColors";
import { getSizes } from "@/hooks/getSizes";
import { getCategories } from "@/hooks/gatCategories";
import { Locale } from "@/i18n/routing";
import { getTypes } from "@/hooks/getTypes";
import { IoClose } from "react-icons/io5";
import {
  Category,
  Color,
  ProductFormErrors,
  Sizes,
  Team,
  Type,
} from "@/types/api";
import { useRouter } from "next/navigation";

interface AddProductFormProps {
  locale: Locale;
  onClose: () => void;
}

const AddProductForm = ({ locale, onClose }: AddProductFormProps) => {
  const t = useTranslations("ProductForm");
  const router = useRouter();
  const [teamOptions, setTeamOptions] = useState<Team[]>([]);
  const [colorOptions, setColorOptions] = useState<Color[]>([]);
  const [sizeOptions, setSizeOptions] = useState<Sizes | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [typeOptions, setTypeOptions] = useState<Type[]>([]);

  const [hasFiles, setHasFiles] = useState<boolean | null>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [stock, setStock] = useState<string>("");

  const formRef = useRef<HTMLFormElement>(null);

  const handleClose = useCallback(() => {
    onClose();
    router.refresh();
  }, [onClose, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClose]);

  useEffect(() => {
    const fetchData = async () => {
      const teams = (await getTeams()) as Team[];
      const category = (await getCategories()) as Category[];
      const sizes = (await getSizes()) as Sizes;
      const types = (await getTypes()) as Type[];
      const colors = (await getColors()) as Color[];

      setTeamOptions(teams);
      setCategoryOptions(category);
      setSizeOptions(sizes);
      setTypeOptions(types);
      setColorOptions(colors);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory === "accessories") {
      setSelectedSizes(["One size only"]);
      setSelectedType("none");
    } else {
      setSelectedSizes([]);
      setSelectedType("");
    }
    setFieldErrors((prev) => ({
      ...prev,
      productCategory: undefined,
    }));
  }, [selectedCategory]);

  const getLanguage = (input: string) => {
    const geoRegex = /[\u10A0-\u10FF]/;
    return geoRegex.test(input) ? "ka" : "en";
  };

  const productSchema = z
    .object({
      productName: z.string().min(3, { message: t("name_required") }),
      productPrice: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() === "") return undefined;
        return parseFloat(val as string);
      }, z.number({ invalid_type_error: t("price_required") }).min(0.01, { message: t("price_required") })),
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
      productType: z.string().min(1, { message: t("type_required") }),
      productCategory: z.string().min(1, { message: t("category_required") }),
      productStock: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() === "") return undefined;
        return parseFloat(val as string);
      }, z.number({ invalid_type_error: t("stock_invalid") }).min(1, { message: t("stock_invalid") })),
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

  useEffect(() => {
    if (globalMsg.error || globalMsg.success) {
      const timer = setTimeout(() => {
        setGlobalMsg({ error: null, success: null });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [globalMsg]);

  const toggleSize = (size: string) => {
    if (selectedCategory === "accessories") return;
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setFieldErrors((prev) => ({ ...prev, productSizes: undefined }));
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
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
      productType: selectedType,
      productColors: selectedColors,
      productStock: parseFloat(rawData.get("productStock") as string),
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
      formData.append("productType", selectedType);
      formData.append("productStock", rawData.get("productStock") as string);
      selectedSizes.forEach((size) => formData.append("productSizes", size));
      selectedColors.forEach((color) =>
        formData.append("productColors", color)
      );
      console.log(formData.getAll("productImages"));
      await addNewProduct(formData);
      setGlobalMsg({ error: null, success: t("success_message") });
      setTimeout(() => {
        handleClose();
      }, 1000);
      formElem.reset();
      setSelectedSizes([]);
      setSelectedColors([]);
      setSelectedTeam("");
      setSelectedType("");
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

  const currentSizeOptions =
    selectedCategory === "shoes"
      ? sizeOptions?.shoes
      : selectedCategory === "headwear"
      ? sizeOptions?.headwear
      : selectedCategory === "accessories"
      ? sizeOptions?.accessories
      : sizeOptions?.clothes;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
      <form
        ref={formRef}
        onSubmit={onSubmitHandler}
        className=" relative bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 sm:p-8 rounded-xl shadow-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto "
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <IoClose className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>

        <h1 className="text-xl font-semibold text-f1red mx-auto">
          {t("title")}
        </h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col gap-4 w-full md:w-[27rem]">
            <div className="flex flex-col gap-1">
              <Label htmlFor="productName" className="font-semibold text-sm">
                {t("name")}
              </Label>
              <input
                type="text"
                id="productName"
                name="productName"
                placeholder={t("name_placeholder")}
                onChange={() =>
                  setFieldErrors((prev) => ({
                    ...prev,
                    productName: undefined,
                  }))
                }
                className="p-3 pl-5 rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
              {fieldErrors.productName && (
                <span className="text-sm text-red-500">
                  {fieldErrors.productName}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="productPrice" className="font-semibold text-sm">
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
                  name="productPrice"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  onChange={() =>
                    setFieldErrors((prev) => ({
                      ...prev,
                      productPrice: undefined,
                    }))
                  }
                  className="w-full p-3 pl-7 rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                />
              </div>
              {fieldErrors.productPrice && (
                <span className="text-sm text-red-500">
                  {fieldErrors.productPrice}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label
                htmlFor="productDescription"
                className="font-semibold text-sm"
              >
                {t("description")}
              </Label>
              <textarea
                id="productDescription"
                name="productDescription"
                rows={2}
                placeholder={t("description_placeholder")}
                onChange={() =>
                  setFieldErrors((prev) => ({
                    ...prev,
                    productDescription: undefined,
                  }))
                }
                className="p-3 pl-5 rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              ></textarea>
              {fieldErrors.productDescription && (
                <span className="text-sm text-red-500">
                  {fieldErrors.productDescription}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="productImages" className="font-semibold text-sm">
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
                  setFieldErrors((prev) => ({
                    ...prev,
                    productImages: undefined,
                  }));
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

            <div className="flex flex-col gap-2">
              <span className="font-semibold text-sm">{t("colors")}</span>
              <div className="grid grid-cols-6 grid-rows-2 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.code}
                    type="button"
                    onClick={() => toggleColor(color.code)}
                    className={`w-[2.25rem] h-[2.25rem] rounded-full border-4 transition-all duration-200 hover:border-blue-500 ${
                      selectedColors.includes(color.code)
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                    style={{ backgroundColor: color.value }}
                    aria-label={color.code}
                  />
                ))}
              </div>
              {fieldErrors.productColors && (
                <span className="text-sm text-red-500">
                  {fieldErrors.productColors}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-[27rem]">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-sm">{t("team")}</span>
              <div className="grid grid-cols-5 grid-rows-2 gap-2 justify-center items-center">
                {teamOptions.map((team) => (
                  <button
                    key={team.code}
                    type="button"
                    onClick={() => {
                      setSelectedTeam(team.code);
                      setFieldErrors((prev) => ({
                        ...prev,
                        productTeam: undefined,
                      }));
                    }}
                    className={`p-4 border-2 rounded-md transition-all duration-200 bg-white hover:scale-110 hover:border-blue-600 flex flex-col justify-center items-center ${
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

            <div className="flex flex-col gap-1 text-sm">
              <Label htmlFor="productCategory" className="font-semibold">
                {t("category")}
              </Label>
              <select
                id="productCategory"
                name="productCategory"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setFieldErrors((prev) => ({
                    ...prev,
                    productCategory: undefined,
                  }));
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
                <option value="">{t("select_category")}</option>
                {categoryOptions.map(({ name, value }) => (
                  <option key={name} value={name}>
                    {value[locale]}
                  </option>
                ))}
              </select>
              {fieldErrors.productCategory && (
                <span className="text-sm text-red-500">
                  {fieldErrors.productCategory}
                </span>
              )}
            </div>

            {selectedCategory && (
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-sm">{t("sizes")}</span>
                <div className="flex flex-wrap gap-1">
                  {selectedCategory === "accessories" ? (
                    <div className="pl-5 w-32 py-1 border rounded-md bg-blue-600 text-white border-blue-500">
                      {sizeOptions?.accessories[0]}
                    </div>
                  ) : (
                    currentSizeOptions?.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`py-1 border-2 rounded-md transition-colors duration-200 hover:bg-blue-600 hover:text-white hover:border-blue-500  ${
                          selectedCategory === "shoes"
                            ? "w-[4.7rem]"
                            : selectedCategory === "headwear"
                            ? "w-[5.9rem]"
                            : "w-[2.8rem]"
                        } ${
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

            {selectedCategory !== "accessories" && (
              <div className="flex flex-col gap-2">
                <span className="font-semibold">{t("type")}</span>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map(({ name, value }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        setSelectedType(name);
                        setFieldErrors((prev) => ({
                          ...prev,
                          productType: undefined,
                        }));
                      }}
                      className={`p-2 w-[7.9rem] border-2 rounded-md transition-all duration-200 hover:scale-110 hover:bg-blue-600 hover:text-white  ${
                        selectedType === name
                          ? "bg-blue-600 text-white"
                          : "bg-white text-dark border-gray-300"
                      }`}
                      aria-label={value[locale]}
                    >
                      {value[locale].toLocaleUpperCase()}
                    </button>
                  ))}
                </div>
                {fieldErrors.productType && (
                  <span className="text-sm text-red-500">
                    {fieldErrors.productType}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="productStock" className="font-semibold text-sm">
                {t("stock")}
              </Label>
              <input
                type="number"
                id="productStock"
                name="productStock"
                placeholder={t("stock_placeholder")}
                min="1"
                step="1"
                value={stock}
                onChange={(e) => {
                  setStock(e.target.value);
                  setFieldErrors((prev) => ({
                    ...prev,
                    productStock: undefined,
                  }));
                }}
                className="p-3 pl-5 rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
              {fieldErrors.productStock && (
                <span className="text-sm text-red-500">
                  {fieldErrors.productStock}
                </span>
              )}
            </div>
          </div>
        </div>

        {isSubmitting && (
          <div className="flex items-center justify-center gap-4">
            <span>{t("adding")}</span>
          </div>
        )}
        {globalMsg.error && (
          <p className="text-center text-red-500 text-base">
            {globalMsg.error}
          </p>
        )}
        {globalMsg.success && (
          <p className="text-center text-green-500 text-base">
            {globalMsg.success}
          </p>
        )}
        <SubmitButton
          type="submit"
          disabled={isSubmitting}
          className=" mt-4 w-96 sm:w-auto h-12 text-lg font-semibold mx-auto"
          pendingText={t("adding")}
        >
          {t("add")}
        </SubmitButton>
      </form>
    </div>
  );
};

export default AddProductForm;
