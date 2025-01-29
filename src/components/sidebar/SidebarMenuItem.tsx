import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarMenuItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive: boolean;
  collapsed: boolean;
}

export function SidebarMenuItem({ icon: Icon, label, href, isActive, collapsed }: SidebarMenuItemProps) {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
        isActive
          ? "bg-purple-50 text-purple-600"
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      <Icon className="w-5 h-5" />
      {!collapsed && <span>{label}</span>}
    </a>
  );
}