import { Home, FileText, ShoppingBag, Image, Database, Network, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: FileText, label: "Articles", href: "/articles" },
  { icon: ShoppingBag, label: "Projects", href: "/projects" },
  { icon: Plus, label: "Create Content", href: "/create-content" },
  { 
    label: "Tools",
    isHeader: true,
    items: [
      { icon: Image, label: "Image Generator", href: "/image-generator" },
      { icon: Database, label: "Indexing API", href: "/indexing-api" },
      { icon: Network, label: "PBN Management", href: "/pbn" },
    ]
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
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
        <div className="p-4 border-b border-gray-200">
          <h1 className={cn("font-semibold", collapsed ? "text-center" : "text-xl")}>
            {collapsed ? "C" : "Copymate"}
          </h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              item.isHeader ? (
                <div key={index} className="mt-6">
                  {!collapsed && (
                    <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {item.label}
                    </h2>
                  )}
                  <div className="mt-2 space-y-1">
                    {item.items?.map((subItem) => (
                      <a
                        key={subItem.label}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                          isActive(subItem.href)
                            ? "bg-purple-50 text-purple-600"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <subItem.icon className="w-5 h-5" />
                        {!collapsed && <span>{subItem.label}</span>}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors",
                    isActive(item.href)
                      ? "bg-purple-50 text-purple-600"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {!collapsed && <span>{item.label}</span>}
                </a>
              )
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