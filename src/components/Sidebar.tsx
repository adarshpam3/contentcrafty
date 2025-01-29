import { Home, FileText, ShoppingBag, Image, Database, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: FileText, label: "Articles", href: "/articles" },
  { icon: ShoppingBag, label: "Projects", href: "/projects" },
  { icon: Image, label: "Image Generator", href: "/image-generator" },
  { icon: Database, label: "Indexing API", href: "/indexing-api" },
  { icon: Network, label: "PBN Management", href: "/pbn" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <h1 className={cn("font-semibold", collapsed ? "text-center" : "text-xl")}>
            {collapsed ? "C" : "Copymate"}
          </h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <item.icon className="w-5 h-5 text-gray-500" />
                {!collapsed && <span className="text-gray-700">{item.label}</span>}
              </a>
            ))}
          </div>
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-4 border-t border-gray-200 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center justify-center">
            <span className="sr-only">Toggle sidebar</span>
            {collapsed ? "→" : "←"}
          </div>
        </button>
      </div>
    </div>
  );
}