
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { PlanCard } from "@/components/subscription/PlanCard";
import { SubscriptionDetails } from "@/components/subscription/SubscriptionDetails";
import { ContactSales } from "@/components/subscription/ContactSales";
import { useSubscription } from "@/hooks/use-subscription";
import { subscriptionPlans } from "@/data/subscription-plans";
import { useToast } from "@/hooks/use-toast";

export default function Subscription() {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { 
    subscription, 
    isLoading, 
    handleUpgrade, 
    handleManageSubscription 
  } = useSubscription();
  
  // Check for success or canceled payments
  useEffect(() => {
    if (searchParams.get("success")) {
      toast({
        title: "Success!",
        description: "Your subscription has been updated. Welcome to Pro!",
      });
    } else if (searchParams.get("canceled")) {
      toast({
        title: "Canceled",
        description: "Your payment was canceled. Feel free to try again when you're ready.",
      });
    }
  }, [searchParams, toast]);

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
            {subscriptionPlans.map((plan) => (
              <PlanCard
                key={plan.type}
                plan={plan}
                isCurrentPlan={subscription?.plan_type === plan.type}
                isLoading={isLoading}
                onUpgrade={handleUpgrade}
              />
            ))}
          </div>

          <ContactSales />
          
          {subscription && subscription.plan_type === 'pro' && (
            <SubscriptionDetails
              subscription={subscription}
              isLoading={isLoading}
              onManageSubscription={handleManageSubscription}
            />
          )}
        </div>
      </main>
    </div>
  );
}
