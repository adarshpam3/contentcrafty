import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PricingCard } from "@/components/subscription/PricingCard";
import { PricingHeader } from "@/components/subscription/PricingHeader";
import { ContactSupport } from "@/components/subscription/ContactSupport";
import { SubscriptionDetails } from "@/components/subscription/SubscriptionDetails";
import { plans } from "@/config/plans";

export default function Subscription() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  React.useEffect(() => {
    if (success) {
      toast({
        title: "Success!",
        description: "Your subscription has been activated.",
      });
    } else if (canceled) {
      toast({
        title: "Checkout canceled",
        description: "You can try again whenever you're ready.",
      });
    }
  }, [success, canceled, toast]);

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

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      if (!data?.url) {
        console.error('No checkout URL returned:', data);
        throw new Error('Failed to create checkout session');
      }

      window.location.href = data.url;
    } catch (error) {
      console.error('Error in handleUpgrade:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process upgrade. Please try again.",
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
          <PricingHeader />

          {subscription && (
            <div className="max-w-xl mx-auto">
              <SubscriptionDetails subscription={subscription} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const isCurrentPlan = subscription?.plan_type === plan.type;
              const isCancelled = isCurrentPlan && subscription?.cancel_at_period_end;
              
              return (
                <PricingCard
                  key={plan.type}
                  {...plan}
                  isCurrentPlan={isCurrentPlan}
                  isCancelled={isCancelled}
                  isLoading={isLoading === plan.type}
                  subscriptionStatus={subscription?.status}
                  onUpgrade={handleUpgrade}
                  onManageSubscription={handleManageSubscription}
                />
              );
            })}
          </div>

          <ContactSupport />
        </div>
      </main>
    </div>
  );
}
