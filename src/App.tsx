
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AppProvider } from '@/contexts/AppContext';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import Index from '@/pages/Index';
import ProductsPage from '@/pages/ProductsPage';
import BillingPage from '@/pages/BillingPage';
import CustomersPage from '@/pages/CustomersPage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';
import NotFound from '@/pages/NotFound';
import AddProductModal from '@/components/AddProductModal';
import EditProductModal from '@/components/EditProductModal';
import AddCustomerModal from '@/components/AddCustomerModal';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AppProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Index />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="billing" element={<BillingPage />} />
                  <Route path="customers" element={<CustomersPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
              <AddProductModal />
              <EditProductModal />
              <AddCustomerModal />
              <Toaster />
            </div>
          </Router>
        </AppProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
