
import { Home, FileText, ShoppingBag, Image, Database, Network, PenTool, User, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: FileText, label: "Articles", href: "/articles" },
  { icon: ShoppingBag, label: "Projects", href: "/projects" },
  { icon: PenTool, label: "Create Content", href: "/create-page" },
  { icon: Image, label: "Image Generator", href: "/image-generator" },
  { icon: Database, label: "Indexing API", href: "/indexing-api" },
  { icon: Network, label: "PBN Management", href: "/pbn" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={cn(
        "h-screen bg-white transition-all duration-300 ease-in-out border-r border-gray-100 relative",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h1 className={cn(
            "font-semibold text-[#06962c]",
            collapsed ? "text-center text-xl" : "text-2xl"
          )}>
            {collapsed ? "C" : "Copymate"}
          </h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    "hover:bg-[#e6f4ea] hover:text-[#06962c]",
                    isActive 
                      ? "bg-[#e6f4ea] text-[#06962c] font-medium" 
                      : "text-gray-600"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-[#06962c]" : "text-gray-500"
                  )} />
                  {!collapsed && (
                    <span className="text-sm">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-100 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center w-full p-3 rounded-lg transition-all duration-200",
                "hover:bg-[#e6f4ea] hover:text-[#06962c]",
                !collapsed && "gap-3"
              )}>
                <div className="w-8 h-8 rounded-full bg-[#e6f4ea] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#06962c]" />
                </div>
                {!collapsed && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {session?.user?.email || "User"}
                    </p>
                    <p className="text-xs text-gray-500">Manage Account</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                onSelect={() => navigate("/contact")}
                className="text-sm"
              >
                Contact us
              </DropdownMenuItem>
              <DropdownMenuItem 
                onSelect={() => navigate("/subscription")}
                className="text-sm"
              >
                Subscription
              </DropdownMenuItem>
              <DropdownMenuItem 
                onSelect={handleLogout} 
                className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 bg-white border border-gray-100 rounded-full p-1.5 shadow-sm hover:bg-[#e6f4ea] transition-colors group"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-[#06962c]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-[#06962c]" />
          )}
        </button>
      </div>
    </div>
  );
}
