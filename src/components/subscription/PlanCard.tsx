
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export type PlanType = "free" | "pro" | "enterprise";

export interface SubscriptionPlan {
  name: string;
  price: string;
  period?: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  buttonText: string;
  type: PlanType;
  recommended?: boolean;
  priceId: string | null;
}

interface PlanCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan: boolean;
  isLoading: boolean;
  onUpgrade: (planType: PlanType, priceId: string | null) => void;
}

export function PlanCard({ plan, isCurrentPlan, isLoading, onUpgrade }: PlanCardProps) {
  const Icon = plan.icon;
  
  return (
    <Card 
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
          onClick={() => onUpgrade(plan.type, plan.priceId)}
          disabled={isCurrentPlan || isLoading === plan.type}
        >
          {isLoading === plan.type ? "Processing..." : isCurrentPlan ? "Current Plan" : plan.buttonText}
        </Button>
      </div>
    </Card>
  );
}
