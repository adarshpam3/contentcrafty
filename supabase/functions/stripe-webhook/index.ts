
import { serve } from "https://deno.fresh.dev/server.ts";
import Stripe from 'https://esm.sh/stripe@14.16.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('No signature', { status: 400 });
    }

    const body = await req.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const status = subscription.status;
        const priceId = subscription.items.data[0].price.id;

        // Get the price details from Stripe
        const price = await stripe.prices.retrieve(priceId);
        const planType = price.metadata.plan_type || 'pro'; // Default to 'pro' if not set

        // Update subscription in database
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status,
            plan_type: planType,
            stripe_subscription_id: subscription.id,
            current_period_end: new Date(subscription.current_period_end * 1000),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('stripe_customer_id', customerId);

        if (error) throw error;
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            plan_type: 'free',
            articles_remaining: 3, // Reset to free tier limits
            stripe_subscription_id: null,
            current_period_end: null,
            cancel_at_period_end: false,
          })
          .eq('stripe_customer_id', customerId);

        if (error) throw error;
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
