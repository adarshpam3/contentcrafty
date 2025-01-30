import { Button } from "@/components/ui/button";

export function StepFive() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-2xl font-semibold mb-4">Well done mate!</h2>
      <p className="text-gray-600 text-center mb-8">
        Your content is being created. It will take a few minutes depending on the amount of text to write.
      </p>
      <div className="space-x-4">
        <Button 
          variant="outline" 
          className="px-6"
          onClick={() => window.location.href = '/articles'}
        >
          Go to articles
        </Button>
        <Button 
          className="px-6 bg-purple-600 hover:bg-purple-700"
          onClick={() => window.location.href = '/create-content'}
        >
          Write more content
        </Button>
      </div>
    </div>
  );
}