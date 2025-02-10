
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Articles from "@/pages/Articles";
import Projects from "@/pages/Projects";
import ProjectDetails from "@/pages/ProjectDetails";
import CreateProject from "@/pages/CreateProject";
import CreateContent from "@/pages/CreateContent";
import CreatePage from "@/pages/CreatePage";
import CreateEcommerceContent from "@/pages/CreateEcommerceContent";
import CreateNeuronContent from "@/pages/CreateNeuronContent";
import NotFound from "@/pages/NotFound";
import ArticleView from "@/pages/ArticleView";
import CategoryView from "@/pages/CategoryView";
import Auth from "@/pages/Auth";
import ImageGenerator from "@/pages/ImageGenerator";
import IndexingApi from "@/pages/IndexingApi";
import PbnManagement from "@/pages/PbnManagement";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/create-page" element={<CreatePage />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:articleId" element={<ArticleView />} />
          <Route path="/category/:categoryId" element={<CategoryView />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/create-content" element={<CreateContent />} />
          <Route path="/create-ecommerce-content" element={<CreateEcommerceContent />} />
          <Route path="/create-neuron-content" element={<CreateNeuronContent />} />
          <Route path="/image-generator" element={<ImageGenerator />} />
          <Route path="/indexing-api" element={<IndexingApi />} />
          <Route path="/pbn" element={<PbnManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
