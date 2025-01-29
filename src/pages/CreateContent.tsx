import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Pencil, Upload } from "lucide-react";

const steps = [
  { number: 1, title: "Select Project", current: true },
  { number: 2, title: "Select language", current: false },
  { number: 3, title: "Add topics", current: false },
  { number: 4, title: "Review", current: false },
  { number: 5, title: "Done", current: false },
];

// List of languages
const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Russian",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Bengali",
  "Dutch",
  "Greek",
  "Polish",
  "Turkish",
  "Vietnamese",
  "Thai",
  "Indonesian"
];

export default function CreateContent() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [topic, setTopic] = useState("");
  const [currentTab, setCurrentTab] = useState("manual");
  const [options, setOptions] = useState({
    addH2: false,
    faq: false,
    tableOfContents: false,
    generateImage: false,
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
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
        );
      case 2:
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Select language</h2>
            <p className="text-gray-500 mb-6">
              Choose the language in which you want to write your content.
            </p>
            
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a language..." />
              </SelectTrigger>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language} value={language.toLowerCase()}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>
        );
      case 3:
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Add topics</h2>
            <Tabs defaultValue="manual" className="w-full" onValueChange={setCurrentTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <Pencil className="w-4 h-4" />
                  Add manually
                </TabsTrigger>
                <TabsTrigger value="keywords" className="flex items-center gap-2">
                  Keywords AI
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload CSV
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual">
                <div className="space-y-4">
                  <p className="text-gray-500 mb-4">
                    Add topics for your articles manually. Each topic is one article.
                  </p>
                  <div>
                    <label className="block text-sm font-medium mb-1">Topic:</label>
                    <Input 
                      type="text" 
                      placeholder="How To Improve Productivity In My Business?"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Options</label>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="h2" 
                          checked={options.addH2}
                          onCheckedChange={(checked) => 
                            setOptions(prev => ({...prev, addH2: checked as boolean}))
                          }
                        />
                        <label htmlFor="h2">Add H2 headings manually</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="faq" 
                          checked={options.faq}
                          onCheckedChange={(checked) => 
                            setOptions(prev => ({...prev, faq: checked as boolean}))
                          }
                        />
                        <label htmlFor="faq">FAQ</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="toc" 
                          checked={options.tableOfContents}
                          onCheckedChange={(checked) => 
                            setOptions(prev => ({...prev, tableOfContents: checked as boolean}))
                          }
                        />
                        <label htmlFor="toc">Table of Contents</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="image" 
                          checked={options.generateImage}
                          onCheckedChange={(checked) => 
                            setOptions(prev => ({...prev, generateImage: checked as boolean}))
                          }
                        />
                        <label htmlFor="image">Generate Image</label>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-purple-100 text-purple-600 hover:bg-purple-200">
                    Add
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="keywords">
                <div className="space-y-4">
                  <p className="text-gray-500 mb-4">
                    Provide the keywords related to the article topics you're interested in. Based on them, Copymate will generate 10 topic suggestions.
                  </p>
                  <p className="text-sm text-purple-600 mb-4">This option is free.</p>
                  <Input 
                    type="text" 
                    placeholder="employee productivity"
                    className="w-full"
                  />
                  <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
                    Add
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="upload">
                <div className="space-y-4">
                  <p className="text-gray-500 mb-4">
                    Upload your Articles from CSV file.
                  </p>
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="secondary" 
                      className="flex items-center gap-2"
                      onClick={() => document.getElementById('csv-upload')?.click()}
                    >
                      <Upload className="w-4 h-4" />
                      Upload CSV
                    </Button>
                    <span className="text-gray-500">select file</span>
                    <input 
                      id="csv-upload"
                      type="file" 
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => {
                        // Handle file upload here
                        console.log(e.target.files?.[0]);
                      }}
                    />
                  </div>
                  <a href="#" className="text-purple-600 hover:underline text-sm block">
                    CSV example
                  </a>
                  <div className="bg-purple-50 p-4 rounded-lg mt-4">
                    <p className="text-purple-600 font-medium">Important:</p>
                    <p className="text-purple-600">
                      titles can not contain comma like: 'Small Changes, Big Results: 5 Tips For...'
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        );
      default:
        return null;
    }
  };

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
            {renderStepContent()}
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
                  <span className="text-gray-900">{selectedLanguage || "not selected"}</span>
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
            disabled={
              (currentStep === 1 && !selectedProject) ||
              (currentStep === 2 && !selectedLanguage)
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
