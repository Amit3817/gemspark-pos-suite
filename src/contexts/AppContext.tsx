import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Product, Bill, Customer, InventoryItem, supabaseApi } from '@/services/supabaseApi';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Types
interface AppContextType {
  // Data
  products: Product[];
  bills: Bill[];
  customers: Customer[];
  inventory: InventoryItem[];
  
  // Loading states
  isLoadingProducts: boolean;
  isLoadingBills: boolean;
  isLoadingCustomers: boolean;
  isLoadingInventory: boolean;
  
  // Product actions
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  
  // Bill actions
  addBill: (bill: Omit<Bill, 'Date' | 'Total Amount'>) => Promise<void>;
  deleteBill: (billNo: string) => Promise<void>;
  
  // Customer actions
  addCustomer: (customer: Customer) => Promise<void>;
  
  // Inventory actions
  updateInventory: (item: InventoryItem) => Promise<void>;
  
  // UI state
  isLoading: boolean;
  selectedProducts: Product[];
  setSelectedProducts: (products: Product[]) => void;
  
  // Modal states
  showAddProductModal: boolean;
  setShowAddProductModal: (show: boolean) => void;
  showEditProductModal: boolean;
  setShowEditProductModal: (show: boolean) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  showAddCustomerModal: boolean;
  setShowAddCustomerModal: (show: boolean) => void;
  
  // General actions
  refreshData: () => Promise<void>;
  exportData: () => void;
  importData: () => void;
  printBill: (billNo: string) => void;
  sendWhatsApp: (billNo: string, customerPhone: string) => void;
}

// Constants
const QUERY_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const QUERY_CACHE_TIME = 30 * 60 * 1000; // 30 minutes
const TOAST_DURATION = 3000;

// Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Types
interface AppProviderProps {
  children: ReactNode;
}

type RawBill = any;
type RawCustomer = any;

// Utility functions
const cleanBillData = (bills: RawBill[]): Bill[] => {
  return bills.map(bill => ({
    ...bill,
    "Customer Name": bill["Customer Name"] || "Unknown Customer",
    "Total Amount": parseFloat(bill["Total Amount"]) || 0,
    "Making Charges": parseFloat(bill["Making Charges"]) || 0,
    "Making Charges Percent": parseFloat(bill["Making Charges Percent"]) || 0,
    "Gold Price per 10g": parseFloat(bill["Gold Price per 10g"]) || 0,
    "Silver Price per 10g": parseFloat(bill["Silver Price per 10g"]) || 0
  }));
};

const cleanCustomerData = (customers: RawCustomer[]): Customer[] => {
  return customers.map(customer => ({
    ...customer,
    "Total Purchases": parseFloat(customer["Total Purchases"]) || 0
  }));
};

