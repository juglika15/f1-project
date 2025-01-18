import { stripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
// import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  let event: Stripe.Event;

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 }
    );
  }

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      "whsec_bcf7d4d7853eb99ad1beacecaf8b7fb007631fe0451dc2b15d21a1d2ea3dcfc0"
    );
  } catch (error) {
    console.error(error);
    return new NextResponse("webhook error", { status: 400 });
  }

  if (event.type === "customer.subscription.updated") {
    // const subscriptionId = event.data.object.id;
    // const metadata = event.data.object.metadata;
    // const supabase = await createClient();
    // // if (metadata) {
    // // const userId = metadata.userId;
    // // const { data } = await supabase.auth.getUser();
    // // const userId = data.user?.id;
    // const { error } = await supabase
    //   .from("user_profiles")
    //   .update({ is_subscribed: true })
    //   .eq("id", );
    // if (error) {
    //   console.error("Error updating subscription status:", error);
    //   return;
    // }
    // }
  }

  revalidatePath("/", "layout");

  return new NextResponse(null, { status: 200 });
}
