
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download } from "lucide-react";
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
                Submit your idea below and watch as DALL-E 3 brings it to life.
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
                  "Generate Image"
                )}
              </Button>
            </div>
          </div>

          {/* Generated Image */}
          {generatedImage && (
            <div className="max-w-2xl mx-auto">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white">
                <img
                  src={generatedImage.url}
                  alt="Generated image"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="mr-2" />
                  Download Image
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
