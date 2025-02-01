import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { menuItems } from "@/config/menuItems";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { NavigationItem } from "./sidebar/NavigationItem";
import { SidebarToggle } from "./sidebar/SidebarToggle";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

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
          <div className="space-y-2">
            {menuItems.map((item) => (
              <NavigationItem
                key={item.label}
                {...item}
                collapsed={collapsed}
                isActive={location.pathname === item.href}
              />
            ))}
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