import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface ArticleSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSortToggle: () => void;
}

export const ArticleSearch = ({ 
  searchQuery, 
  onSearchChange, 
  onSortToggle 
}: ArticleSearchProps) => {
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
};