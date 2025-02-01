import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { MenuItem } from "@/config/menuItems";

interface NavigationItemProps extends MenuItem {
  collapsed: boolean;
  isActive: boolean;
}

export function NavigationItem({ icon: Icon, label, href, collapsed, isActive }: NavigationItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors",
        isActive && "bg-gray-100"
      )}
    >
      <Icon className="w-5 h-5 text-gray-500" />
      {!collapsed && <span className="text-gray-700">{label}</span>}
    </Link>
  );
}