import { Home, FileText, ShoppingBag, Image, Database, Network, PenTool } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const menuItems: MenuItem[] = [
  { icon: Home, label: "Home", href: "/" },
  { icon: FileText, label: "Articles", href: "/articles" },
  { icon: ShoppingBag, label: "Projects", href: "/projects" },
  { icon: PenTool, label: "Create Content", href: "/create-content" },
  { icon: Image, label: "Image Generator", href: "/image-generator" },
  { icon: Database, label: "Indexing API", href: "/indexing-api" },
  { icon: Network, label: "PBN Management", href: "/pbn" },
];