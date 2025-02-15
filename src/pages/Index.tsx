
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Statistics } from "@/components/home/Statistics";
import { ContentTypes } from "@/components/home/ContentTypes";
import { useCheckProject } from "@/hooks/use-check-project";

export default function Index() {
  const { isLoading } = useCheckProject();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Home</h1>
            <p className="text-gray-600">Hello Mate! What will we write today?</p>
          </div>

          {/* SEO Boost Card */}
          <Card className="p-6 bg-[#e6f4ea] border-[#b8e6c4]">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-[#06962c]">
                  🤖🔥 Boost Your SEO with AI Internal Linking 🔥🤖
                </h2>
                <p className="text-[#057a24]">
                  An AI-powered tool designed to automatically plan and insert internal links on your website.
                </p>
              </div>
              <Button 
                className="bg-[#06962c] hover:bg-[#057a24] text-white"
                onClick={() => console.log("Go to Linkrobot")}
              >
                Go to Linkrobot 🤖
              </Button>
            </div>
          </Card>

          {/* Statistics Section */}
          <Statistics />

          {/* Content Types Section */}
          <ContentTypes />
        </div>
      </main>
    </div>
  );
}
