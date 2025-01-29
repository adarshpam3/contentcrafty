import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const steps = [
  { number: 1, title: "Select Project", current: true },
  { number: 2, title: "Select language", current: false },
  { number: 3, title: "Add topics", current: false },
  { number: 4, title: "Review", current: false },
  { number: 5, title: "Done", current: false },
];

export default function CreateContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState<string>("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-gray-900">Home</a>
          <span>/</span>
          <a href="/models" className="hover:text-gray-900">Models</a>
          <span>/</span>
          <span className="text-gray-900">Copy-mate-003</span>
        </nav>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
                    currentStep === step.number
                      ? "bg-purple-600 text-white"
                      : currentStep > step.number
                      ? "bg-purple-200 text-purple-700"
                      : "bg-gray-200 text-gray-500"
                  )}
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

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-2">Select project</h2>
              <p className="text-gray-500 mb-6">
                Select project where you want to write content.
              </p>
              
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project1">Project 1</SelectItem>
                  <SelectItem value="project2">Project 2</SelectItem>
                  <SelectItem value="project3">Project 3</SelectItem>
                </SelectContent>
              </Select>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="col-span-1">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Project:</span>
                  <span className="text-gray-900">{selectedProject || "not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Articles to write:</span>
                  <span className="text-gray-900">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Image cost:</span>
                  <span className="text-gray-900">0 Tokens</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="text-gray-900">not selected</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="px-6"
          >
            Back
          </Button>
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="px-6 bg-purple-600 hover:bg-purple-700"
            disabled={!selectedProject}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}