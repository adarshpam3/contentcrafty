
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap, Users, Star, Crown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
    price: "$13",  // Updated to your actual price
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
    priceId: "price_1QvMPNRqYZd5RVTtRzzZHD2F" // Replace this with your actual Stripe Price ID
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

export default function Subscription() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return null;
      }

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const handleUpgrade = async (planType: string, priceId: string | null) => {
    if (!priceId) {
      toast({
        title: "Contact Sales",
        description: "Please contact our sales team for enterprise plans.",
      });
      return;
    }

    try {
      setIsLoading(planType);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });

      if (error) throw error;
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to process upgrade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleManageSubscription = async (action: 'cancel' | 'resume') => {
    try {
      setIsLoading(action);
      const { error } = await supabase.functions.invoke('manage-subscription', {
        body: { action },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: action === 'cancel' 
          ? "Your subscription will be cancelled at the end of the billing period" 
          : "Your subscription has been resumed",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to manage subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = subscription?.plan_type === plan.type;
              const isCancelled = isCurrentPlan && subscription?.cancel_at_period_end;
              
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

                    {isCurrentPlan ? (
                      <div className="space-y-3">
                        <Button
                          className="w-full h-12 text-base font-medium bg-[#e6f4ea] text-[#06962c] hover:bg-[#d1e9d5]"
                          disabled={true}
                        >
                          Current Plan
                        </Button>
                        {subscription?.status === 'active' && (
                          <Button
                            className="w-full h-12 text-base font-medium"
                            variant="outline"
                            onClick={() => handleManageSubscription(isCancelled ? 'resume' : 'cancel')}
                            disabled={isLoading === 'cancel' || isLoading === 'resume'}
                          >
                            {isLoading === 'cancel' || isLoading === 'resume' 
                              ? "Processing..." 
                              : isCancelled 
                                ? "Resume Subscription"
                                : "Cancel Subscription"
                            }
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button
                        className={`w-full h-12 text-base font-medium ${
                          plan.recommended
                            ? 'bg-[#06962c] hover:bg-[#057a24] text-white'
                            : 'bg-gray-900 hover:bg-gray-800 text-white'
                        }`}
                        onClick={() => handleUpgrade(plan.type, plan.priceId)}
                        disabled={isLoading === plan.type}
                      >
                        {isLoading === plan.type ? "Processing..." : plan.buttonText}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-3 bg-[#e6f4ea] rounded-lg">
              <Users className="h-5 w-5 text-[#06962c]" />
              <p className="text-[#06962c]">
                Need help choosing the right plan? <a href="#" className="underline font-medium">Contact our sales team</a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
