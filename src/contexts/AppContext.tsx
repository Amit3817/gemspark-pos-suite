import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Bill, Customer, InventoryItem, supabaseApi } from '@/services/supabaseApi';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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

// Helper function to clean data from Supabase
const cleanBillData = (bills: any[]): Bill[] => {
  return bills.map(bill => ({
    ...bill,
    "Customer Name": bill["Customer Name"] || "Unknown Customer",
    "Total Amount": typeof bill["Total Amount"] === 'number' ? bill["Total Amount"] : parseFloat(bill["Total Amount"]) || 0,
    "Making Charges": typeof bill["Making Charges"] === 'number' ? bill["Making Charges"] : parseFloat(bill["Making Charges"]) || 0,
    "Making Charges Percent": typeof bill["Making Charges Percent"] === 'number' ? bill["Making Charges Percent"] : parseFloat(bill["Making Charges Percent"]) || 0,
    "Gold Price per 10g": typeof bill["Gold Price per 10g"] === 'number' ? bill["Gold Price per 10g"] : parseFloat(bill["Gold Price per 10g"]) || 0,
    "Silver Price per 10g": typeof bill["Silver Price per 10g"] === 'number' ? bill["Silver Price per 10g"] : parseFloat(bill["Silver Price per 10g"]) || 0
  }));
};

const cleanCustomerData = (customers: any[]): Customer[] => {
  return customers.map(customer => ({
    ...customer,
    "Total Purchases": typeof customer["Total Purchases"] === 'number' ? customer["Total Purchases"] : parseFloat(customer["Total Purchases"]) || 0
  }));
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Central data fetching with React Query using Supabase
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: supabaseApi.getAllProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const { data: billsData = [], isLoading: isLoadingBills } = useQuery({
    queryKey: ['bills'],
    queryFn: supabaseApi.getAllBills,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const { data: customersData = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: supabaseApi.getAllCustomers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const { data: inventory = [], isLoading: isLoadingInventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: supabaseApi.getAllInventory,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Clean the data before providing it
  const bills = cleanBillData(billsData);
  const customers = cleanCustomerData(customersData);

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
      const response = await supabaseApi.addProduct(product);
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
      const response = await supabaseApi.updateProduct(product);
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
      const response = await supabaseApi.deleteProduct(productId);
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
      const response = await supabaseApi.addBill(bill);
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
      const response = await supabaseApi.deleteBill(billNo);
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
      const response = await supabaseApi.addCustomer(customer);
      if (response.status === 'success') {
        await queryClient.invalidateQueries({ queryKey: ['customers'] });
        toast({
          title: "Success",
          description: "Customer added successfully",
        });
        setShowAddCustomerModal(false);
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
      const response = await supabaseApi.updateInventory(item);
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
    // Create CSV data for products
    const productsCSV = [
      ['Product ID', 'Product Name', 'Category', 'Metal Type', 'Carat', 'Weight (g)', 'Quantity', 'Rate per g', 'Notes'],
      ...products.map(p => [
        p["Product ID"],
        p["Product Name"],
        p["Category"],
        p["Metal Type"],
        p["Carat"],
        p["Weight (g)"],
        p["Quantity"],
        p["Rate per g"],
        p["Notes"]
      ])
    ];

    // Create CSV data for customers
    const customersCSV = [
      ['Customer ID', 'Name', 'Phone', 'Email', 'Status', 'Total Purchases', 'Last Visit'],
      ...customers.map(c => [
        c["Customer ID"],
        c["Name"],
        c["Phone"],
        c["Email"],
        c["Status"],
        c["Total Purchases"],
        c["Last Visit"]
      ])
    ];

    // Create CSV data for bills
    const billsCSV = [
      ['Bill No', 'Date', 'Customer Name', 'Phone Number', 'Product ID', 'Product Name', 'Metal Type', 'Carat', 'Weight (g)', 'Rate per g', 'Making Charges', 'GST (%)', 'Total Amount'],
      ...bills.map(b => [
        b["Bill No"],
        b["Date"],
        b["Customer Name"],
        b["Phone Number"],
        b["Product ID"],
        b["Product Name"],
        b["Metal Type"],
        b["Carat"],
        b["Weight (g)"],
        b["Rate per g"],
        b["Making Charges"],
        b["GST (%)"],
        b["Total Amount"]
      ])
    ];

    // Convert to CSV string and download
    const convertToCSV = (data: any[][]) => {
      return data.map(row => row.join(',')).join('\n');
    };

    const downloadCSV = (data: string, filename: string) => {
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    };

    downloadCSV(convertToCSV(productsCSV), 'products.csv');
    downloadCSV(convertToCSV(customersCSV), 'customers.csv');
    downloadCSV(convertToCSV(billsCSV), 'bills.csv');

    toast({
      title: "Export Complete",
      description: "Data exported successfully to CSV files",
    });
  };

  const importData = () => {
    toast({
      title: "Import Started",
      description: "Please select a file to import",
    });
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
    
    // Actions
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
    showAddCustomerModal,
    setShowAddCustomerModal,
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
