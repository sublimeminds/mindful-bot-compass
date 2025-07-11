import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, subscriptionId, newPlanId, paymentMethodId, prorationBehavior = "create_prorations" } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    switch (action) {
      case "change_plan": {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const currentPlan = subscription.items.data[0].price.id;

        const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          items: [
            {
              id: subscription.items.data[0].id,
              price: newPlanId,
            },
          ],
          proration_behavior: prorationBehavior,
        });

        // Record the change
        await supabaseClient.from("subscription_changes").insert({
          user_id: user.id,
          subscription_id: subscriptionId,
          change_type: "plan_change",
          from_plan_id: currentPlan,
          to_plan_id: newPlanId,
          effective_date: new Date().toISOString(),
          reason: "User-initiated plan change",
        });

        return new Response(JSON.stringify({ subscription: updatedSubscription }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "update_payment_method": {
        await stripe.subscriptions.update(subscriptionId, {
          default_payment_method: paymentMethodId,
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "cancel": {
        const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });

        // Record the cancellation
        await supabaseClient.from("subscription_changes").insert({
          user_id: user.id,
          subscription_id: subscriptionId,
          change_type: "cancellation",
          effective_date: new Date(canceledSubscription.cancel_at! * 1000).toISOString(),
          reason: "User-initiated cancellation",
        });

        return new Response(JSON.stringify({ subscription: canceledSubscription }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "reactivate": {
        const reactivatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: false,
        });

        // Record the reactivation
        await supabaseClient.from("subscription_changes").insert({
          user_id: user.id,
          subscription_id: subscriptionId,
          change_type: "reactivation",
          effective_date: new Date().toISOString(),
          reason: "User-initiated reactivation",
        });

        return new Response(JSON.stringify({ subscription: reactivatedSubscription }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        throw new Error("Invalid action");
    }
  } catch (error) {
    console.error("Subscription update error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});