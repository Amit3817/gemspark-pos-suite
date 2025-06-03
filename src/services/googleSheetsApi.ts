
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

// Simple fetch wrapper with better error handling
async function makeRequest(url: string, options: RequestInit = {}): Promise<any> {
  try {
    console.log('Making request to:', url);
    
    const response = await fetch(url, {
      ...options,
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...options.headers,
      }
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    console.log('Raw response:', text);

    // Try to parse as JSON
    try {
      const data = JSON.parse(text);
      return data;
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      throw new Error(`Invalid JSON response: ${text}`);
    }
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

class GoogleSheetsApi {
  async getAllProducts(): Promise<Product[]> {
    try {
      const url = `${GOOGLE_SCRIPT_URL}?method=getAllProducts&_=${Date.now()}`;
      const result = await makeRequest(url);
      
      if (result.status === 'success' && Array.isArray(result.data)) {
        return result.data;
      }
      
      console.warn('Unexpected products response:', result);
      return [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async addProduct(product: Product): Promise<{ status: string; message: string }> {
    try {
      const formData = new URLSearchParams();
      formData.append('method', 'addProduct');
      formData.append('data', JSON.stringify(product));

      const result = await makeRequest(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData
      });

      return result;
    } catch (error) {
      console.error('Error adding product:', error);
      throw new Error('Failed to add product');
    }
  }

  async updateProduct(product: Product): Promise<{ status: string; message: string }> {
    try {
      const formData = new URLSearchParams();
      formData.append('method', 'updateProduct');
      formData.append('data', JSON.stringify(product));

      const result = await makeRequest(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData
      });

      return result;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  async deleteProduct(productId: string): Promise<{ status: string; message: string }> {
    try {
      const formData = new URLSearchParams();
      formData.append('method', 'deleteProduct');
      formData.append('data', JSON.stringify({ productId }));

      const result = await makeRequest(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData
      });

      return result;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }

  async getAllBills(): Promise<Bill[]> {
    try {
      const url = `${GOOGLE_SCRIPT_URL}?method=getAllBills&_=${Date.now()}`;
      const result = await makeRequest(url);
      
      if (result.status === 'success' && Array.isArray(result.data)) {
        return result.data;
      }
      
      console.warn('Unexpected bills response:', result);
      return [];
    } catch (error) {
      console.error('Error fetching bills:', error);
      return [];
    }
  }

  async addBill(bill: Omit<Bill, 'Date' | 'Total Amount'>): Promise<{ status: string; message: string }> {
    try {
      const formData = new URLSearchParams();
      formData.append('method', 'addBill');
      formData.append('data', JSON.stringify(bill));

      const result = await makeRequest(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData
      });

      return result;
    } catch (error) {
      console.error('Error adding bill:', error);
      throw new Error('Failed to add bill');
    }
  }

  async deleteBill(billNo: string): Promise<{ status: string; message: string }> {
    try {
      const formData = new URLSearchParams();
      formData.append('method', 'deleteBill');
      formData.append('data', JSON.stringify({ billNo }));

      const result = await makeRequest(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData
      });

      return result;
    } catch (error) {
      console.error('Error deleting bill:', error);
      throw new Error('Failed to delete bill');
    }
  }

  async getAllCustomers(): Promise<Customer[]> {
    try {
      const url = `${GOOGLE_SCRIPT_URL}?method=getAllCustomers&_=${Date.now()}`;
      const result = await makeRequest(url);
      
      if (result.status === 'success' && Array.isArray(result.data)) {
        return result.data;
      }
      
      console.warn('Unexpected customers response:', result);
      return [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }

  async addCustomer(customer: Customer): Promise<{ status: string; message: string }> {
    try {
      const formData = new URLSearchParams();
      formData.append('method', 'addCustomer');
      formData.append('data', JSON.stringify(customer));

      const result = await makeRequest(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData
      });

      return result;
    } catch (error) {
      console.error('Error adding customer:', error);
      throw new Error('Failed to add customer');
    }
  }

  async getAllInventory(): Promise<InventoryItem[]> {
    try {
      const url = `${GOOGLE_SCRIPT_URL}?method=getAllInventory&_=${Date.now()}`;
      const result = await makeRequest(url);
      
      if (result.status === 'success' && Array.isArray(result.data)) {
        return result.data;
      }
      
      console.warn('Unexpected inventory response:', result);
      return [];
    } catch (error) {
      console.error('Error fetching inventory:', error);
      return [];
    }
  }

  async updateInventory(item: InventoryItem): Promise<{ status: string; message: string }> {
    try {
      const formData = new URLSearchParams();
      formData.append('method', 'updateInventory');
      formData.append('data', JSON.stringify(item));

      const result = await makeRequest(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData
      });

      return result;
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
      const url = `${GOOGLE_SCRIPT_URL}?method=getDashboardStats&_=${Date.now()}`;
      const result = await makeRequest(url);
      
      if (result.status === 'success' && result.data) {
        return result.data;
      }
      
      console.warn('Unexpected dashboard stats response:', result);
      return {
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

  async insertMockData(): Promise<{ status: string; message: string }> {
    try {
      const url = `${GOOGLE_SCRIPT_URL}?method=insertMockData&_=${Date.now()}`;
      const result = await makeRequest(url);
      return result;
    } catch (error) {
      console.error('Error inserting mock data:', error);
      throw new Error('Failed to insert mock data');
    }
  }
}

export const googleSheetsApi = new GoogleSheetsApi();
