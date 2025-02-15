
import { Button } from "@/components/ui/button";
import { ImageIcon, Download, ImagePlus, Sparkles, Loader2 } from "lucide-react";

interface FeaturedImageProps {
  imageUrl?: string;
  isGenerating: boolean;
  onGenerate: () => void;
  onSave?: () => void;
}

export function FeaturedImage({ imageUrl, isGenerating, onGenerate, onSave }: FeaturedImageProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-medium mb-4 text-gray-800 flex items-center gap-2">
        <ImageIcon className="w-4 h-4" />
        Featured Image
      </h3>
      
      {imageUrl ? (
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
            <img
              src={imageUrl}
              alt="Featured"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              className="w-full"
              variant="outline"
              onClick={onGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <ImagePlus className="w-4 h-4 mr-2" />
              )}
              New
            </Button>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={onSave}
            >
              <Download className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="aspect-square rounded-lg border border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-4">
            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 text-center">
              No featured image yet
            </p>
          </div>
          <Button 
            className="w-full bg-[#06962c] hover:bg-[#057a24]"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Generate with AI
          </Button>
        </div>
      )}
    </div>
  );
}
