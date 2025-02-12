"use client"; // Ensure this is spelled correctly

import React, { useTransition } from "react";
import { CartItem } from "@/types/api";
import { removeFromCart } from "../actions/removeFromCart";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

type RemoveButtonProps = {
  item: CartItem;
  size: string;
  count: number;
};

const RemoveButton = ({ item, size, count }: RemoveButtonProps) => {
  const t = useTranslations("Cart");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleRemove() {
    try {
      await removeFromCart(item, size, count);
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleRemove}
      disabled={isPending}
      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
    >
      {t("remove")}
    </button>
  );
};

export default RemoveButton;
