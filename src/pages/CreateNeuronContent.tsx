
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
import { ManualTopicForm } from "@/components/create-content/ManualTopicForm";
import { useToast } from "@/components/ui/use-toast";

const steps = [
  { number: 1, title: "Select Project", current: true },
  { number: 2, title: "Add terms", current: false },
  { number: 3, title: "Review", current: false },
  { number: 4, title: "Done", current: false },
];

export default function CreateNeuronContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [topic, setTopic] = useState("");
  const [h2Headings, setH2Headings] = useState("");
  const [options, setOptions] = useState({
    addH2: false,
    faq: false,
    tableOfContents: false,
    generateImage: false,
  });

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
    if (!selectedProject && currentStep === 1) {
      toast({
        title: "Error",
        description: "Please select a project first",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleAddTopic = async () => {
    if (!topic.trim()) return;

    try {
      const { error } = await supabase
        .from("neuron_contents")
        .insert({
          project_id: selectedProject,
          content_type: "topic",
          content: JSON.stringify({
            topic,
            h2Headings: h2Headings.split("\n").filter(h => h.trim()),
            options,
          }),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Topic added successfully",
      });

      setTopic("");
      setH2Headings("");
      setOptions({
        addH2: false,
        faq: false,
        tableOfContents: false,
        generateImage: false,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add topic",
        variant: "destructive",
      });
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
            <Card className="p-6">
              {currentStep === 1 && (
                <>
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
                </>
              )}

              {currentStep === 2 && (
                <ManualTopicForm
                  topic={topic}
                  setTopic={setTopic}
                  options={options}
                  setOptions={setOptions}
                  h2Headings={h2Headings}
                  setH2Headings={setH2Headings}
                  onAddTopic={handleAddTopic}
                />
              )}
            </Card>
          </div>

          <div className="col-span-1">
            <Summary 
              categories={0}
              selectedLanguage="auto"
              onBack={handleBack}
              onNext={handleNext}
              disableNext={!selectedProject && currentStep === 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
