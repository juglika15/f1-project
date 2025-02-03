"use client";

import { addNewProduct } from "../actions/add_product";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useState, useEffect } from "react";
import { SubmitButton } from "./auth/SubmitButton";
import { Label } from "@radix-ui/react-label";
import { BsCurrencyDollar } from "react-icons/bs";

interface ProductFormErrors {
  productName?: string | string[];
  productPrice?: string | string[] | number;
  productDescription?: string | string[];
  productImages?: string | string[];
}

const AddProductForm = () => {
  const t = useTranslations("AddProductForm");

  const getLanguage = (input: string) => {
    const geoRegex = /[\u10A0-\u10FF]/;
    return geoRegex.test(input) ? "ka" : "en";
  };

  const productSchema = z
    .object({
      productName: z.string().min(3, { message: t("name_required") }),
      productPrice: z.number().min(0.01, { message: t("price_required") }),
      productDescription: z
        .string()
        .min(10, { message: t("description_required") }),
      productImages: z.preprocess(
        (val) => {
          if (val instanceof FileList) {
            return Array.from(val).filter((file) => file && file.name);
          }
          if (Array.isArray(val)) {
            return val.filter((file) => file && file.name);
          }
          return [];
        },

        z
          .array(
            z.custom<File>((file) => file && typeof file.name === "string", {
              message: t("images_required"),
            })
          )
          .min(1, { message: t("images_required") })
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

  useEffect(() => {
    if (globalMsg.error || globalMsg.success) {
      const timer = setTimeout(() => {
        setGlobalMsg({ error: null, success: null });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [globalMsg]);

  const onSubmitHandler = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const formElem = evt.currentTarget;
    const rawData = new FormData(formElem);
    const payload = {
      productName: rawData.get("productName") as string,
      productPrice: parseFloat(rawData.get("productPrice") as string),
      productDescription: rawData.get("productDescription") as string,
      productImages: rawData.getAll("productImages") as File[],
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
      await addNewProduct(new FormData(formElem));
      setGlobalMsg({ error: null, success: t("success_message") });
      formElem.reset();
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
      className="flex flex-col gap-6 p-8 rounded-xl shadow-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-w-96 mb-24 w-40"
    >
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
      <div className="flex flex-col gap-2">
        <label htmlFor="productDescription" className="font-semibold">
          {t("description")}
        </label>
        <textarea
          id="productDescription"
          name="productDescription"
          rows={4}
          placeholder={t("description_placeholder")}
          className="p-3 pl-5 rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        ></textarea>
        {fieldErrors.productDescription && (
          <span className="text-sm text-red-500">
            {fieldErrors.productDescription}
          </span>
        )}
      </div>
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
          className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {fieldErrors.productImages && (
          <span className="text-sm text-red-500">
            {fieldErrors.productImages}
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
      >
        {isSubmitting ? t("adding") : globalMsg.error ? t("retry") : t("add")}
      </SubmitButton>
    </form>
  );
};

export default AddProductForm;
