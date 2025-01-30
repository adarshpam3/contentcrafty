import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import Index from "@/pages/Index";
import Articles from "@/pages/Articles";
import CreateContent from "@/pages/CreateContent";
import NotFound from "@/pages/NotFound";
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
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 bg-[#fafafa]">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/create-content" element={<CreateContent />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;