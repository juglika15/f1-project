"use client";

import { cancelSubscription } from "../actions/stripe_actions";
import { updateEndDate } from "../actions/supabase_actions";
import { Button } from "./ui/button";

const RenewSubscription = ({ subscriptionId }: { subscriptionId: string }) => {
  async function handleClick() {
    await cancelSubscription(subscriptionId, false);
    await updateEndDate();
    window.location.reload();
  }
  return <Button onClick={handleClick}>Renew Subscription</Button>;
};

export default RenewSubscription;
