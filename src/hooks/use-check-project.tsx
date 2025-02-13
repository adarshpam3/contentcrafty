
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useCheckProject() {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: projects } = useQuery({
    queryKey: ["projects", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .limit(1);
      return projects;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      return;
    }

    if (projects && projects.length === 0 && window.location.pathname !== "/create-project") {
      navigate("/create-project");
    } else if (projects && projects.length > 0 && window.location.pathname === "/create-project") {
      navigate("/");
    }
  }, [session, projects, navigate]);

  return { isLoading: !projects };
}
