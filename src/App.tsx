import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import Index from "@/pages/Index";
import Articles from "@/pages/Articles";
import Projects from "@/pages/Projects";
import CreateProject from "@/pages/CreateProject";
import CreateContent from "@/pages/CreateContent";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import { supabase } from "@/integrations/supabase/client";
import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex min-h-screen">
          {session && <Sidebar />}
          <div className="flex-1 bg-[#fafafa]">
            <Routes>
              <Route
                path="/auth"
                element={session ? <Navigate to="/" /> : <Auth />}
              />
              <Route
                path="/"
                element={session ? <Index /> : <Navigate to="/auth" />}
              />
              <Route
                path="/articles"
                element={session ? <Articles /> : <Navigate to="/auth" />}
              />
              <Route
                path="/projects"
                element={session ? <Projects /> : <Navigate to="/auth" />}
              />
              <Route
                path="/create-project"
                element={session ? <CreateProject /> : <Navigate to="/auth" />}
              />
              <Route
                path="/create-content"
                element={session ? <CreateContent /> : <Navigate to="/auth" />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;