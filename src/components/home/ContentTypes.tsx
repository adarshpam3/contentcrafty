
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentCard } from "@/components/ContentCard";

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
  }
];

export function ContentTypes() {
  const [activeTab, setActiveTab] = useState("blog");

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
              />
            ))
          : ecommerceContentTypes.map((content, index) => (
              <ContentCard
                key={index}
                {...content}
              />
            ))
        }
      </div>
    </Tabs>
  );
}
