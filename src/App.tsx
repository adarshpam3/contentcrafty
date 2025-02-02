import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import Articles from "./pages/Articles";
import { ArticleViewer } from "./components/ArticleViewer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { ContentCreationProvider } from "./components/create-content/ContentCreationProvider";
import { MainContent } from "./components/create-content/MainContent";
import { CreateContent } from "./pages/CreateContent";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-auto bg-gray-50">
            <Routes>
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:id" element={<ArticleViewer />} />
              <Route
                path="/create-content"
                element={
                  <ContentCreationProvider>
                    <CreateContent>
                      <MainContent />
                    </CreateContent>
                  </ContentCreationProvider>
                }
              />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;