
import React, { useState, useEffect } from "react";
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

  useEffect(() => {
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

  const { data: subscription, isLoading: isLoadingSubscription, error: subscriptionError } = useQuery({
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
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Subscription fetch error:', error);
        throw error;
      }
      return data;
    },
    retry: 1
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
      console.log('Starting upgrade process for plan:', planType, 'with price ID:', priceId);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('No active session, redirecting to auth');
        setIsLoading(null);
        navigate('/auth');
        return;
      }

      console.log('Creating checkout session for plan:', planType);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });

      if (error) {
        console.error('Supabase function error:', error);
        setIsLoading(null);
        throw error;
      }

      if (!data?.url) {
        console.error('No checkout URL returned');
        setIsLoading(null);
        throw new Error('No checkout URL returned from server');
      }

      // Validate the URL
      try {
        new URL(data.url);
      } catch {
        console.error('Invalid checkout URL received:', data.url);
        setIsLoading(null);
        throw new Error('Invalid checkout URL received');
      }

      console.log('Valid checkout URL received, redirecting to:', data.url);
      
      // The URL in the success_url parameter (configured in create-checkout function) 
      // will bring the user back to /subscription?success=true
      window.location.href = data.url;
      
    } catch (error: any) {
      setIsLoading(null);
      console.error('Error in handleUpgrade:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process upgrade. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleManageSubscription = async (action: 'cancel' | 'resume') => {
    try {
      setIsLoading(action);
      const { error } = await supabase.functions.invoke('manage-subscription', {
        body: { action },
      });

      if (error) {
        setIsLoading(null);
        throw error;
      }

      toast({
        title: "Success",
        description: action === 'cancel' 
          ? "Your subscription will be cancelled at the end of the billing period" 
          : "Your subscription has been resumed",
      });
    } catch (error: any) {
      setIsLoading(null);
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

  if (subscriptionError) {
    console.error('Subscription error:', subscriptionError);
    return (
      <div className="flex min-h-screen bg-gradient-to-b from-[#f8f9fa] to-white">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Error Loading Subscription</h2>
              <p className="mt-2 text-gray-600">Unable to load subscription details. Please try refreshing the page.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isLoadingSubscription) {
    return (
      <div className="flex min-h-screen bg-gradient-to-b from-[#f8f9fa] to-white">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
              <p className="mt-2 text-gray-600">Please wait while we fetch your subscription details.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
