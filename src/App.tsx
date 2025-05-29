
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppProvider } from "@/contexts/AppContext";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import ProductCatalog from "./components/ProductCatalog";
import BillingSystem from "./components/BillingSystem";
import Bills from "./components/Bills";
import Inventory from "./components/Inventory";
import Customers from "./components/Customers";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<ProductCatalog />} />
                <Route path="/billing" element={<BillingSystem />} />
                <Route path="/bills" element={<Bills />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
