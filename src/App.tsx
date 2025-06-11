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
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './App.css';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000, // 30 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retryOnMount: false,
      refetchInterval: false,
    },
  },
});

// Create a cache instance that doesn't include data attributes
const cache = createCache({
  key: 'mui',
  prepend: true,
  // Disable emotion's data attributes
  stylisPlugins: [],
});

function App() {
  return (
    <CacheProvider value={cache}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AppProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            </LocalizationProvider>
          </AppProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </CacheProvider>
  );
}

export default App;
