
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const steps = [
  { number: 1, title: "Select Project", current: true },
  { number: 2, title: "Select language", current: false },
  { number: 3, title: "Add Categories", current: false },
  { number: 4, title: "Review", current: false },
  { number: 5, title: "Done", current: false },
];

export default function CreateEcommerceContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

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
                <h2 className="text-2xl font-semibold mb-4">Select project</h2>
                <p className="text-gray-500 mb-6">
                  Select project where you want to write content.
                </p>
                
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project1">Project 1</SelectItem>
                    <SelectItem value="project2">Project 2</SelectItem>
                  </SelectContent>
                </Select>
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
              onClick={() => navigate(-1)}
              className="px-6"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(prev => Math.min(prev + 1, 5))}
              className="px-6 bg-purple-600 hover:bg-purple-700"
            >
              Next
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
