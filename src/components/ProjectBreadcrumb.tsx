import { Link } from "react-router-dom";

export function ProjectBreadcrumb() {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
      <Link to="/" className="hover:text-gray-900">Home</Link>
      <span>/</span>
      <Link to="/projects" className="hover:text-gray-900">Projects</Link>
      <span>/</span>
      <span className="text-gray-900">Create new</span>
    </nav>
  );
}