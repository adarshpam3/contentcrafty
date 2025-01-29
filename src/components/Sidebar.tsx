import { Home, FileText, ShoppingBag, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarMenuItem } from "./sidebar/SidebarMenuItem";
import { SidebarToolsSection } from "./sidebar/SidebarToolsSection";
import { SidebarToggle } from "./sidebar/SidebarToggle";

const mainMenuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: FileText, label: "Articles", href: "/articles" },
  { icon: ShoppingBag, label: "Projects", href: "/projects" },
  { icon: Plus, label: "Create Content", href: "/create-content" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <SidebarHeader collapsed={collapsed} />
        
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {mainMenuItems.map((item) => (
              <SidebarMenuItem
                key={item.label}
                {...item}
                isActive={isActive(item.href)}
                collapsed={collapsed}
              />
            ))}
            
            <SidebarToolsSection 
              collapsed={collapsed}
              isActive={isActive}
            />
          </div>
        </nav>

        <SidebarToggle
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>
    </div>
  );
}