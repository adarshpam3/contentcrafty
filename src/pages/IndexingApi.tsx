
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";

export default function IndexingApi() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-[#06962c] hover:underline cursor-pointer"
                  onClick={() => navigate('/')}>
              Home
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-500">Indexing API</span>
          </div>

          {/* Title Section */}
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold">Indexing API</h1>
            <p className="text-gray-600">
              The Indexing API allows speeding up the indexing of pages in the Google search engine. More informations{" "}
              <a href="#" className="text-[#06962c] hover:underline">here</a>.
            </p>
          </div>

          {/* Action Card */}
          <Card className="p-6 bg-[#e6f4ea] border-[#b8e6c4]">
            <div className="flex justify-between items-center">
              <p className="text-[#06962c]">
                Setup your first Indexing API project to start using the tool.
              </p>
              <Button 
                onClick={() => navigate('/create-indexing-api-project')}
                className="bg-[#06962c] hover:bg-[#057a24] text-white"
              >
                Create project
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
