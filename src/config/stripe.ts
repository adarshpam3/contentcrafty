
import { Star, Zap, Crown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Do not include secret keys here - only publishable key
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_xxxxxxxxxxxxx";

interface SubscriptionPlan {
  name: string;
  priceId: string | null;
  features: readonly string[];
  price: string;
  period?: string;
  description?: string;
  icon?: typeof Star | typeof Zap | typeof Crown;
  buttonText: string;
  type: 'free' | 'pro' | 'enterprise';
  recommended?: boolean;
}

export const SUBSCRIPTION_PLANS: {
  FREE: SubscriptionPlan;
  PRO: SubscriptionPlan;
  ENTERPRISE: SubscriptionPlan;
} = {
  FREE: {
    name: "Starter",
    priceId: null,
    price: "Free",
    type: "free",
    buttonText: "Current Plan",
    features: [
      "3 articles per month",
      "Basic AI writing",
      "Manual topic creation",
      "Standard support",
    ],
    icon: Star,
  },
  PRO: {
    name: "Pro Writer",
    priceId: "price_xxxxx", // Replace with your Stripe price ID
    price: "$29",
    period: "month",
    type: "pro",
    buttonText: "Upgrade to Pro",
    description: "Best for professional content creators",
    icon: Zap,
    recommended: true,
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
    price: "$99",
    period: "month",
    type: "enterprise",
    buttonText: "Contact Sales",
    description: "For teams and agencies",
    icon: Crown,
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
