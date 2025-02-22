
import { Star, Zap, Crown } from "lucide-react";

export const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out our service",
    icon: Star,
    features: [
      "3 articles per month",
      "Basic AI writing",
      "Manual topic creation",
      "Standard support",
    ],
    buttonText: "Current Plan",
    type: "free",
    priceId: null
  },
  {
    name: "Pro Writer",
    price: "$13",
    period: "month",
    description: "Best for professional content creators",
    icon: Zap,
    features: [
      "50 articles per month",
      "Advanced AI writing",
      "SERP Analysis",
      "Priority support",
      "Content optimization",
      "Bulk generation"
    ],
    buttonText: "Upgrade to Pro",
    type: "pro",
    recommended: true,
    priceId: "price_1QvMPNRqYZd5RVTtRzzZHD2F"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "month",
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
      "Team collaboration"
    ],
    buttonText: "Contact Sales",
    type: "enterprise",
    priceId: null
  }
];
