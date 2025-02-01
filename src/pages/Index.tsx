import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ContentCard } from "@/components/ContentCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe, Pencil, Eye, FileEdit } from "lucide-react";
import { cn } from "@/lib/utils";

const contentTypes = [
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

export default function Index() {
  const [activeTab, setActiveTab] = useState("blog");

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
            <p className="text-gray-600">You haven't written any articles this month yet.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Articles Card */}
              <Card className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Total</p>
                    <p className="text-3xl font-semibold">0</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Pencil className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 bg-purple-50 text-purple-600 hover:bg-purple-100"
                >
                  Go to articles
                </Button>
              </Card>

              {/* Unpublished Articles Card */}
              <Card className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Unpublished</p>
                    <p className="text-3xl font-semibold">0</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 bg-purple-50 text-purple-600 hover:bg-purple-100"
                >
                  Publish articles
                </Button>
              </Card>

              {/* In Progress Card */}
              <Card className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">In progress</p>
                    <p className="text-3xl font-semibold">0</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-full">
                    <FileEdit className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 bg-purple-50 text-purple-600 hover:bg-purple-100"
                >
                  View status
                </Button>
              </Card>

              {/* Projects Card */}
              <Card className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Projects</p>
                    <p className="text-3xl font-semibold">2</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Globe className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 bg-purple-50 text-purple-600 hover:bg-purple-100"
                >
                  Go to projects
                </Button>
              </Card>
            </div>
          </div>

          {/* Content Types Section */}
          <Tabs defaultValue="blog" className="space-y-8">
            <TabsList>
              <TabsTrigger value="blog">Blog Articles</TabsTrigger>
              <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentTypes.map((content, index) => (
                <ContentCard
                  key={index}
                  {...content}
                />
              ))}
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}