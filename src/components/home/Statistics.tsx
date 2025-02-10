
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Pencil, Eye, FileEdit, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StatisticsCard } from "./StatisticsCard";

export function Statistics() {
  const navigate = useNavigate();

  const { data: totalArticles = 0 } = useQuery({
    queryKey: ["totalArticles"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq('is_category', false);
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: unpublishedArticles = 0 } = useQuery({
    queryKey: ["unpublishedArticles"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq('status', 'pending')
        .eq('is_category', false);
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: inProgressArticles = 0 } = useQuery({
    queryKey: ["inProgressArticles"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq('status', 'draft')
        .eq('is_category', false);
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: totalProjects = 0 } = useQuery({
    queryKey: ["totalProjects"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  const statistics = [
    {
      title: "Total",
      value: totalArticles,
      icon: Pencil,
      buttonText: "Go to articles",
      onClick: () => navigate('/articles')
    },
    {
      title: "Unpublished",
      value: unpublishedArticles,
      icon: Eye,
      buttonText: "Publish articles",
      onClick: () => navigate('/projects')
    },
    {
      title: "In progress",
      value: inProgressArticles,
      icon: FileEdit,
      buttonText: "View status",
      onClick: () => navigate('/articles')
    },
    {
      title: "Projects",
      value: totalProjects,
      icon: Globe,
      buttonText: "Go to projects",
      onClick: () => navigate('/projects')
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Your articles</h2>
      <p className="text-gray-600">
        {totalArticles === 0 
          ? "You haven't written any articles this month yet."
          : `You have written ${totalArticles} articles this month.`
        }
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statistics.map((stat, index) => (
          <StatisticsCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
}
