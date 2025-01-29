"use client";

import { useState } from "react";
import { updateSubscription } from "../actions/stripe_actions";
import { updateEndDate } from "../actions/supabase_actions";
import ConfirmModal from "./ConfirmModal";
import { Button } from "./ui/button";

const RenewSubscription = ({ subscriptionId }: { subscriptionId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = async () => {
    await handleRenewal();
    setIsModalOpen(false);
  };

  async function handleRenewal() {
    await updateSubscription(subscriptionId, false);
    await updateEndDate();
  }
  return (
    <>
      <Button onClick={handleClick}>Renew Subscription</Button>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        message="Are you sure you want to renew your subscription?"
      />
    </>
  );
};

export default RenewSubscription;
