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
    const { action, paymentMethodId, isDefault, ...paymentMethodData } = await req.json();
    
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

    // Get or create Stripe customer
    let customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length === 0) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.name || user.email.split('@')[0],
      });
      customerId = customer.id;
    } else {
      customerId = customers.data[0].id;
    }

    switch (action) {
      case "create": {
        const paymentMethod = await stripe.paymentMethods.create({
          type: paymentMethodData.type,
          card: paymentMethodData.card,
          billing_details: paymentMethodData.billing_details,
        });

        await stripe.paymentMethods.attach(paymentMethod.id, { customer: customerId });

        // Save to database
        await supabaseClient.from("payment_methods").insert({
          user_id: user.id,
          stripe_payment_method_id: paymentMethod.id,
          type: paymentMethod.type,
          is_default: isDefault || false,
          card_brand: paymentMethod.card?.brand,
          card_last4: paymentMethod.card?.last4,
          card_exp_month: paymentMethod.card?.exp_month,
          card_exp_year: paymentMethod.card?.exp_year,
        });

        return new Response(JSON.stringify({ paymentMethodId: paymentMethod.id }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "delete": {
        await stripe.paymentMethods.detach(paymentMethodId);
        
        await supabaseClient
          .from("payment_methods")
          .delete()
          .eq("user_id", user.id)
          .eq("stripe_payment_method_id", paymentMethodId);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "set_default": {
        // Update default in database
        await supabaseClient
          .from("payment_methods")
          .update({ is_default: false })
          .eq("user_id", user.id);

        await supabaseClient
          .from("payment_methods")
          .update({ is_default: true })
          .eq("user_id", user.id)
          .eq("stripe_payment_method_id", paymentMethodId);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        throw new Error("Invalid action");
    }
  } catch (error) {
    console.error("Payment method error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});