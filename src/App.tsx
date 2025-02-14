
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";
import Index from "./pages/Index";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <main>
          <Index />
          <Toaster />
        </main>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
