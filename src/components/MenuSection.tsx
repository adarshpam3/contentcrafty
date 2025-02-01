import { ContentCard } from "@/components/ContentCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MenuSectionProps {
  title: string;
  subtitle: string;
  contentTypes: Array<{
    title: string;
    description: string;
    badge: string;
    features: Array<{ label: string; value: string }>;
    buttonText: string;
    recommended?: boolean;
  }>;
}

export function MenuSection({ title, subtitle, contentTypes }: MenuSectionProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-2">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <a href="/" className="hover:text-gray-900">
            Home
          </a>
          <span>/</span>
          <span className="text-gray-900">Models</span>
        </nav>

        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-gray-500">{subtitle}</p>
      </div>

      <Tabs defaultValue="blog" className="space-y-8">
        <TabsList>
          <TabsTrigger value="blog">Blog Articles</TabsTrigger>
          <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentTypes.map((content, index) => (
            <ContentCard key={index} {...content} />
          ))}
        </div>
      </Tabs>
    </div>
  );
}