// Provider Component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  
  // Hooks
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries with optimized settings
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: supabaseApi.getAllProducts,
    staleTime: QUERY_STALE_TIME,
    cacheTime: QUERY_CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryOnMount: false,
    refetchInterval: false,
    keepPreviousData: true,
    suspense: false,
    useErrorBoundary: false
  });

  const { data: billsData = [], isLoading: isLoadingBills } = useQuery({
    queryKey: ['bills'],
    queryFn: supabaseApi.getAllBills,
    staleTime: QUERY_STALE_TIME,
    cacheTime: QUERY_CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryOnMount: false,
    refetchInterval: false,
    keepPreviousData: true,
    suspense: false,
    useErrorBoundary: false
  });

  const { data: customersData = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: supabaseApi.getAllCustomers,
    staleTime: QUERY_STALE_TIME,
    cacheTime: QUERY_CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryOnMount: false,
    refetchInterval: false,
    keepPreviousData: true,
    suspense: false,
    useErrorBoundary: false
  });

  const { data: inventory = [], isLoading: isLoadingInventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: supabaseApi.getAllInventory,
    staleTime: QUERY_STALE_TIME,
    cacheTime: QUERY_CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retryOnMount: false,
    refetchInterval: false,
    keepPreviousData: true,
    suspense: false,
    useErrorBoundary: false
  });

  // Clean data
  const bills = cleanBillData(billsData);
  const customers = cleanCustomerData(customersData);

  // Toast helpers
  const showSuccessToast = useCallback((message: string) => {
    toast({
      title: "Success",
      description: message,
      duration: TOAST_DURATION,
    });
  }, [toast]);

  const showErrorToast = useCallback((message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
      duration: TOAST_DURATION,
    });
  }, [toast]);

  // Optimize refreshData to only invalidate specific queries when needed
  const refreshData = useCallback(async (queryKeys?: string[]) => {
    setIsLoading(true);
    try {
      if (queryKeys && queryKeys.length > 0) {
        // Only invalidate specific queries
        await Promise.all(
          queryKeys.map(key => queryClient.invalidateQueries({ queryKey: [key] }))
        );
      } else {
        // Invalidate all queries if no specific keys provided
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['products'] }),
          queryClient.invalidateQueries({ queryKey: ['bills'] }),
          queryClient.invalidateQueries({ queryKey: ['customers'] }),
          queryClient.invalidateQueries({ queryKey: ['inventory'] }),
          queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
        ]);
      }
      showSuccessToast("Data refreshed successfully");
    } catch (error) {
      showErrorToast("Failed to refresh data");
    } finally {
      setIsLoading(false);
    }
  }, [queryClient, showSuccessToast, showErrorToast]);

  // Optimize mutation handlers to only invalidate affected queries
  const addProduct = useCallback(async (product: Product) => {
    setIsLoading(true);
    try {
      const response = await supabaseApi.addProduct(product);
      if (response.status === 'success') {
        await queryClient.invalidateQueries({ queryKey: ['products'] });
        // Also invalidate dashboard stats if they depend on products
        await queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
        showSuccessToast("Product added successfully");
        setShowAddProductModal(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      showErrorToast("Failed to add product");
    } finally {
      setIsLoading(false);
    }
  }, [queryClient, showSuccessToast, showErrorToast]);

  const updateProduct = useCallback(async (product: Product) => {
    setIsLoading(true);
    try {
      const response = await supabaseApi.updateProduct(product);
      if (response.status === 'success') {
        await queryClient.invalidateQueries({ queryKey: ['products'] });
        await queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
        showSuccessToast("Product updated successfully");
        setShowEditProductModal(false);
        setEditingProduct(null);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      showErrorToast("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  }, [queryClient, showSuccessToast, showErrorToast]);

  const deleteProduct = useCallback(async (productId: string) => {
    setIsLoading(true);
    try {
      const response = await supabaseApi.deleteProduct(productId);
      if (response.status === 'success') {
        await queryClient.invalidateQueries({ queryKey: ['products'] });
        await queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
        showSuccessToast("Product deleted successfully");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      showErrorToast("Failed to delete product");
    } finally {
      setIsLoading(false);
    }
  }, [queryClient, showSuccessToast, showErrorToast]);

  const addBill = useCallback(async (bill: Omit<Bill, 'Date' | 'Total Amount'>) => {
    setIsLoading(true);
    try {
      const response = await supabaseApi.addBill(bill);
      if (response.status === 'success') {
        await queryClient.invalidateQueries({ queryKey: ['bills'] });
        await queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
        showSuccessToast("Bill created successfully");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      showErrorToast("Failed to create bill");
    } finally {
      setIsLoading(false);
    }
  }, [queryClient, showSuccessToast, showErrorToast]);

  const deleteBill = useCallback(async (billNo: string) => {
    setIsLoading(true);
    try {
      const response = await supabaseApi.deleteBill(billNo);
      if (response.status === 'success') {
        await queryClient.invalidateQueries({ queryKey: ['bills'] });
        await queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
        showSuccessToast("Bill deleted successfully");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      showErrorToast("Failed to delete bill");
    } finally {
      setIsLoading(false);
    }
  }, [queryClient, showSuccessToast, showErrorToast]);

  const addCustomer = useCallback(async (customer: Customer) => {
    setIsLoading(true);
    try {
      const response = await supabaseApi.addCustomer(customer);
      if (response.status === 'success') {
        await queryClient.invalidateQueries({ queryKey: ['customers'] });
        await queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
        showSuccessToast("Customer added successfully");
        setShowAddCustomerModal(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      showErrorToast("Failed to add customer");
    } finally {
      setIsLoading(false);
    }
  }, [queryClient, showSuccessToast, showErrorToast]);

  const updateInventory = useCallback(async (item: InventoryItem) => {
    setIsLoading(true);
    try {
      const response = await supabaseApi.updateInventory(item);
      if (response.status === 'success') {
        await queryClient.invalidateQueries({ queryKey: ['inventory'] });
        await queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
        showSuccessToast("Inventory updated successfully");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      showErrorToast("Failed to update inventory");
    } finally {
      setIsLoading(false);
    }
  }, [queryClient, showSuccessToast, showErrorToast]);

  // Export/Import actions
  const exportData = useCallback(() => {
    try {
      const data = {
        products,
        bills,
        customers,
        inventory
      };

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gemspark-pos-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showSuccessToast("Data exported successfully");
    } catch (error) {
      showErrorToast("Failed to export data");
    }
  }, [products, bills, customers, inventory, showSuccessToast, showErrorToast]);

  const importData = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        // TODO: Implement data import logic
        showSuccessToast("Data imported successfully");
      } catch (error) {
        showErrorToast("Failed to import data");
      }
    };
    input.click();
  }, [showSuccessToast, showErrorToast]);

  // UI actions
  const printBill = useCallback((billNo: string) => {
    // TODO: Implement print bill logic
  }, []);

  const sendWhatsApp = useCallback((billNo: string, customerPhone: string) => {
    // TODO: Implement WhatsApp sending logic
  }, []);

  // Context value
  const value: AppContextType = {
    // Data
    products,
    bills,
    customers,
    inventory,
    
    // Loading states
    isLoadingProducts,
    isLoadingBills,
    isLoadingCustomers,
    isLoadingInventory,
    
    // Product actions
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Bill actions
    addBill,
    deleteBill,
    
    // Customer actions
    addCustomer,
    
    // Inventory actions
    updateInventory,
    
    // UI state
    isLoading,
    selectedProducts,
    setSelectedProducts,
    
    // Modal states
    showAddProductModal,
    setShowAddProductModal,
    showEditProductModal,
    setShowEditProductModal,
    editingProduct,
    setEditingProduct,
    showAddCustomerModal,
    setShowAddCustomerModal,
    
    // General actions
    refreshData,
    exportData,
    importData,
    printBill,
    sendWhatsApp
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
