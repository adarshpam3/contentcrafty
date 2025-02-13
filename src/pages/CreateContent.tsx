
import { Breadcrumb } from "@/components/create-content/Breadcrumb";
import { CreateContentSteps } from "@/components/create-content/CreateContentSteps";
import { MainContent } from "@/components/create-content/MainContent";
import { Summary } from "@/components/create-content/Summary";
import { NavigationButtons } from "@/components/create-content/NavigationButtons";
import { ContentCreationProvider, useContentCreation } from "@/components/create-content/ContentCreationProvider";

function CreateContentInner() {
  const {
    currentStep,
    selectedProject,
    selectedLanguage,
    topics,
    handleNext,
    handleBack
  } = useContentCreation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        <CreateContentSteps currentStep={currentStep} />

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <MainContent />
          </div>

          <div className="col-span-1">
            <Summary
              categories={topics.length}
              selectedLanguage={selectedLanguage}
            />
          </div>
        </div>

        {currentStep < 5 && (
          <NavigationButtons
            onBack={handleBack}
            onNext={handleNext}
            disableNext={
              (currentStep === 1 && !selectedProject) ||
              (currentStep === 2 && !selectedLanguage)
            }
          />
        )}
      </div>
    </div>
  );
}

export default function CreateContent() {
  return (
    <ContentCreationProvider>
      <CreateContentInner />
    </ContentCreationProvider>
  );
}
