
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PlanType } from "@/components/subscription/PlanCard";

export function useSubscription() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  const { data: subscription, isLoading: isSubscriptionLoading } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const handleUpgrade = async (planType: PlanType, priceId: string | null) => {
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
        setIsLoading(null);
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      setIsLoading(null);
      toast({
        title: "Error",
        description: error.message || "Failed to process upgrade. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleManageSubscription = async () => {
    try {
      setIsLoading('manage');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsLoading(null);
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-manage-portal', {
        body: {},
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      setIsLoading(null);
      toast({
        title: "Error",
        description: error.message || "Failed to open subscription portal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    subscription,
    isSubscriptionLoading,
    isLoading,
    handleUpgrade,
    handleManageSubscription
  };
}
