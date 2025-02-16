
import { FileText, TrendingUp, CheckCircle } from "lucide-react";

interface ProjectStatsProps {
  totalProjects: number;
  totalArticles: number;
}

export function ProjectStats({ totalProjects, totalArticles }: ProjectStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="bg-[#e6f4ea] rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#06962c] rounded-lg p-2">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-[#06962c]">Total Projects</p>
            <p className="text-2xl font-semibold text-[#06962c]">{totalProjects}</p>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 rounded-lg p-2">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-blue-600">Total Articles</p>
            <p className="text-2xl font-semibold text-blue-600">{totalArticles}</p>
          </div>
        </div>
      </div>
      <div className="bg-emerald-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 rounded-lg p-2">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-emerald-600">Active Projects</p>
            <p className="text-2xl font-semibold text-emerald-600">{totalProjects}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
