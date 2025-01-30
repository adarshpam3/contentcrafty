export function Breadcrumb() {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
      <a href="/" className="hover:text-gray-900">Home</a>
      <span>/</span>
      <a href="/models" className="hover:text-gray-900">Models</a>
      <span>/</span>
      <span className="text-gray-900">Copy-mate-003</span>
    </nav>
  );
}