"use client";

import {
  cancelSubscription,
  cancelSubscriptionImmediately,
} from "@/app/actions/stripe_actions";
import { updateProfileAction } from "../actions/supabase_actions";
import { Button } from "./ui/button";

const CanceleSubscriptionButtons = ({
  subscriptionId,
  startDate,
}: {
  subscriptionId: string;
  startDate: string;
}) => {
  async function handleImadiateCancel() {
    await cancelSubscriptionImmediately(subscriptionId);
    await updateProfileAction(false, null);
    window.location.reload();
  }
  async function handlePeriodicCancel() {
    const subStartDate = new Date(startDate);
    subStartDate.setMonth(subStartDate.getMonth() + 1);
    const endDate = subStartDate.toLocaleDateString();

    await cancelSubscription(subscriptionId);
    console.log("start date", startDate);
    console.log("end date", endDate);
    await updateProfileAction(true, subscriptionId, startDate, endDate);
    window.location.reload();
  }

  return (
    <>
      <Button onClick={handleImadiateCancel}>
        cancel subscription immediately
      </Button>
      <Button onClick={handlePeriodicCancel}>
        cancel subscription at the end of the period
      </Button>
    </>
  );
};
export default CanceleSubscriptionButtons;
