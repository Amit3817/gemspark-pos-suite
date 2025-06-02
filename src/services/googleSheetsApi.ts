
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
      console.log('=== FETCHING PRODUCTS ===');
      console.log('Google Script URL:', GOOGLE_SCRIPT_URL);
      
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?method=getAllProducts`, {
        method: 'GET',
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Successfully fetched products:', data.length, 'items');
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async addProduct(product: Product): Promise<{ status: string; message: string }> {
    try {
      console.log('Adding product:', product);
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?method=addProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      console.log('Added product response:', data);
      return data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw new Error('Failed to add product');
    }
  }

  async updateProduct(product: Product): Promise<{ status: string; message: string }> {
    try {
      console.log('Updating product:', product);
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?method=updateProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      console.log('Updated product response:', data);
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  async deleteProduct(productId: string): Promise<{ status: string; message: string }> {
    try {
      console.log('Deleting product:', productId);
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?method=deleteProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      console.log('Deleted product response:', data);
      return data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }

  async getAllBills(): Promise<Bill[]> {
    try {
      console.log('Fetching bills from:', GOOGLE_SCRIPT_URL);
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?method=getAllBills`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched bills:', data);
      return data;
    } catch (error) {
      console.error('Error fetching bills:', error);
      return [];
    }
  }

  async addBill(bill: Omit<Bill, 'Date' | 'Total Amount'>): Promise<{ status: string; message: string }> {
    try {
      console.log('Adding bill:', bill);
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?method=addBill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bill),
      });
      const data = await response.json();
      console.log('Added bill response:', data);
      return data;
    } catch (error) {
      console.error('Error adding bill:', error);
      throw new Error('Failed to add bill');
    }
  }

  async deleteBill(billNo: string): Promise<{ status: string; message: string }> {
    try {
      console.log('Deleting bill:', billNo);
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?method=deleteBill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ billNo }),
      });
      const data = await response.json();
      console.log('Deleted bill response:', data);
      return data;
    } catch (error) {
      console.error('Error deleting bill:', error);
      throw new Error('Failed to delete bill');
    }
  }

  async getAllCustomers(): Promise<Customer[]> {
    try {
      console.log('Fetching customers from:', GOOGLE_SCRIPT_URL);
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?method=getAllCustomers`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched customers:', data);
      return data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  }

  async addCustomer(customer: Customer): Promise<{ status: string; message: string }> {
    try {
      console.log('Adding customer:', customer);
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?method=addCustomer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      });
      const data = await response.json();
      console.log('Added customer response:', data);
      return data;
    } catch (error) {
      console.error('Error adding customer:', error);
      throw new Error('Failed to add customer');
    }
  }

  async getAllInventory(): Promise<InventoryItem[]> {
    try {
      console.log('Fetching inventory from:', GOOGLE_SCRIPT_URL);
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?method=getAllInventory`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched inventory:', data);
      return data;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      return [];
    }
  }

  async updateInventory(item: InventoryItem): Promise<{ status: string; message: string }> {
    try {
      console.log('Updating inventory:', item);
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?method=updateInventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      const data = await response.json();
      console.log('Updated inventory response:', data);
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
      console.log('Fetching dashboard stats from:', GOOGLE_SCRIPT_URL);
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?method=getDashboardStats`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched dashboard stats:', data);
      return data;
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
