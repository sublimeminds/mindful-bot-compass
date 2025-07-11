import { supabase } from '@/integrations/supabase/client';

export interface PaymentMethod {
  id: string;
  type: string;
  isDefault: boolean;
  cardBrand?: string;
  cardLast4?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  bankAccountLast4?: string;
  bankAccountType?: string;
}

export interface BillingAddress {
  id: string;
  isDefault: boolean;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  taxId?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  amountSubtotal: number;
  amountTax: number;
  amountTotal: number;
  currency: string;
  taxRate?: number;
  taxCountry?: string;
  taxType?: string;
  invoiceDate: string;
  paymentDueDate?: string;
  pdfUrl?: string;
  lineItems: any[];
}

export interface SubscriptionChange {
  id: string;
  changeType: string;
  fromPlanId?: string;
  toPlanId?: string;
  prorationAmount?: number;
  effectiveDate: string;
  reason?: string;
}

export interface FailedPayment {
  id: string;
  amount: number;
  currency: string;
  failureReason?: string;
  retryCount: number;
  nextRetryAt?: string;
  createdAt: string;
}

export interface TaxRate {
  countryCode: string;
  stateCode?: string;
  taxType: string;
  rate: number;
  description: string;
}

export class AdvancedBillingService {
  // Payment Methods
  static async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(pm => ({
      id: pm.id,
      type: pm.type,
      isDefault: pm.is_default,
      cardBrand: pm.card_brand,
      cardLast4: pm.card_last4,
      cardExpMonth: pm.card_exp_month,
      cardExpYear: pm.card_exp_year,
      bankAccountLast4: pm.bank_account_last4,
      bankAccountType: pm.bank_account_type
    })) || [];
  }

  static async setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('user_id', userId)
      .eq('id', paymentMethodId);

    if (error) throw error;
  }

  static async deletePaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('user_id', userId)
      .eq('id', paymentMethodId);

    if (error) throw error;
  }

  // Billing Addresses
  static async getBillingAddresses(userId: string): Promise<BillingAddress[]> {
    const { data, error } = await supabase
      .from('billing_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(addr => ({
      id: addr.id,
      isDefault: addr.is_default,
      line1: addr.line1,
      line2: addr.line2,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postal_code,
      country: addr.country,
      taxId: addr.tax_id
    })) || [];
  }

  static async createBillingAddress(userId: string, address: Omit<BillingAddress, 'id'>): Promise<void> {
    const { error } = await supabase
      .from('billing_addresses')
      .insert({
        user_id: userId,
        is_default: address.isDefault,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        postal_code: address.postalCode,
        country: address.country,
        tax_id: address.taxId
      });

    if (error) throw error;
  }

  static async updateBillingAddress(userId: string, addressId: string, address: Partial<BillingAddress>): Promise<void> {
    const { error } = await supabase
      .from('billing_addresses')
      .update({
        is_default: address.isDefault,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        postal_code: address.postalCode,
        country: address.country,
        tax_id: address.taxId
      })
      .eq('user_id', userId)
      .eq('id', addressId);

    if (error) throw error;
  }

  // Invoices
  static async getInvoices(userId: string, limit = 50): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('invoice_date', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data?.map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoice_number,
      status: inv.status,
      amountSubtotal: parseFloat(inv.amount_subtotal.toString()),
      amountTax: parseFloat(inv.amount_tax.toString()),
      amountTotal: parseFloat(inv.amount_total.toString()),
      currency: inv.currency,
      taxRate: inv.tax_rate ? parseFloat(inv.tax_rate.toString()) : undefined,
      taxCountry: inv.tax_country,
      taxType: inv.tax_type,
      invoiceDate: inv.invoice_date,
      paymentDueDate: inv.payment_due_date,
      pdfUrl: inv.pdf_url,
      lineItems: Array.isArray(inv.line_items) ? inv.line_items : []
    })) || [];
  }

  // Subscription Changes
  static async getSubscriptionChanges(userId: string): Promise<SubscriptionChange[]> {
    const { data, error } = await supabase
      .from('subscription_changes')
      .select('*')
      .eq('user_id', userId)
      .order('effective_date', { ascending: false });

    if (error) throw error;

    return data?.map(change => ({
      id: change.id,
      changeType: change.change_type,
      fromPlanId: change.from_plan_id,
      toPlanId: change.to_plan_id,
      prorationAmount: change.proration_amount ? parseFloat(change.proration_amount.toString()) : undefined,
      effectiveDate: change.effective_date,
      reason: change.reason
    })) || [];
  }

  // Failed Payments
  static async getFailedPayments(userId: string): Promise<FailedPayment[]> {
    const { data, error } = await supabase
      .from('failed_payments')
      .select('*')
      .eq('user_id', userId)
      .is('resolved_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(payment => ({
      id: payment.id,
      amount: parseFloat(payment.amount.toString()),
      currency: payment.currency,
      failureReason: payment.failure_reason,
      retryCount: payment.retry_count,
      nextRetryAt: payment.next_retry_at,
      createdAt: payment.created_at
    })) || [];
  }

  // Tax Calculation
  static async calculateTax(amount: number, country: string, state?: string): Promise<{ rate: number; amount: number; type: string }> {
    let query = supabase
      .from('tax_rates')
      .select('*')
      .eq('country_code', country.toUpperCase())
      .eq('is_active', true)
      .lte('effective_from', new Date().toISOString())
      .or('effective_until.is.null,effective_until.gte.' + new Date().toISOString());

    if (state) {
      query = query.eq('state_code', state.toUpperCase());
    }

    const { data, error } = await query.maybeSingle();

    if (error) throw error;

    if (!data) {
      return { rate: 0, amount: 0, type: 'none' };
    }

    const taxRate = parseFloat(data.rate.toString());
    const taxAmount = amount * taxRate;

    return {
      rate: taxRate,
      amount: Math.round(taxAmount * 100) / 100,
      type: data.tax_type
    };
  }

  // Stripe Integration Methods
  static async createPaymentMethod(paymentMethodData: any): Promise<string> {
    const { data, error } = await supabase.functions.invoke('stripe-payment-method', {
      body: { action: 'create', ...paymentMethodData }
    });

    if (error) throw error;
    return data.paymentMethodId;
  }

  static async updateSubscriptionPaymentMethod(subscriptionId: string, paymentMethodId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('stripe-subscription-update', {
      body: { subscriptionId, paymentMethodId }
    });

    if (error) throw error;
  }

  static async changeSubscriptionPlan(subscriptionId: string, newPlanId: string, prorationBehavior: string = 'create_prorations'): Promise<void> {
    const { error } = await supabase.functions.invoke('stripe-subscription-change', {
      body: { subscriptionId, newPlanId, prorationBehavior }
    });

    if (error) throw error;
  }

  static async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true): Promise<void> {
    const { error } = await supabase.functions.invoke('stripe-subscription-cancel', {
      body: { subscriptionId, cancelAtPeriodEnd }
    });

    if (error) throw error;
  }

  static async retryFailedPayment(invoiceId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('stripe-retry-payment', {
      body: { invoiceId }
    });

    if (error) throw error;
  }

  static async getCustomerPortalUrl(): Promise<string> {
    const { data, error } = await supabase.functions.invoke('stripe-customer-portal');
    
    if (error) throw error;
    return data.url;
  }
}