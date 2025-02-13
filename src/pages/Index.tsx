
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Statistics } from "@/components/home/Statistics";
import { ContentTypes } from "@/components/home/ContentTypes";

export default function Index() {
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
          <Card className="p-6 bg-purple-50 border-purple-100">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-purple-700">
                  🤖🔥 Boost Your SEO with AI Internal Linking 🔥🤖
                </h2>
                <p className="text-purple-600">
                  An AI-powered tool designed to automatically plan and insert internal links on your website.
                </p>
              </div>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
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
