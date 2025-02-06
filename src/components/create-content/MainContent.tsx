import { StepOne } from "./steps/StepOne";
import { StepTwo } from "./steps/StepTwo";
import { StepThree } from "./steps/StepThree";
import { StepFour } from "./steps/StepFour";
import { StepFive } from "./steps/StepFive";
import { useContentCreation } from "./ContentCreationProvider";

export function MainContent() {
  const {
    currentStep,
    selectedProject,
    setSelectedProject,
    selectedLanguage,
    setSelectedLanguage,
    categories,
  } = useContentCreation();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne 
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
        );
      case 2:
        return (
          <StepTwo
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        );
      case 3:
        return <StepThree />;
      case 4:
        return <StepFour categories={categories} />;
      case 5:
        return <StepFive />;
      default:
        return null;
    }
  };

  return renderStepContent();
}
