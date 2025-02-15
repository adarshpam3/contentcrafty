
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download, ImageIcon, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<{ url: string; fileName: string } | null>(null);
  const { toast } = useToast();

  const generateImages = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-images', {
        body: { prompt }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.data || !Array.isArray(data.data) || data.data.length === 0) {
        throw new Error('Invalid response format from image generation');
      }

      setGeneratedImage({
        url: data.data[0].url,
        fileName: data.data[0].fileName
      });
      
      toast({
        title: "Success",
        description: "Image generated successfully!",
      });
    } catch (error) {
      console.error('Error generating images:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate images",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage?.url) return;

    try {
      const response = await fetch(generatedImage.url);
      if (!response.ok) throw new Error('Failed to fetch image');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = generatedImage.fileName || 'generated-image.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Image downloaded successfully!",
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Error",
        description: "Failed to download image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-[#e6f4ea] p-3 rounded-lg">
                <Wand2 className="h-6 w-6 text-[#06962c]" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">AI Image Generator</h1>
                <p className="text-gray-600 mt-1">
                  Transform your ideas into stunning visuals with DALL-E 3
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="space-y-6">
                <div className="bg-[#e6f4ea] rounded-lg p-4">
                  <p className="text-[#06962c] flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Describe the image you want to create
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label htmlFor="prompt" className="text-gray-700 font-medium">
                        Your Prompt
                      </label>
                      <span className="text-sm text-[#06962c] bg-[#e6f4ea] px-2 py-1 rounded-full">
                        2 tokens
                      </span>
                    </div>
                    <Textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="A serene landscape with mountains reflected in a crystal-clear lake at sunset..."
                      className="min-h-[120px] resize-none border-gray-200 focus:border-[#06962c] focus:ring-[#06962c]"
                    />
                  </div>

                  <Button
                    onClick={generateImages}
                    disabled={isGenerating}
                    className="w-full bg-[#06962c] hover:bg-[#057a24] text-white shadow-sm transition-all duration-200"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating your masterpiece...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-5 w-5" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Generated Image</h3>
              {generatedImage ? (
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={generatedImage.url}
                      alt="Generated image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-[#06962c] hover:bg-[#057a24] text-white flex items-center justify-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download Image
                  </Button>
                </div>
              ) : (
                <div className="aspect-square rounded-lg border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Your generated image will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
