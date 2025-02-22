
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useSubscription() {
  const { toast } = useToast();

  const { data: subscription, refetch: refetchSubscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*, profiles(stripe_customer_id)")
        .eq("user_id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const manageSubscriptionMutation = useMutation({
    mutationFn: async (action: 'cancel' | 'resume') => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch('/functions/v1/manage-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
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

  const createCheckoutSession = async (priceId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    try {
      const response = await fetch('/functions/v1/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
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
      throw error;
    }
  };

  return {
    subscription,
    isLoading: !subscription,
    createCheckoutSession,
    manageSubscription: manageSubscriptionMutation.mutate,
    refetchSubscription,
  };
}
