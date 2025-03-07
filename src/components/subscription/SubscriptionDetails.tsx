
import { Button } from "@/components/ui/button";

interface SubscriptionDetailsProps {
  subscription: {
    status?: string;
    current_period_end?: string;
    articles_remaining?: number;
    stripe_subscription_id?: string;
  };
  isLoading: string | null;
  onManageSubscription: () => void;
}

export function SubscriptionDetails({ 
  subscription, 
  isLoading, 
  onManageSubscription 
}: SubscriptionDetailsProps) {
  return (
    <div className="mt-8 p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4">Pro Subscription Details</h2>
      <div className="space-y-2">
        <p><span className="font-medium">Status:</span> {subscription.status || 'Active'}</p>
        {subscription.current_period_end && (
          <p>
            <span className="font-medium">Next billing date:</span> {new Date(subscription.current_period_end).toLocaleDateString()}
          </p>
        )}
        <p><span className="font-medium">Articles remaining:</span> {subscription.articles_remaining}/50</p>
      </div>
      
      {subscription.stripe_subscription_id && (
        <div className="mt-4">
          <Button 
            variant="outline" 
            className="text-[#06962c] border-[#06962c] hover:bg-[#e6f4ea]"
            onClick={onManageSubscription}
            disabled={isLoading === 'manage'}
          >
            {isLoading === 'manage' ? "Loading..." : "Manage Subscription"}
          </Button>
        </div>
      )}
    </div>
  );
}
