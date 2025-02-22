
import Stripe from 'stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('No signature found', { status: 400 });
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`⚠️  Webhook signature verification failed.`, err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const { supabaseClient } = await import("@supabase/supabase-js");
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = supabaseClient(supabaseUrl, supabaseKey);

    // Handle subscription events
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Get the customer to find their email
        const customer = await stripe.customers.retrieve(customerId);
        if (!customer.email) break;
        
        // Get the price details
        const priceId = subscription.items.data[0].price.id;
        const { data: prices } = await supabase
          .from('stripe_prices')
          .select('*')
          .eq('id', priceId)
          .single();

        // Update subscription in database
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            price: subscription.items.data[0].price.unit_amount ? subscription.items.data[0].price.unit_amount / 100 : 0,
            plan_type: prices?.type || 'pro',
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: customerId,
          })
          .eq('user_id', customer.metadata.user_id);

        if (error) {
          console.error('Error updating subscription:', error);
          return new Response(JSON.stringify({ error: error.message }), { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Get the customer to find their email
        const customer = await stripe.customers.retrieve(customerId);
        if (!customer.email) break;
        
        // Update subscription in database
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            cancel_at_period_end: false,
            stripe_subscription_id: null,
          })
          .eq('user_id', customer.metadata.user_id);

        if (error) {
          console.error('Error updating subscription:', error);
          return new Response(JSON.stringify({ error: error.message }), { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
