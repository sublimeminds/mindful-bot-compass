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
    const { failedPaymentId, invoiceId } = await req.json();
    
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

    let result;

    if (failedPaymentId) {
      // Retry failed payment by payment ID
      const { data: failedPayment } = await supabaseClient
        .from('failed_payments')
        .select('*')
        .eq('id', failedPaymentId)
        .eq('user_id', user.id)
        .single();

      if (!failedPayment) {
        throw new Error("Failed payment not found");
      }

      if (failedPayment.stripe_payment_intent_id) {
        // Retry payment intent
        result = await stripe.paymentIntents.confirm(failedPayment.stripe_payment_intent_id);
      } else if (failedPayment.stripe_invoice_id) {
        // Retry invoice payment
        result = await stripe.invoices.pay(failedPayment.stripe_invoice_id);
      }

      // Update retry count
      await supabaseClient
        .from('failed_payments')
        .update({ 
          retry_count: failedPayment.retry_count + 1,
          next_retry_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', failedPaymentId);

    } else if (invoiceId) {
      // Retry invoice payment directly
      result = await stripe.invoices.pay(invoiceId);
    } else {
      throw new Error("Either failedPaymentId or invoiceId is required");
    }

    return new Response(JSON.stringify({ 
      success: true, 
      status: result.status 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Payment retry error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});