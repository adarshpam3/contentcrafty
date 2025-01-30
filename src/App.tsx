import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import Index from "@/pages/Index";
import Articles from "@/pages/Articles";
import CreateContent from "@/pages/CreateContent";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  return (
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
  );
}

export default App;