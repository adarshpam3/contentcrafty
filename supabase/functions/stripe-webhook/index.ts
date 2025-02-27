
import Stripe from 'https://esm.sh/stripe@13.11.0';

Deno.serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing stripe-signature header' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!stripeKey || !stripeWebhookSecret) {
      return new Response(JSON.stringify({ error: 'Stripe configuration is missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    const body = await req.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        stripeWebhookSecret
      );
    } catch (err) {
      return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.39.0');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const customerId = session.customer;
        
        // Get user ID from customer
        const { data: userData } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .maybeSingle();
          
        if (userData) {
          // Update subscription
          const { error } = await supabase
            .from('subscriptions')
            .update({
              stripe_subscription_id: subscription.id,
              plan_type: 'pro',
              status: subscription.status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              articles_remaining: 50
            })
            .eq('user_id', userData.user_id);
            
          if (error) {
            console.error('Error updating subscription:', error);
          }
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Get user ID from customer
        const { data: userData } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .maybeSingle();
          
        if (userData) {
          // Update subscription
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: subscription.status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('user_id', userData.user_id);
            
          if (error) {
            console.error('Error updating subscription:', error);
          }
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Get user ID from customer
        const { data: userData } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .maybeSingle();
          
        if (userData) {
          // Update subscription
          const { error } = await supabase
            .from('subscriptions')
            .update({
              stripe_subscription_id: null,
              plan_type: 'free',
              status: 'inactive',
              articles_remaining: 3
            })
            .eq('user_id', userData.user_id);
            
          if (error) {
            console.error('Error updating subscription:', error);
          }
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
