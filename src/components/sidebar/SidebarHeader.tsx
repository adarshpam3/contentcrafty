import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  collapsed: boolean;
}

export function SidebarHeader({ collapsed }: SidebarHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <h1 className={cn("font-semibold", collapsed ? "text-center" : "text-xl")}>
        {collapsed ? "C" : "Copymate"}
      </h1>
    </div>
  );
}