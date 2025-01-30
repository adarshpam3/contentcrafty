import { ProjectBreadcrumb } from "@/components/ProjectBreadcrumb";
import { CreateProjectForm } from "@/components/CreateProjectForm";

export default function CreateProject() {
  return (
    <div className="p-8">
      <ProjectBreadcrumb />

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold mb-2">Add new project</h1>
        <p className="text-gray-600 mb-8">You can add new project here.</p>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-6">Create project</h2>
          <CreateProjectForm />
        </div>
      </div>
    </div>
  );
}