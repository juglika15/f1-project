"use client";

import { subscribeAction } from "../actions/stripe_actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

function SubscribeButton({ userId }: { userId: string }) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleClickSubscribeButton = async () => {
    startTransition(async () => {
      const { url } = await subscribeAction({ userId });
      if (url) {
        router.push(url);
      } else {
        console.error("Failed to create subscription session");
      }
    });
  };

  return (
    <button
      disabled={isPending}
      onClick={handleClickSubscribeButton}
      className="mt-8 w-full bg-f1red text-white py-2 px-4 rounded-md hover:bg-red-700"
    >
      Subscribe
    </button>
  );
}

export default SubscribeButton;
