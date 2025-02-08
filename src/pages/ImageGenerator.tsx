
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
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

      if (!data?.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format from image generation');
      }

      setGeneratedImages(data.data.map((img: { url: string }) => img.url));
      toast({
        title: "Success",
        description: "Images generated successfully!",
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-semibold">Image Generator</h1>
            <p className="text-gray-600 mt-2">
              Transform ideas into images effortlessly with our Image Generator, powered by DALL-E 3.
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="rounded-lg bg-purple-50 p-4 mb-6">
              <p className="text-purple-700">
                Submit your idea below and watch as DALL-E 3 produces three images based on your prompt.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label htmlFor="prompt" className="text-gray-700">
                    Prompt:
                  </label>
                  <span className="text-gray-500">Cost: 2 tokens</span>
                </div>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A photograph of a white Siamese cat."
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={generateImages}
                disabled={isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Images"
                )}
              </Button>
            </div>
          </div>

          {/* Generated Images */}
          {generatedImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white"
                >
                  <img
                    src={imageUrl}
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
