
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentCard } from "@/components/ContentCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const blogContentTypes = [
  {
    title: "Fast Writer",
    description: "Advanced model with user-friendly text formatting.",
    badge: "Smart text formatting",
    features: [
      { label: "Headings", value: "AI generated / manually" },
      { label: "Type", value: "Blog article" },
      { label: "Cost", value: "1 Article (5 tokens)" },
      { label: "Feature", value: "Bulk generator" },
    ],
    buttonText: "Create Content",
    action: "/create-content"
  },
  {
    title: "Advanced Writer",
    description: "The most advanced model using competitor analysis from SERP.",
    badge: "SERP Analysis",
    features: [
      { label: "Headings", value: "AI generated" },
      { label: "Type", value: "Based on source" },
      { label: "Cost", value: "1 Article (5 tokens)" },
      { label: "Feature", value: "SERP Analysis" },
    ],
    buttonText: "Subscribe to use Advanced Writer",
    recommended: true,
    action: "/subscription"
  },
  {
    title: "Neuron & Contadu Writer",
    description: "Advanced SEO optimization through integration with Neuron Writer.",
    badge: "Advanced SEO optimization",
    features: [
      { label: "Headings", value: "AI generated" },
      { label: "Type", value: "Based on keywords" },
      { label: "Cost", value: "1 Article (5 tokens)" },
      { label: "Feature", value: "NeuronWriter Integration" },
    ],
    buttonText: "Create Content",
    action: "/create-content"
  },
];

const ecommerceContentTypes = [
  {
    title: "Copy-commerce-001",
    description: "Advanced model designed for online stores.",
    badge: "E-commerce",
    features: [
      { label: "Headings", value: "AI generated" },
      { label: "Type", value: "Category description" },
      { label: "Cost", value: "1 Article (5 tokens)" },
      { label: "Feature", value: "Personalization" },
    ],
    buttonText: "Create Content",
    action: "/create-content"
  }
];

export function ContentTypes() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("blog");

  const { data: subscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleCardAction = (action: string, requiresPro: boolean = false) => {
    if (requiresPro && subscription?.plan_type !== 'pro' && subscription?.plan_type !== 'enterprise') {
      navigate('/subscription');
    } else {
      navigate(action);
    }
  };

  return (
    <Tabs defaultValue="blog" className="space-y-8" value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="blog">Blog Articles</TabsTrigger>
        <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
      </TabsList>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === "blog" 
          ? blogContentTypes.map((content, index) => (
              <ContentCard
                key={index}
                {...content}
                onClick={() => handleCardAction(content.action, content.title === "Advanced Writer")}
              />
            ))
          : ecommerceContentTypes.map((content, index) => (
              <ContentCard
                key={index}
                {...content}
                onClick={() => handleCardAction(content.action)}
              />
            ))
        }
      </div>
    </Tabs>
  );
}
