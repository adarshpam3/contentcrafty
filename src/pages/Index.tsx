import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ContentCard } from "@/components/ContentCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenLine, Ban, Clock, Globe } from "lucide-react";
import { Link } from "react-router-dom";

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

const statsCards = [
  {
    title: "Total",
    value: "0",
    icon: <PenLine className="h-5 w-5" />,
    link: "/articles",
    buttonText: "Go to articles",
  },
  {
    title: "Unpublished",
    value: "0",
    icon: <Ban className="h-5 w-5" />,
    link: "/articles?status=unpublished",
    buttonText: "Publish articles",
  },
  {
    title: "In progress",
    value: "0",
    icon: <Clock className="h-5 w-5" />,
    link: "/articles?status=in-progress",
    buttonText: "View status",
  },
  {
    title: "Projects",
    value: "2",
    icon: <Globe className="h-5 w-5" />,
    link: "/projects",
    buttonText: "Go to projects",
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

          {/* AI Internal Linking Banner */}
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-6 flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-purple-900">
                🎯🔥 Boost Your SEO with AI Internal Linking 🔥🎯
              </h2>
              <p className="text-purple-700">
                An AI-powered tool designed to automatically plan and insert internal links on your website.
              </p>
            </div>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link to="/internal-linking">Go to Linkrobot 🤖</Link>
            </Button>
          </div>

          {/* Articles Statistics */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your articles</h2>
            <p className="text-gray-600">You haven't written any articles this month yet.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsCards.map((stat, index) => (
                <Card key={index} className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">{stat.title}</span>
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        {stat.icon}
                      </div>
                    </div>
                    <p className="text-3xl font-semibold">{stat.value}</p>
                  </div>
                  <Button
                    asChild
                    variant="secondary"
                    className="w-full"
                  >
                    <Link to={stat.link}>{stat.buttonText}</Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Content Creation Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Let's write some content</h2>
            <p className="text-gray-600">
              Choose one of our models and create outstanding content.
            </p>

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
        </div>
      </main>
    </div>
  );
}