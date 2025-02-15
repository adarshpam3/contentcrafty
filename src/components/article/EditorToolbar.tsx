
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Table,
  Image as ImageIcon,
  Code,
  Quote,
  Undo,
  Redo,
} from "lucide-react";

interface FormatButton {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: () => void;
}

interface EditorToolbarProps {
  formatButtons: FormatButton[];
}

export function EditorToolbar({ formatButtons }: EditorToolbarProps) {
  return (
    <div className="border rounded-lg mb-4">
      <div className="flex flex-wrap items-center gap-2 p-2 border-b">
        <Select defaultValue="default">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="arial">Arial</SelectItem>
            <SelectItem value="times">Times New Roman</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="16">
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="14">14</SelectItem>
            <SelectItem value="16">16</SelectItem>
            <SelectItem value="18">18</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex flex-wrap gap-1 ml-2">
          {formatButtons.map((button) => (
            <Button
              key={button.label}
              variant="ghost"
              size="sm"
              className="p-2 h-8 hover:bg-[#e6f4ea] hover:text-[#06962c]"
              title={button.label}
              onClick={button.action}
            >
              <button.icon className="h-4 w-4" />
            </Button>
          ))}
          <div className="border-l border-gray-200 mx-2" />
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-8 hover:bg-[#e6f4ea] hover:text-[#06962c]"
            title="Undo"
            onClick={() => document.execCommand('undo')}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 h-8 hover:bg-[#e6f4ea] hover:text-[#06962c]"
            title="Redo"
            onClick={() => document.execCommand('redo')}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
