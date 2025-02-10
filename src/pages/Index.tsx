
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { ContentCard } from "@/components/ContentCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, Pencil, Eye, FileEdit } from "lucide-react";
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

export default function Index() {
  const [activeTab, setActiveTab] = useState("blog");
  const navigate = useNavigate();

  // Query for total articles
  const { data: totalArticles = 0 } = useQuery({
    queryKey: ["totalArticles"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq('is_category', false);
      
      if (error) throw error;
      return count || 0;
    },
  });

  // Query for unpublished articles
  const { data: unpublishedArticles = 0 } = useQuery({
    queryKey: ["unpublishedArticles"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq('status', 'pending')
        .eq('is_category', false);
      
      if (error) throw error;
      return count || 0;
    },
  });

  // Query for in-progress articles
  const { data: inProgressArticles = 0 } = useQuery({
    queryKey: ["inProgressArticles"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq('status', 'draft')
        .eq('is_category', false);
      
      if (error) throw error;
      return count || 0;
    },
  });

  // Query for total projects
  const { data: totalProjects = 0 } = useQuery({
    queryKey: ["totalProjects"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Home</h1>
            <p className="text-gray-600">Hello Mate! What will we write today?</p>
          </div>

          {/* SEO Boost Card */}
          <Card className="p-6 bg-purple-50 border-purple-100">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-purple-700">
                  🤖🔥 Boost Your SEO with AI Internal Linking 🔥🤖
                </h2>
                <p className="text-purple-600">
                  An AI-powered tool designed to automatically plan and insert internal links on your website.
                </p>
              </div>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => console.log("Go to Linkrobot")}
              >
                Go to Linkrobot 🤖
              </Button>
            </div>
          </Card>

          {/* Articles Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your articles</h2>
            <p className="text-gray-600">
              {totalArticles === 0 
                ? "You haven't written any articles this month yet."
                : `You have written ${totalArticles} articles this month.`
              }
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Articles Card */}
              <Card className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Total</p>
                    <p className="text-3xl font-semibold">{totalArticles}</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Pencil className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 bg-purple-50 text-purple-600 hover:bg-purple-100"
                  onClick={() => navigate('/articles')}
                >
                  Go to articles
                </Button>
              </Card>

              {/* Unpublished Articles Card */}
              <Card className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Unpublished</p>
                    <p className="text-3xl font-semibold">{unpublishedArticles}</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 bg-purple-50 text-purple-600 hover:bg-purple-100"
                  onClick={() => navigate('/projects')}
                >
                  Publish articles
                </Button>
              </Card>

              {/* In Progress Card */}
              <Card className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">In progress</p>
                    <p className="text-3xl font-semibold">{inProgressArticles}</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-full">
                    <FileEdit className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 bg-purple-50 text-purple-600 hover:bg-purple-100"
                  onClick={() => navigate('/articles')}
                >
                  View status
                </Button>
              </Card>

              {/* Projects Card */}
              <Card className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Projects</p>
                    <p className="text-3xl font-semibold">{totalProjects}</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Globe className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 bg-purple-50 text-purple-600 hover:bg-purple-100"
                  onClick={() => navigate('/projects')}
                >
                  Go to projects
                </Button>
              </Card>
            </div>
          </div>

          {/* Content Types Section */}
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
        </div>
      </main>
    </div>
  );
}
