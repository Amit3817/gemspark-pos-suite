import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Bill, Customer, InventoryItem, googleSheetsApi } from '@/services/googleSheetsApi';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface AppContextType {
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
  
  // General actions
  refreshData: () => Promise<void>;
  exportData: () => void;
  importData: () => void;
  printBill: (billNo: string) => void;
  sendWhatsApp: (billNo: string, customerPhone: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const refreshData = async () => {
    setIsLoading(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['bills'] });
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
      await queryClient.invalidateQueries({ queryKey: ['inventory'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast({
        title: "Success",
        description: "Data refreshed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (product: Product) => {
    setIsLoading(true);
    try {
      const response = await googleSheetsApi.addProduct(product);
      if (response.status === 'success') {
        await queryClient.invalidateQueries({ queryKey: ['products'] });
        toast({
          title: "Success",
          description: "Product added successfully",
        });
        setShowAddProductModal(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (product: Product) => {
    setIsLoading(true);
    try {
      const response = await googleSheetsApi.updateProduct(product);
      if (response.status === 'success') {
        await queryClient.invalidateQueries({ queryKey: ['products'] });
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
        setShowEditProductModal(false);
        setEditingProduct(null);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      const response = await googleSheetsApi.deleteProduct(productId);
      if (response.status === 'success') {
        await queryClient.invalidateQueries({ queryKey: ['products'] });
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addBill = async (bill: Omit<Bill, 'Date' | 'Total Amount'>) => {
    setIsLoading(true);
    try {
      const response = await googleSheetsApi.addBill(bill);
      if (response.status === 'success') {
        await queryClient.invalidateQueries({ queryKey: ['bills'] });
        toast({
          title: "Success",
          description: "Bill created successfully",
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create bill",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBill = async (billNo: string) => {
    setIsLoading(true);
    try {
      const response = await googleSheetsApi.deleteBill(billNo);
      if (response.status === 'success') {
        await queryClient.invalidateQueries({ queryKey: ['bills'] });
        toast({
          title: "Success",
          description: "Bill deleted successfully",
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete bill",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCustomer = async (customer: Customer) => {
    setIsLoading(true);
    try {
      const response = await googleSheetsApi.addCustomer(customer);
      if (response.status === 'success') {
        await queryClient.invalidateQueries({ queryKey: ['customers'] });
        toast({
          title: "Success",
          description: "Customer added successfully",
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateInventory = async (item: InventoryItem) => {
    setIsLoading(true);
    try {
      const response = await googleSheetsApi.updateInventory(item);
      if (response.status === 'success') {
        await queryClient.invalidateQueries({ queryKey: ['inventory'] });
        toast({
          title: "Success",
          description: "Inventory updated successfully",
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update inventory",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    toast({
      title: "Export Started",
      description: "Data export will begin shortly",
    });
    // Implementation for data export
    console.log('Exporting data...');
  };

  const importData = () => {
    toast({
      title: "Import Started",
      description: "Please select a file to import",
    });
    // Implementation for data import
    console.log('Importing data...');
  };

  const printBill = (billNo: string) => {
    toast({
      title: "Printing",
      description: `Printing bill ${billNo}`,
    });
    window.print();
  };

  const sendWhatsApp = (billNo: string, customerPhone: string) => {
    const message = `Thank you for your purchase! Your bill number is ${billNo}. For any queries, please contact us.`;
    const whatsappUrl = `https://wa.me/${customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast({
      title: "WhatsApp Opened",
      description: "Bill details sent via WhatsApp",
    });
  };

  const value: AppContextType = {
    addProduct,
    updateProduct,
    deleteProduct,
    addBill,
    deleteBill,
    addCustomer,
    updateInventory,
    isLoading,
    selectedProducts,
    setSelectedProducts,
    showAddProductModal,
    setShowAddProductModal,
    showEditProductModal,
    setShowEditProductModal,
    editingProduct,
    setEditingProduct,
    refreshData,
    exportData,
    importData,
    printBill,
    sendWhatsApp,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
