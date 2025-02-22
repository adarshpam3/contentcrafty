
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLISHABLE_KEY } from '@/config/stripe';

// Initialize Stripe
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
