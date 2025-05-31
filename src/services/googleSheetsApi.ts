
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEzsxLZDOIqnJSLnrQpQQQF2Ms-Vw9WqULtCPmqYJ4yjTHYcqM3xCLP72YFT3UqBNj3/exec';

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
      console.log('Full request URL:', `${GOOGLE_SCRIPT_URL}?method=getAllProducts`);
      
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?method=getAllProducts`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
      
      const textResponse = await response.text();
      console.log('Raw response text:', textResponse);
      
      let data;
      try {
        data = JSON.parse(textResponse);
        console.log('Parsed JSON data:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response was not valid JSON:', textResponse);
        throw new Error('Invalid JSON response from Google Script');
      }
      
      console.log('Successfully fetched products:', data.length, 'items');
      return data;
    } catch (error) {
      console.error('=== ERROR FETCHING PRODUCTS ===');
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error details:', error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('This appears to be a network/CORS error');
      }
      
      // Provide fallback data for development
      const fallbackData: Product[] = [
        {
          "Product ID": "DEMO001",
          "Product Name": "Demo Gold Ring",
          "Category": "Rings",
          "Carat": "18K",
          "Weight (g)": 5.2,
          "Quantity": 10,
          "Rate per g": 5500,
          "Metal Type": "Gold"
        },
        {
          "Product ID": "DEMO002",
          "Product Name": "Demo Silver Necklace",
          "Category": "Necklaces",
          "Carat": "925",
          "Weight (g)": 15.8,
          "Quantity": 5,
          "Rate per g": 80,
          "Metal Type": "Silver"
        }
      ];
      
      console.log('Using fallback data due to API error');
      return fallbackData;
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
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched bills:', data);
      return data;
    } catch (error) {
      console.error('Error fetching bills:', error);
      // Return empty array as fallback for bills
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

  // Placeholder methods for other functionality - these will return mock data until implemented in Google Script
  async getAllCustomers(): Promise<Customer[]> {
    console.log('getAllCustomers not implemented in Google Script yet');
    return [];
  }

  async addCustomer(customer: Customer): Promise<{ status: string; message: string }> {
    console.log('addCustomer not implemented in Google Script yet');
    return { status: 'error', message: 'Not implemented in Google Script yet' };
  }

  async getAllInventory(): Promise<InventoryItem[]> {
    console.log('getAllInventory not implemented in Google Script yet');
    return [];
  }

  async updateInventory(item: InventoryItem): Promise<{ status: string; message: string }> {
    console.log('updateInventory not implemented in Google Script yet');
    return { status: 'error', message: 'Not implemented in Google Script yet' };
  }

  async getDashboardStats(): Promise<{
    totalSales: number;
    totalProducts: number;
    totalCustomers: number;
    lowStockItems: number;
    recentSales: Bill[];
    topProducts: Product[];
  }> {
    console.log('getDashboardStats not implemented in Google Script yet');
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

export const googleSheetsApi = new GoogleSheetsApi();
