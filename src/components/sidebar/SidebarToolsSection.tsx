import { cn } from "@/lib/utils";
import { Image, Database, Network } from "lucide-react";
import { SidebarMenuItem } from "./SidebarMenuItem";

interface SidebarToolsSectionProps {
  collapsed: boolean;
  isActive: (href: string) => boolean;
}

export function SidebarToolsSection({ collapsed, isActive }: SidebarToolsSectionProps) {
  const tools = [
    { icon: Image, label: "Image Generator", href: "/image-generator" },
    { icon: Database, label: "Indexing API", href: "/indexing-api" },
    { icon: Network, label: "PBN Management", href: "/pbn" },
  ];

  return (
    <div className="mt-6">
      {!collapsed && (
        <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Tools
        </h2>
      )}
      <div className="mt-2 space-y-1">
        {tools.map((tool) => (
          <SidebarMenuItem
            key={tool.label}
            {...tool}
            isActive={isActive(tool.href)}
            collapsed={collapsed}
          />
        ))}
      </div>
    </div>
  );
}