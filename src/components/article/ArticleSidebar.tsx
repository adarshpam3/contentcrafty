
import { FeaturedImage } from "./FeaturedImage";

interface ArticleSidebarProps {
  imageUrl?: string;
  isGenerating: boolean;
  onGenerateImage: () => void;
}

export function ArticleSidebar({ imageUrl, isGenerating, onGenerateImage }: ArticleSidebarProps) {
  return (
    <div className="space-y-6">
      <FeaturedImage
        imageUrl={imageUrl}
        isGenerating={isGenerating}
        onGenerate={onGenerateImage}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-medium mb-4 text-gray-800">Article Status</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input 
              type="radio" 
              className="w-4 h-4 text-[#06962c] border-gray-300 focus:ring-[#06962c]" 
              name="status" 
              defaultChecked 
            />
            <span className="ml-2 text-sm text-gray-600">Used</span>
          </label>
          <label className="flex items-center">
            <input 
              type="radio" 
              className="w-4 h-4 text-[#06962c] border-gray-300 focus:ring-[#06962c]" 
              name="status" 
            />
            <span className="ml-2 text-sm text-gray-600">Unused</span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-medium mb-4 text-gray-800">Notes</h3>
        <textarea
          className="w-full h-32 p-3 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#06962c] placeholder-gray-400"
          placeholder="Add notes about this article..."
        />
      </div>
    </div>
  );
}
