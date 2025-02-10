
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/components/create-content/Breadcrumb";
import { CreateContentSteps } from "@/components/create-content/CreateContentSteps";
import { Summary } from "@/components/create-content/Summary";
import { ContentCreationProvider, useContentCreation } from "@/components/create-content/ContentCreationProvider";

function CreateNeuronContentInner() {
  const navigate = useNavigate();
  const [jsonScript, setJsonScript] = useState("");
  const { currentStep, selectedProject, selectedLanguage, handleNext, handleBack } = useContentCreation();

  const handleParseScript = () => {
    // TODO: Implement script parsing
    console.log("Parsing script:", jsonScript);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        <CreateContentSteps currentStep={currentStep} />

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-2">NeuronWriter terms</h2>
              <p className="text-gray-600 mb-6">
                Provide the JSON script copied from the NeuronWriter tool. You can find more information in{" "}
                <a href="#" className="text-purple-600 hover:underline">our guide</a>.
              </p>

              {/* Neuron Account Notice */}
              <div className="bg-purple-50 p-4 rounded-lg mb-6 flex justify-between items-center">
                <p className="text-purple-900">
                  To use this model, you need to have an active account in the{" "}
                  <a href="#" className="text-purple-600 hover:underline">NeuronWriter</a> application.
                </p>
                <Button
                  onClick={() => window.open('https://neuronwriter.com', '_blank')}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Go to Neuron
                </Button>
              </div>

              {/* JSON Input Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">JSON with terms:</label>
                  <Button variant="link" className="text-purple-600 hover:text-purple-700">
                    How to get JSON?
                  </Button>
                </div>
                <Textarea
                  value={jsonScript}
                  onChange={(e) => setJsonScript(e.target.value)}
                  className="min-h-[200px]"
                  placeholder="Paste your JSON script here..."
                />
                <Button
                  onClick={handleParseScript}
                  className="w-full bg-purple-50 text-purple-600 hover:bg-purple-100"
                >
                  Parse Script
                </Button>
              </div>
            </Card>
          </div>

          <div className="col-span-1">
            <Summary
              categories={0}
              selectedLanguage={selectedLanguage}
            >
              <div className="flex justify-between mt-6 space-x-4">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={!selectedProject}
                >
                  Next
                </Button>
              </div>
            </Summary>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateNeuronContent() {
  return (
    <ContentCreationProvider>
      <CreateNeuronContentInner />
    </ContentCreationProvider>
  );
}
