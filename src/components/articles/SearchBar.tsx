import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortDirection: "asc" | "desc";
  onSortToggle: () => void;
}

export function SearchBar({ 
  searchQuery, 
  onSearchChange, 
  sortDirection, 
  onSortToggle 
}: SearchBarProps) {
  return (
    <div className="flex justify-between mb-4">
      <Input
        placeholder="Search by project or title..."
        className="max-w-md"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Button variant="outline" onClick={onSortToggle}>
        Order By <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}