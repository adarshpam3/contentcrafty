
import Stripe from 'https://esm.sh/stripe@13.11.0';

Deno.serve(async (req) => {
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
    apiVersion: '2023-10-16',
  });

  try {
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      return new Response('Webhook signature missing', { status: 400 });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      return new Response('Webhook secret not configured', { status: 500 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.39.0');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const subscriptionId = session.subscription;
        const customerId = session.customer;
        
        if (typeof subscriptionId !== 'string' || typeof customerId !== 'string') {
          throw new Error('Invalid subscription or customer ID');
        }

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata.user_id;

        if (!userId) {
          throw new Error('User ID not found in subscription metadata');
        }

        // Update the user's subscription in the database
        await supabase
          .from('subscriptions')
          .update({
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: customerId,
            plan_type: 'pro',
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            articles_remaining: 50 // Reset to 50 articles for the Pro plan
          })
          .eq('user_id', userId);

        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata.user_id;
        
        if (!userId) {
          throw new Error('User ID not found in subscription metadata');
        }

        // Update subscription status
        await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            // Only reset articles if this is a renewal (new period)
            ...(subscription.status === 'active' && { articles_remaining: 50 })
          })
          .eq('user_id', userId);
          
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata.user_id;
        
        if (!userId) {
          throw new Error('User ID not found in subscription metadata');
        }

        // Downgrade to free plan
        await supabase
          .from('subscriptions')
          .update({
            plan_type: 'free',
            status: 'canceled',
            articles_remaining: 3, // Reset to free plan limit
            stripe_subscription_id: null
          })
          .eq('user_id', userId);
          
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});
