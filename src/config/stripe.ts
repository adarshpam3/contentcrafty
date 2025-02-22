
// Do not include secret keys here - only publishable key
export const STRIPE_PUBLISHABLE_KEY = "pk_test_xxxxxxxxxxxxx"; // Replace with your actual publishable key

export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: "Starter",
    priceId: null,
    features: [
      "3 articles per month",
      "Basic AI writing",
      "Manual topic creation",
      "Standard support",
    ],
  },
  PRO: {
    name: "Pro Writer",
    priceId: "price_xxxxx", // Replace with your Stripe price ID
    features: [
      "50 articles per month",
      "Advanced AI writing",
      "SERP Analysis",
      "Priority support",
      "Content optimization",
      "Bulk generation",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    priceId: "price_yyyy", // Replace with your Stripe price ID
    features: [
      "Unlimited articles",
      "Advanced AI writing",
      "SERP Analysis",
      "24/7 Premium support",
      "Content optimization",
      "Bulk generation",
      "Custom integrations",
      "Team collaboration",
    ],
  },
} as const;

// Types for subscription statuses
export type SubscriptionStatus = 
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'trialing'
  | 'unpaid';
