
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Download } from "lucide-react";
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-purple-600">Home</span>
            <span>/</span>
            <span className="text-purple-600">Projects</span>
            <span>/</span>
            <span className="text-gray-600">{category.topic}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Edit category</h1>
          <p className="text-gray-600">You can preview and edit your category description here.</p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{category.topic}</h2>
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded">title</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100"
                onClick={handleCopyLink}
              >
                <Copy className="w-4 h-4" />
                Copy share link
              </Button>
              <Button variant="outline" size="sm">
                Save
              </Button>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="bg-purple-50 px-3 py-1 rounded-full text-sm text-purple-600">
              Words: {category.word_count || 0}
            </div>
            <div className="bg-purple-50 px-3 py-1 rounded-full text-sm text-purple-600">
              Characters: {category.character_count || 0}
            </div>
          </div>

          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: category.content || '' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
