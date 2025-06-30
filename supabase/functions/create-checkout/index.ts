
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    logStep("User authenticated", { userId: user.id, email: user.email });

    const { planId, billingCycle, redirectUrl } = await req.json();

    // Get plan details from database
    const { data: plan, error: planError } = await supabaseClient
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      throw new Error("Invalid plan selected");
    }

    logStep("Plan found", { planName: plan.name, planId });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
      logStep("New customer created", { customerId });
    }

    const price = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
    const trialPeriodDays = plan.trial_days || 7;
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: `TherapySync ${plan.name} Plan`,
              description: `TherapySync ${plan.name} subscription - ${billingCycle} billing`
            },
            unit_amount: Math.round(price * 100),
            recurring: {
              interval: billingCycle === 'yearly' ? 'year' : 'month'
            }
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: redirectUrl || `${req.headers.get("origin")}/onboarding?success=true&plan=${plan.name}`,
      cancel_url: `${req.headers.get("origin")}/pricing?canceled=true`,
      subscription_data: {
        trial_period_days: trialPeriodDays,
        metadata: {
          user_id: user.id,
          plan_id: planId,
          billing_cycle: billingCycle
        }
      },
      metadata: {
        user_id: user.id,
        plan_id: planId,
        billing_cycle: billingCycle
      }
    });

    logStep("Checkout session created", { sessionId: session.id });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
