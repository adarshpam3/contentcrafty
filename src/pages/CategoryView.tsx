
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CategoryView() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-6">
        <Button 
          onClick={() => navigate("/projects")} 
          variant="outline" 
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">{category.topic}</h1>
        <p className="text-gray-600 mt-2">{category.category_description}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: category.content || '' }} />
      </div>

      <div className="mt-6 flex gap-4">
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">Word Count</p>
          <p className="text-2xl font-bold text-purple-900">{category.word_count || 0}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">Character Count</p>
          <p className="text-2xl font-bold text-purple-900">{category.character_count || 0}</p>
        </div>
      </div>
    </div>
  );
}
