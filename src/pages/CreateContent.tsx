
import { Breadcrumb } from "@/components/create-content/Breadcrumb";
import { CreateContentSteps } from "@/components/create-content/CreateContentSteps";
import { MainContent } from "@/components/create-content/MainContent";
import { Summary } from "@/components/create-content/Summary";
import { NavigationButtons } from "@/components/create-content/NavigationButtons";
import { ContentCreationProvider, useContentCreation } from "@/components/create-content/ContentCreationProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

function CreateContentInner() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    currentStep,
    selectedProject,
    selectedLanguage,
    topics,
    handleNext,
    handleBack
  } = useContentCreation();

  const { data: subscription } = useQuery({
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

  // Check subscription status when trying to use Advanced Writer
  const checkSubscriptionAccess = () => {
    if (!subscription || (subscription.plan_type !== 'pro' && subscription.plan_type !== 'enterprise')) {
      toast({
        title: "Subscription Required",
        description: "Please upgrade to Pro or Enterprise plan to use Advanced Writer",
      });
      navigate('/subscription');
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        <CreateContentSteps currentStep={currentStep} />

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <MainContent checkSubscriptionAccess={checkSubscriptionAccess} />
          </div>

          <div className="col-span-1">
            <Summary
              categories={topics.length}
              selectedLanguage={selectedLanguage}
            />
          </div>
        </div>

        {currentStep < 5 && (
          <NavigationButtons
            onBack={handleBack}
            onNext={handleNext}
            disableNext={
              (currentStep === 1 && !selectedProject) ||
              (currentStep === 2 && !selectedLanguage)
            }
          />
        )}
      </div>
    </div>
  );
}

export default function CreateContent() {
  return (
    <ContentCreationProvider>
      <CreateContentInner />
    </ContentCreationProvider>
  );
}
