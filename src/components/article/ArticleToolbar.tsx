
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface ArticleToolbarProps {
  isHtmlContent?: boolean;
  previewMode: 'html' | 'original';
  setPreviewMode: (mode: 'html' | 'original') => void;
  onSave: () => void;
}

export function ArticleToolbar({ 
  isHtmlContent, 
  previewMode, 
  setPreviewMode, 
  onSave 
}: ArticleToolbarProps) {
  const { toast } = useToast();

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-4">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        {isHtmlContent && (
          <div className="flex items-center gap-2 ml-4 border rounded-md p-1 bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewMode('html')}
              className={`${
                previewMode === 'html' 
                  ? 'bg-white shadow-sm text-[#06962c]' 
                  : 'hover:bg-white/50'
              }`}
            >
              HTML
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewMode('original')}
              className={`${
                previewMode === 'original' 
                  ? 'bg-white shadow-sm text-[#06962c]' 
                  : 'hover:bg-white/50'
              }`}
            >
              Original
            </Button>
          </div>
        )}
      </div>
      <div className="space-x-2">
        <Button 
          variant="outline" 
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast({
              title: "Link copied",
              description: "Share link has been copied to clipboard",
            });
          }}
          className="text-gray-600"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button 
          onClick={onSave}
          className="bg-[#06962c] hover:bg-[#057a24]"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
