
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface PlanProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  buttonText: string;
  type: string;
  recommended?: boolean;
  priceId: string | null;
  isCurrentPlan: boolean;
  isCancelled: boolean;
  isLoading: boolean;
  subscriptionStatus?: string;
  onUpgrade: (type: string, priceId: string | null) => Promise<void>;
  onManageSubscription: (action: 'cancel' | 'resume') => Promise<void>;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  icon: Icon,
  features,
  buttonText,
  type,
  recommended,
  priceId,
  isCurrentPlan,
  isCancelled,
  isLoading,
  subscriptionStatus,
  onUpgrade,
  onManageSubscription,
}: PlanProps) {
  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
        recommended 
          ? 'border-2 border-[#06962c] shadow-md' 
          : 'border border-gray-200'
      }`}
    >
      {recommended && (
        <div className="absolute top-5 right-5">
          <span className="bg-[#06962c] text-white px-3 py-1 rounded-full text-sm font-medium">
            Recommended
          </span>
        </div>
      )}
      
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${
            recommended 
              ? 'bg-[#e6f4ea] text-[#06962c]' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            <Icon className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gray-900">{price}</span>
            {period && (
              <span className="text-gray-500">/{period}</span>
            )}
          </div>
          <p className="mt-2 text-gray-600">{description}</p>
        </div>

        <div className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-1">
                <Check className={`h-4 w-4 ${
                  recommended 
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
            {subscriptionStatus === 'active' && (
              <Button
                className="w-full h-12 text-base font-medium"
                variant="outline"
                onClick={() => onManageSubscription(isCancelled ? 'resume' : 'cancel')}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : isCancelled ? "Resume Subscription" : "Cancel Subscription"}
              </Button>
            )}
          </div>
        ) : (
          <Button
            className={`w-full h-12 text-base font-medium ${
              recommended
                ? 'bg-[#06962c] hover:bg-[#057a24] text-white'
                : 'bg-gray-900 hover:bg-gray-800 text-white'
            }`}
            onClick={() => onUpgrade(type, priceId)}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : buttonText}
          </Button>
        )}
      </div>
    </Card>
  );
}
