
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface SubscriptionDetailsProps {
  subscription: {
    status: string;
    plan_type: string;
    current_period_end?: string;
    price: number;
    cancel_at_period_end: boolean;
  };
}

export function SubscriptionDetails({ subscription }: SubscriptionDetailsProps) {
  const statusColorMap: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    trialing: "bg-blue-100 text-blue-800",
    canceled: "bg-red-100 text-red-800",
    incomplete: "bg-yellow-100 text-yellow-800",
    incomplete_expired: "bg-gray-100 text-gray-800",
    past_due: "bg-orange-100 text-orange-800",
    unpaid: "bg-red-100 text-red-800",
    paused: "bg-gray-100 text-gray-800"
  };

  const planNameMap: Record<string, string> = {
    free: "Starter Plan",
    pro: "Pro Writer Plan",
    enterprise: "Enterprise Plan"
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-xl">Current Subscription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Plan</span>
          <span className="font-medium">{planNameMap[subscription.plan_type]}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status</span>
          <Badge variant="outline" className={statusColorMap[subscription.status]}>
            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
          </Badge>
        </div>

        {subscription.price > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Price</span>
            <span className="font-medium">${subscription.price}/month</span>
          </div>
        )}

        {subscription.current_period_end && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              {subscription.cancel_at_period_end ? "Cancels On" : "Renews On"}
            </span>
            <span className="font-medium">
              {format(new Date(subscription.current_period_end), "MMM d, yyyy")}
            </span>
          </div>
        )}

        {subscription.cancel_at_period_end && (
          <p className="text-sm text-orange-600 mt-4">
            Your subscription will be canceled at the end of the current billing period.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
