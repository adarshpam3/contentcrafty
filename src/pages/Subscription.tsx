
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap, Users, Star, Crown, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const plans = [
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
    price: "$29",
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
    priceId: "price_xxxxx" // Replace with your Stripe price ID
  },
  {
    name: "Enterprise",
    price: "$99",
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
    priceId: "price_yyyy" // Replace with your Stripe price ID
  }
];

export default function Subscription() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: subscription, refetch: refetchSubscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*, profiles(stripe_customer_id)")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const createCheckoutSession = async (priceId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/functions/v1/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({ priceId }),
      });

      const { url, error } = await response.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const manageSubscriptionMutation = useMutation({
    mutationFn: async (action: 'cancel' | 'resume') => {
      const response = await fetch('/functions/v1/manage-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('Failed to manage subscription');
      }

      return response.json();
    },
    onSuccess: () => {
      refetchSubscription();
      toast({
        title: "Success",
        description: "Subscription updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    },
  });

  const handleUpgrade = async (plan: typeof plans[0]) => {
    if (!plan.priceId) {
      toast({
        title: "Contact Sales",
        description: "Please contact our sales team for enterprise plans",
      });
      return;
    }

    await createCheckoutSession(plan.priceId);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#f8f9fa] to-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Choose Your Plan</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan that matches your content creation needs. Upgrade or downgrade anytime.
            </p>
          </div>

          {subscription?.cancel_at_period_end && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-800">
                Your subscription will end on{" "}
                {new Date(subscription.current_period_end).toLocaleDateString()}
                <Button
                  variant="link"
                  onClick={() => manageSubscriptionMutation.mutate('resume')}
                  className="ml-2 text-[#06962c]"
                >
                  Resume Subscription
                </Button>
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = subscription?.plan_type === plan.type;
              const canUpgrade = subscription?.plan_type === 'free' || 
                               (subscription?.plan_type === 'pro' && plan.type === 'enterprise');
              
              return (
                <Card 
                  key={plan.type}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                    plan.recommended 
                      ? 'border-2 border-[#06962c] shadow-md' 
                      : 'border border-gray-200'
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute top-5 right-5">
                      <span className="bg-[#06962c] text-white px-3 py-1 rounded-full text-sm font-medium">
                        Recommended
                      </span>
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-2 rounded-lg ${
                        plan.recommended 
                          ? 'bg-[#e6f4ea] text-[#06962c]' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">{plan.name}</h2>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        {plan.period && (
                          <span className="text-gray-500">/{plan.period}</span>
                        )}
                      </div>
                      <p className="mt-2 text-gray-600">{plan.description}</p>
                    </div>

                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="mt-1">
                            <Check className={`h-4 w-4 ${
                              plan.recommended 
                                ? 'text-[#06962c]' 
                                : 'text-gray-600'
                            }`} />
                          </div>
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className={`w-full h-12 text-base font-medium ${
                        isCurrentPlan
                          ? 'bg-[#e6f4ea] text-[#06962c] hover:bg-[#d1e9d5]'
                          : plan.recommended
                            ? 'bg-[#06962c] hover:bg-[#057a24] text-white'
                            : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                      onClick={() => {
                        if (isCurrentPlan && subscription?.stripe_subscription_id) {
                          manageSubscriptionMutation.mutate('cancel');
                        } else if (canUpgrade) {
                          handleUpgrade(plan);
                        }
                      }}
                      disabled={isLoading || (!canUpgrade && !isCurrentPlan)}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : isCurrentPlan ? (
                        subscription?.stripe_subscription_id ? "Cancel Plan" : "Current Plan"
                      ) : (
                        plan.buttonText
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-3 bg-[#e6f4ea] rounded-lg">
              <Users className="h-5 w-5 text-[#06962c]" />
              <p className="text-[#06962c]">
                Need help choosing the right plan? <Button variant="link" className="p-0 h-auto text-[#06962c] underline">Contact our sales team</Button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
