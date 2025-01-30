import { Input } from "@/components/ui/input";

interface ProjectNameInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ProjectNameInput({ value, onChange, disabled }: ProjectNameInputProps) {
  return (
    <div className="mb-6">
      <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
        Project name
      </label>
      <Input
        id="projectName"
        type="text"
        placeholder="www.copymate.app"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required
      />
    </div>
  );
}