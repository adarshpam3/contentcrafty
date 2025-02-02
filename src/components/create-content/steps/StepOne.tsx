import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface StepOneProps {
  selectedProject: string;
  setSelectedProject: (value: string) => void;
}

export function StepOne({ selectedProject, setSelectedProject }: StepOneProps) {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    },
  });

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
          {isLoading ? (
            <SelectItem value="loading" disabled>Loading projects...</SelectItem>
          ) : projects && projects.length > 0 ? (
            projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-projects" disabled>No projects found</SelectItem>
          )}
        </SelectContent>
      </Select>
    </Card>
  );
}