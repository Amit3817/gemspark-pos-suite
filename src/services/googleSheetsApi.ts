
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEzsxLZDOIqnJSLnrQpQQF2Ms-Vw9WqULtCPmqYJ4yjTHYcqM3xCLP72YFT3UqBNj3/exec';

export interface Product {
  "Product ID": string;
  "Product Name": string;
  "Category": string;
  "Carat": string;
  "Weight (g)": number;
  "Quantity": number;
  "Rate per g": number;
  "Metal Type": string;
}

export interface Bill {
  "Bill No": string;
  "Date": string;
  "Customer Name": string;
  "Phone Number": string;
  "Product ID": string;
  "Product Name": string;
  "Metal Type": string;
  "Carat": string;
  "Weight (g)": number;
  "Rate per g": number;
  "Making Charges": number;
  "GST (%)": number;
  "Total Amount": number;
}

export interface Customer {
  "Customer ID": string;
  "Name": string;
  "Phone": string;
  "Email": string;
  "Address": string;
  "Total Purchases": number;
  "Last Visit": string;
  "Status": string;
}

export interface InventoryItem {
  "Item ID": string;
  "Item Name": string;
  "Category": string;
  "Current Stock": number;
  "Min Stock": number;
  "Max Stock": number;
  "Last Updated": string;
}

class GoogleSheetsApi {
  async getAllProducts(): Promise<Product[]> {
    try {
      console.log('Fetching products...');
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?method=getAllProducts`);
      const data = await response.json();
      console.log('Products fetched:', data);
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async addProduct(product: Product): Promise<{ status: string; message: string }> {
    try {
      const formData = new FormData();
      formData.append('method', 'addProduct');
      formData.append('data', JSON.stringify(product));
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw new Error('Failed to add product');
    }
  }

  async updateProduct(product: Product): Promise<{ status: string; message: string }> {
    try {
      const formData = new FormData();
      formData.append('method', 'updateProduct');
      formData.append('data', JSON.stringify(product));
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  async deleteProduct(productId: string): Promise<{ status: string; message: string }> {
    try {
      const formData = new FormData();
      formData.append('method', 'deleteProduct');
      formData.append('data', JSON.stringify({ productId }));
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }

  async getAllBills(): Promise<Bill[]> {
    try {
      console.log('Fetching bills...');
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?method=getAllBills`);
      const data = await response.json();
      console.log('Bills fetched:', data);
      return data || [];
    } catch (error) {
      console.error('Error fetching bills:', error);
      return [];
    }
  }

  async addBill(bill: Omit<Bill, 'Date' | 'Total Amount'>): Promise<{ status: string; message: string }> {
    try {
      const formData = new FormData();
      formData.append('method', 'addBill');
      formData.append('data', JSON.stringify(bill));
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding bill:', error);
      throw new Error('Failed to add bill');
    }
  }

  async deleteBill(billNo: string): Promise<{ status: string; message: string }> {
    try {
      const formData = new FormData();
      formData.append('method', 'deleteBill');
      formData.append('data', JSON.stringify({ billNo }));
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting bill:', error);
      throw new Error('Failed to delete bill');
    }
  }

  async getAllCustomers(): Promise<Customer[]> {
    try {
      console.log('Fetching customers...');
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?method=getAllCustomers`);
      const data = await response.json();
      console.log('Customers fetched:', data);
      return data || [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }

  async addCustomer(customer: Customer): Promise<{ status: string; message: string }> {
    try {
      const formData = new FormData();
      formData.append('method', 'addCustomer');
      formData.append('data', JSON.stringify(customer));
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding customer:', error);
      throw new Error('Failed to add customer');
    }
  }

  async getAllInventory(): Promise<InventoryItem[]> {
    try {
      console.log('Fetching inventory...');
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?method=getAllInventory`);
      const data = await response.json();
      console.log('Inventory fetched:', data);
      return data || [];
    } catch (error) {
      console.error('Error fetching inventory:', error);
      return [];
    }
  }

  async updateInventory(item: InventoryItem): Promise<{ status: string; message: string }> {
    try {
      const formData = new FormData();
      formData.append('method', 'updateInventory');
      formData.append('data', JSON.stringify(item));
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw new Error('Failed to update inventory');
    }
  }

  async getDashboardStats(): Promise<{
    totalSales: number;
    totalProducts: number;
    totalCustomers: number;
    lowStockItems: number;
    recentSales: Bill[];
    topProducts: Product[];
  }> {
    try {
      console.log('Fetching dashboard stats...');
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?method=getDashboardStats`);
      const data = await response.json();
      console.log('Dashboard stats fetched:', data);
      return data || {
        totalSales: 0,
        totalProducts: 0,
        totalCustomers: 0,
        lowStockItems: 0,
        recentSales: [],
        topProducts: [],
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalSales: 0,
        totalProducts: 0,
        totalCustomers: 0,
        lowStockItems: 0,
        recentSales: [],
        topProducts: [],
      };
    }
  }
}

export const googleSheetsApi = new GoogleSheetsApi();
