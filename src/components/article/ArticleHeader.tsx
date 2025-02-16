
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ArticleHeaderProps {
  projectName?: string;
}

export function ArticleHeader({ projectName }: ArticleHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold mb-2 text-gray-800">Edit article</h1>
        <p className="text-gray-500">Project: {projectName}</p>
      </div>
      <Button 
        variant="outline" 
        onClick={() => navigate("/articles")}
        className="text-gray-600"
      >
        Back to Articles
      </Button>
    </div>
  );
}
