import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepOneProps {
  selectedProject: string;
  setSelectedProject: (value: string) => void;
}

export function StepOne({ selectedProject, setSelectedProject }: StepOneProps) {
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
}