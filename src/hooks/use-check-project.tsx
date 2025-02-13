
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useCheckProject() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

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
    const checkAndRedirect = async () => {
      if (!session) {
        navigate("/auth");
        setIsLoading(false);
        return;
      }

      if (projects && projects.length === 0 && window.location.pathname !== "/create-project") {
        navigate("/create-project");
      } else if (projects && projects.length > 0 && window.location.pathname === "/create-project") {
        navigate("/");
      }
      setIsLoading(false);
    };

    checkAndRedirect();
  }, [session, projects, navigate]);

  return { isLoading };
}
