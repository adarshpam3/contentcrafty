
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out our service",
    features: [
      "3 articles per month",
      "Basic AI writing",
      "Manual topic creation",
      "Standard support",
    ],
    buttonText: "Current Plan",
    type: "free"
  },
  {
    name: "Pro Writer",
    price: "$29",
    period: "month",
    description: "Best for professional content creators",
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
    recommended: true
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "month",
    description: "For teams and agencies",
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
    type: "enterprise"
  }
];

export default function Subscription() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const { data: subscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleUpgrade = async (planType: string) => {
    // This would typically integrate with a payment provider
    toast({
      title: "Coming Soon",
      description: "Payment integration will be available soon!",
    });
    setSelectedPlan(planType);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Subscription Plans</h1>
            <p className="text-gray-600">Choose the perfect plan for your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.type}
                className={`p-6 relative ${
                  plan.recommended 
                    ? 'border-2 border-purple-500' 
                    : ''
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                      Recommended
                    </span>
                  </div>
                )}
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">{plan.name}</h2>
                    <div className="flex items-end">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-gray-500 ml-1">/{plan.period}</span>
                      )}
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      subscription?.plan_type === plan.type
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                    onClick={() => handleUpgrade(plan.type)}
                    disabled={subscription?.plan_type === plan.type}
                  >
                    {subscription?.plan_type === plan.type
                      ? "Current Plan"
                      : plan.buttonText}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center text-gray-600">
            <p>Need help choosing the right plan? Contact our sales team</p>
          </div>
        </div>
      </main>
    </div>
  );
}
