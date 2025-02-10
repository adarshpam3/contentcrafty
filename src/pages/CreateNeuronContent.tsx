
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepIndicator } from "@/components/create-content/StepIndicator";
import { Summary } from "@/components/create-content/Summary";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NeuronTermsInput } from "@/components/create-content/NeuronTermsInput";

const steps = [
  { number: 1, title: "Select Project", current: true },
  { number: 2, title: "Add terms", current: false },
  { number: 3, title: "Review", current: false },
  { number: 4, title: "Done", current: false },
];

export default function CreateNeuronContent() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState("");
  const [jsonTerms, setJsonTerms] = useState("");

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedProject) return;
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleParseScript = () => {
    // This will be implemented in the next step
    console.log("Parsing script:", jsonTerms);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Select project</h2>
            <p className="text-gray-600 mb-8">
              Select project where you want to write content.
            </p>

            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects?.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>
        );
      case 2:
        return (
          <NeuronTermsInput
            jsonTerms={jsonTerms}
            onJsonTermsChange={setJsonTerms}
            onParseScript={handleParseScript}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-gray-900">
            Home
          </a>
          <span>/</span>
          <span className="text-gray-900">Create Neuron Content</span>
        </nav>

        <StepIndicator steps={steps} currentStep={currentStep} />

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            {renderCurrentStep()}
          </div>

          <div className="col-span-1">
            <Summary 
              categories={0}
              selectedLanguage="auto"
              onBack={handleBack}
              onNext={handleNext}
              disableNext={currentStep === 1 && !selectedProject}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
