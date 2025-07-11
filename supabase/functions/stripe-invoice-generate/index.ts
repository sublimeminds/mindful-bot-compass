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
    const { customerId, lineItems, billingAddress, taxRate } = await req.json();
    
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

    // Calculate tax if applicable
    let taxAmount = 0;
    let taxType = 'none';
    if (taxRate && billingAddress) {
      const { rate, amount, type } = await calculateTax(
        lineItems.reduce((sum: number, item: any) => sum + (item.amount * item.quantity), 0),
        billingAddress.country,
        billingAddress.state
      );
      taxAmount = amount;
      taxType = type;
    }

    // Create invoice in Stripe
    const invoice = await stripe.invoices.create({
      customer: customerId,
      auto_advance: false,
      collection_method: "charge_automatically",
      metadata: {
        user_id: user.id,
        tax_rate: taxRate?.toString() || "0",
        tax_amount: taxAmount.toString(),
      },
    });

    // Add line items
    for (const item of lineItems) {
      await stripe.invoiceItems.create({
        customer: customerId,
        invoice: invoice.id,
        amount: item.amount,
        currency: item.currency || "usd",
        description: item.description,
        quantity: item.quantity || 1,
      });
    }

    // Add tax line item if applicable
    if (taxAmount > 0) {
      await stripe.invoiceItems.create({
        customer: customerId,
        invoice: invoice.id,
        amount: Math.round(taxAmount * 100), // Convert to cents
        currency: "usd",
        description: `${taxType.toUpperCase()} Tax`,
      });
    }

    // Finalize invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

    // Generate invoice number
    const { data: invoiceNumberData } = await supabaseClient.rpc('generate_invoice_number');
    const invoiceNumber = invoiceNumberData;

    // Save to database
    await supabaseClient.from("invoices").insert({
      user_id: user.id,
      invoice_number: invoiceNumber,
      stripe_invoice_id: finalizedInvoice.id,
      status: finalizedInvoice.status,
      amount_subtotal: finalizedInvoice.subtotal / 100,
      amount_tax: taxAmount,
      amount_total: finalizedInvoice.total / 100,
      currency: finalizedInvoice.currency,
      tax_rate: taxRate,
      tax_country: billingAddress?.country,
      tax_type: taxType,
      invoice_date: new Date(finalizedInvoice.created * 1000).toISOString(),
      payment_due_date: finalizedInvoice.due_date ? new Date(finalizedInvoice.due_date * 1000).toISOString() : null,
      pdf_url: finalizedInvoice.invoice_pdf,
      line_items: lineItems,
    });

    return new Response(JSON.stringify({ 
      invoice: finalizedInvoice,
      invoiceNumber,
      taxAmount,
      taxType 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Invoice generation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function calculateTax(amount: number, country: string, state?: string) {
  // Simple tax calculation - in production, use a proper tax service
  const taxRates: Record<string, number> = {
    'US': 0.08, // Average US sales tax
    'GB': 0.20, // UK VAT
    'DE': 0.19, // German VAT
    'FR': 0.20, // French VAT
    'CA': 0.13, // Canadian HST average
  };

  const rate = taxRates[country.toUpperCase()] || 0;
  const taxAmount = amount * rate;
  const type = country === 'US' ? 'sales_tax' : 'vat';

  return { rate, amount: taxAmount, type };
}