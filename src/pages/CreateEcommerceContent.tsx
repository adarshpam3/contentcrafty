
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const steps = [
  { number: 1, title: "Select Project", current: true },
  { number: 2, title: "Select language", current: false },
  { number: 3, title: "Add Categories", current: false },
  { number: 4, title: "Review", current: false },
  { number: 5, title: "Done", current: false },
];

const languages = [
  "English UK", "English US", "Spanish", "French", "German", "Italian", 
  "Portuguese", "Dutch", "Polish", "Russian", "Japanese", "Korean", 
  "Chinese", "Arabic", "Hindi", "Turkish", "Vietnamese", "Thai"
];

export default function CreateEcommerceContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const navigate = useNavigate();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    },
  });

  const handleNext = () => {
    if (currentStep === 1 && !selectedProject) {
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate(-1);
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <a href="/" className="hover:text-gray-900">Home</a>
            <span>/</span>
            <a href="/create-page" className="hover:text-gray-900">Models</a>
            <span>/</span>
            <span className="text-gray-900">Category Description</span>
          </nav>

          {/* Step Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                      ${currentStep === step.number 
                        ? "bg-purple-600 text-white"
                        : currentStep > step.number
                        ? "bg-purple-200 text-purple-700"
                        : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {step.number}
                  </div>
                  <div className="mt-2 text-sm font-medium text-gray-900">
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content and Summary */}
          <div className="grid grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="col-span-2">
              <Card className="p-6">
                {currentStep === 1 ? (
                  <>
                    <h2 className="text-2xl font-semibold mb-4">Select project</h2>
                    <p className="text-gray-500 mb-6">
                      Select project where you want to write content.
                    </p>
                    
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoading ? (
                          <SelectItem value="loading" disabled>Loading projects...</SelectItem>
                        ) : projects && projects.length > 0 ? (
                          projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-projects" disabled>No projects found</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </>
                ) : currentStep === 2 ? (
                  <>
                    <h2 className="text-2xl font-semibold mb-4">Select language</h2>
                    <p className="text-gray-500 mb-6">
                      Choose the language in which you want to write your content.
                    </p>
                    
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select language..." />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language} value={language.toLowerCase()}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                ) : null}
              </Card>
            </div>

            {/* Summary Card */}
            <div className="col-span-1">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Articles:</span>
                    <span className="text-gray-900">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language:</span>
                    <span className="text-gray-900">
                      {selectedLanguage || "not selected"}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              className="px-6"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="px-6 bg-purple-600 hover:bg-purple-700"
              disabled={currentStep === 1 && !selectedProject}
            >
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
