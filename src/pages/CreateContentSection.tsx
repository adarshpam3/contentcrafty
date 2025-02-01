import { Sidebar } from "@/components/Sidebar";
import { MenuSection } from "@/components/MenuSection";

const createContentTypes = [
  {
    title: "Article Generator",
    description: "Generate high-quality articles with AI assistance.",
    badge: "AI Powered",
    features: [
      { label: "Type", value: "Long-form content" },
      { label: "Style", value: "Customizable" },
      { label: "SEO", value: "Optimized" },
      { label: "Language", value: "Multiple options" },
    ],
    buttonText: "Start Writing",
  },
  {
    title: "Blog Post Creator",
    description: "Create engaging blog posts with structured templates.",
    badge: "Templates",
    features: [
      { label: "Format", value: "Blog post" },
      { label: "Templates", value: "Multiple options" },
      { label: "Images", value: "AI generated" },
      { label: "Analytics", value: "Included" },
    ],
    buttonText: "Create Blog Post",
    recommended: true,
  },
  {
    title: "Content Optimizer",
    description: "Optimize your existing content for better performance.",
    badge: "SEO Tools",
    features: [
      { label: "Analysis", value: "Deep scan" },
      { label: "Suggestions", value: "AI powered" },
      { label: "Keywords", value: "Research included" },
      { label: "Reports", value: "Detailed" },
    ],
    buttonText: "Optimize Content",
  },
];

export default function CreateContentSection() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <MenuSection
          title="Create Amazing Content"
          subtitle="Select a content creation tool to get started"
          contentTypes={createContentTypes}
        />
      </main>
    </div>
  );
}