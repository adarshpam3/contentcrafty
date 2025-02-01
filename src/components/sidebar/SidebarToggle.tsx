interface SidebarToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarToggle({ collapsed, onToggle }: SidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="p-4 border-t border-gray-200 hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center justify-center">
        <span className="sr-only">Toggle sidebar</span>
        {collapsed ? "→" : "←"}
      </div>
    </button>
  );
}