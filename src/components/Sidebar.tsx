
import { Home, FileText, ShoppingBag, Image, Database, Network, PenTool, User } from "lucide-react";
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
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors",
                  location.pathname === item.href && "bg-gray-100"
                )}
              >
                <item.icon className="w-5 h-5 text-gray-500" />
                {!collapsed && <span className="text-gray-700">{item.label}</span>}
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition-colors",
                !collapsed && "space-x-3"
              )}>
                <User className="w-5 h-5 text-gray-500" />
                {!collapsed && (
                  <span className="text-gray-700 text-sm truncate">
                    {session?.user?.email || "User"}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={() => navigate("/contact")}>
                Contact us
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate("/subscription")}>
                Subscription
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleLogout} className="text-red-600">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

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
