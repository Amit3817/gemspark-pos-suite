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

class GoogleSheetsApi {
  private baseUrl = 'https://script.google.com/macros/s/AKfycbyEzsxLZDOIqnJSLnrQpQQF2Ms-Vw9WqULtCPmqYJ4yjTHYcqM3xCLP72YFT3UqBNj3/exec';

  async getAllProducts(): Promise<Product[]> {
    try {
      console.log('Fetching products from:', this.baseUrl);
      const response = await fetch(`${this.baseUrl}?method=getAllProducts`);
      const data = await response.json();
      console.log('Fetched products:', data);
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  async addProduct(product: Product): Promise<{ status: string; message: string }> {
    try {
      console.log('Adding product:', product);
      const response = await fetch(`${this.baseUrl}?method=addProduct`, {
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
      const response = await fetch(`${this.baseUrl}?method=updateProduct`, {
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
      const response = await fetch(`${this.baseUrl}?method=deleteProduct`, {
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
      console.log('Fetching bills from:', this.baseUrl);
      const response = await fetch(`${this.baseUrl}?method=getAllBills`);
      const data = await response.json();
      console.log('Fetched bills:', data);
      return data;
    } catch (error) {
      console.error('Error fetching bills:', error);
      throw new Error('Failed to fetch bills');
    }
  }

  async addBill(bill: Omit<Bill, 'Date' | 'Total Amount'>): Promise<{ status: string; message: string }> {
    try {
      console.log('Adding bill:', bill);
      const response = await fetch(`${this.baseUrl}?method=addBill`, {
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
      const response = await fetch(`${this.baseUrl}?method=deleteBill`, {
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
}

export const googleSheetsApi = new GoogleSheetsApi();
