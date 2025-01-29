"use client";

import {
  updateSubscription,
  cancelSubscriptionImmediately,
} from "@/app/actions/stripe_actions";
import { updateProfileAction } from "../actions/supabase_actions";
import { Button } from "./ui/button";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";

const CanceleSubscriptionButtons = ({
  subscriptionId,
  startDate,
}: {
  subscriptionId: string;
  startDate: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const handleCLick = (type: string) => {
    if (type === "immediate") {
      setType("immediate");
      setMessage(
        "Are you sure you want to cancel your subscription immediately?"
      );
    } else {
      setType("periodic");
      setMessage(
        "Are you sure you want to cancel your subscription at the end of the period?"
      );
    }
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = async () => {
    if (type === "immediate") {
      await handleImadiateCancel();
    } else {
      await handlePeriodicCancel();
    }
    setIsModalOpen(false);
  };

  async function handleImadiateCancel() {
    await cancelSubscriptionImmediately(subscriptionId);
    await updateProfileAction(false, null);
  }
  async function handlePeriodicCancel() {
    const subStartDate = new Date(startDate);
    subStartDate.setMonth(subStartDate.getMonth() + 1);
    const endDate = subStartDate.toLocaleDateString();

    await updateSubscription(subscriptionId);
    await updateProfileAction(true, subscriptionId, startDate, endDate);
  }

  return (
    <>
      <Button onClick={() => handleCLick("immediate")}>
        cancel subscription immediately
      </Button>
      <Button onClick={() => handleCLick("periodic")}>
        cancel subscription at the end of the period
      </Button>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        message={message}
      />
    </>
  );
};
export default CanceleSubscriptionButtons;
