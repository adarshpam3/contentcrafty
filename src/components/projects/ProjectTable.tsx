
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Project {
  id: string;
  name: string;
  articles: { count: number }[];
}

interface ProjectTableProps {
  projects: Project[];
  onDelete: (id: string) => void;
  onRename: (project: { id: string; name: string }) => void;
}

export function ProjectTable({ projects, onDelete, onRename }: ProjectTableProps) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-semibold">Project Name</TableHead>
          <TableHead className="font-semibold">Unpublished Articles</TableHead>
          <TableHead className="font-semibold">Wordpress</TableHead>
          <TableHead className="font-semibold">PBN</TableHead>
          <TableHead className="font-semibold w-[100px]">Delete</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow 
            key={project.id} 
            className="cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <TableCell onClick={() => navigate(`/projects/${project.id}`)}>
              <span className="text-[#06962c] hover:underline font-medium">
                {project.name}
              </span>
            </TableCell>
            <TableCell onClick={() => navigate(`/projects/${project.id}`)}>{project.articles?.[0]?.count || 0}</TableCell>
            <TableCell onClick={() => navigate(`/projects/${project.id}`)}>
              <X className="text-red-500 h-5 w-5" />
            </TableCell>
            <TableCell onClick={() => navigate(`/projects/${project.id}`)}>
              <X className="text-red-500 h-5 w-5" />
            </TableCell>
            <TableCell>
              <Button 
                variant="ghost" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50 px-3"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project.id);
                }}
              >
                Delete
              </Button>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRename({ id: project.id, name: project.name });
                    }}
                  >
                    Rename
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
