
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Article {
  id: string;
  topic: string;
  word_count: number;
  character_count: number;
  status: string;
}

interface ArticlesTabProps {
  articles: Article[];
}

export function ArticlesTab({ articles }: ArticlesTabProps) {
  const navigate = useNavigate();

  if (articles.length === 0) {
    return (
      <div className="bg-purple-50 rounded-lg p-6 text-center">
        <p className="text-purple-700 mb-4">
          You don't have any articles assigned to this project yet. Use one of our models and start creating outstanding content!
        </p>
        <Button 
          onClick={() => navigate("/create-content")}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Create Content
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search by article title..."
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <Button variant="outline" className="text-red-500">Delete Selected</Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="rounded border-gray-300" />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Words</TableHead>
              <TableHead>Characters</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Used</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow 
                key={article.id}
                className="cursor-pointer"
                onClick={() => navigate(`/articles/${article.id}`)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableCell>
                <TableCell className="font-medium">{article.topic}</TableCell>
                <TableCell>{article.word_count || 0}</TableCell>
                <TableCell>{article.character_count || 0}</TableCell>
                <TableCell>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                    {article.status || 'completed'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-red-500">×</span>
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
