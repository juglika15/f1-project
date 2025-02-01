import { updateProfileAction } from "@/app/actions/supabase";
import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import type { Stripe } from "stripe";
import { stripe } from "@/lib/stripe";

const updateSubscription = async (session_id: string, user: User) => {
  const supabase = await createClient();
  const { data: checkData } = await supabase
    .from("user_profiles")
    .select("is_subscribed")
    .eq("id", user?.id)
    .single();

  if (session_id && !checkData?.is_subscribed) {
    try {
      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.retrieve(session_id, {
          expand: ["line_items", "payment_intent"],
        });
      if (checkoutSession.status === "complete") {
        const startDate = new Date(
          checkoutSession.created * 1000
        ).toLocaleString();
        await updateProfileAction(
          true,
          checkoutSession.subscription as string,
          startDate
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  return;
};

export default updateSubscription;
