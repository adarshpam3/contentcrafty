
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Download, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function CategoryView() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: category, isLoading } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", categoryId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "The category link has been copied to your clipboard.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse h-8 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
        <Button onClick={() => navigate("/projects")} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            onClick={() => navigate("/projects")} 
            variant="ghost" 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Header Section */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">{category.topic}</h1>
            <p className="text-gray-600 mt-2">{category.description || category.category_description}</p>
          </div>

          {/* Keywords Section */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Keywords</h2>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                Edit Keywords
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(category.keywords || []).map((keyword: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <div className="text-sm text-gray-600">
                  Words: <span className="font-medium">{category.word_count || 0}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Characters: <span className="font-medium">{category.character_count || 0}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleCopyLink}
                >
                  <Copy className="w-4 h-4" />
                  Copy share link
                </Button>
              </div>
            </div>
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: category.content || '' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
