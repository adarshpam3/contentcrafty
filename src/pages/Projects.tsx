import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, X } from "lucide-react";

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seo_content')
        .select('page_url, count')
        .select(`
          page_url,
          count:id(count)
        `)
        .groupBy('page_url');

      if (error) throw error;
      return data;
    },
  });

  const filteredProjects = projects?.filter((project) =>
    project.page_url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <a href="/" className="hover:text-gray-900">Home</a>
            <span>/</span>
            <span className="text-gray-900">Projects</span>
          </nav>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-gray-600 mt-1">
            You have {projects?.length || 0} projects.
          </p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => navigate("/create-content")}
        >
          Create new
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search projects..."
          className="max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Unpublished Articles</TableHead>
              <TableHead>Wordpress</TableHead>
              <TableHead>PBN</TableHead>
              <TableHead>Delete</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredProjects?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No projects found
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects?.map((project) => (
                <TableRow key={project.page_url}>
                  <TableCell>
                    <span 
                      className="text-purple-600 cursor-pointer hover:underline"
                      onClick={() => navigate(`/projects/${encodeURIComponent(project.page_url)}`)}
                    >
                      {project.page_url}
                    </span>
                  </TableCell>
                  <TableCell>{project.count}</TableCell>
                  <TableCell>
                    <X className="text-red-500 h-5 w-5" />
                  </TableCell>
                  <TableCell>
                    <X className="text-red-500 h-5 w-5" />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" className="text-red-500 hover:text-red-700">
                      Delete
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}