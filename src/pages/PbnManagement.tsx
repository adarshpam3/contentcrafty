
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";

export default function PbnManagement() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-purple-600 hover:underline cursor-pointer"
                  onClick={() => navigate('/')}>
              Home
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-500">PBN Management</span>
          </div>

          {/* Title Section */}
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold">PBN Management</h1>
            <p className="text-gray-600">
              Easily manage your private blog network.
            </p>
          </div>

          {/* Action Card */}
          <Card className="p-6 bg-purple-50 border-purple-100">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-purple-900">
                  You have no project with the <span className="font-medium">PBN Management</span> plugin enabled. To do this, go to the <span className="text-purple-600">Projects</span> tab, then go to{" "}
                  <span className="text-purple-600">Integrations</span> for the project you want to manage, and enable the plugin. Remember that the PBN Management tool only works for websites based on WordPress.
                </p>
              </div>
              <Button 
                onClick={() => navigate('/projects')}
                className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap ml-4"
              >
                Go to projects
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
