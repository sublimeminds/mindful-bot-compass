
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text();
  
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  try {
    const receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || "",
      undefined,
      cryptoProvider
    );

    console.log(`Received event: ${receivedEvent.type}`);

    switch (receivedEvent.type) {
      case 'checkout.session.completed': {
        const session = receivedEvent.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = receivedEvent.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = receivedEvent.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error(`Webhook error: ${err.message}`);
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const planId = session.metadata?.plan_id;
  const billingCycle = session.metadata?.billing_cycle;

  if (!userId || !planId) {
    console.error('Missing metadata in checkout session');
    return;
  }

  // Create or update subscription
  const { error } = await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      plan_id: planId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      status: 'active',
      billing_cycle: billingCycle || 'monthly',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString()
    });

  if (error) {
    console.error('Error creating subscription:', error);
    return;
  }

  // Update profile
  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('name')
    .eq('id', planId)
    .single();

  if (plan) {
    await supabase
      .from('profiles')
      .update({ 
        subscription_plan: plan.name,
        subscription_status: 'active'
      })
      .eq('id', userId);
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Error updating subscription:', error);
  }

  // Update profile status
  const { data: userSub } = await supabase
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (userSub) {
    await supabase
      .from('profiles')
      .update({ subscription_status: subscription.status })
      .eq('id', userSub.user_id);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const { data: userSub } = await supabase
    .from('user_subscriptions')
    .select('id, user_id')
    .eq('stripe_subscription_id', invoice.subscription)
    .single();

  if (userSub) {
    await supabase
      .from('billing_history')
      .insert({
        user_id: userSub.user_id,
        subscription_id: userSub.id,
        stripe_invoice_id: invoice.id,
        amount: (invoice.amount_paid || 0) / 100,
        currency: invoice.currency || 'usd',
        status: invoice.status || 'paid',
        billing_period_start: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
        billing_period_end: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null,
        paid_at: invoice.status_transitions?.paid_at ? new Date(invoice.status_transitions.paid_at * 1000).toISOString() : new Date().toISOString()
      });
  }
}
