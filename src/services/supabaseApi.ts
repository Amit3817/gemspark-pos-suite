
import { supabase } from '@/integrations/supabase/client';

// Types matching your existing interfaces
export interface Product {
  "Product ID": string;
  "Product Name": string;
  "Category": string;
  "Carat": string;
  "Weight (g)": number;
  "Quantity": number;
  "Rate per g": number;
  "Metal Type": string;
  "Notes": string;
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
  "Making Charges Percent": number;
  "GST (%)": number;
  "Gold Price per 10g": number;
  "Silver Price per 10g": number;
  "Total Amount": number;
}

export interface Customer {
  "Customer ID": string;
  "Name": string;
  "Phone": string;
  "Email": string;
  "Status": string;
  "Total Purchases": number;
  "Last Visit": string;
}

export interface InventoryItem {
  "Product ID": string;
  "Product Name": string;
  "Category": string;
  "Current Stock": number;
  "Minimum Stock": number;
  "Last Updated": string;
}

// Transform database row to match existing interface
const transformProduct = (row: any): Product => ({
  "Product ID": row.product_id,
  "Product Name": row.product_name,
  "Category": row.category,
  "Carat": row.carat || '',
  "Weight (g)": parseFloat(row.weight_g) || 0,
  "Quantity": row.quantity || 0,
  "Rate per g": parseFloat(row.rate_per_g) || 0,
  "Metal Type": row.metal_type || '',
  "Notes": row.notes || ''
});

const transformCustomer = (row: any): Customer => ({
  "Customer ID": row.customer_id,
  "Name": row.name,
  "Phone": row.phone || '',
  "Email": row.email || '',
  "Status": row.status || 'New',
  "Total Purchases": parseFloat(row.total_purchases) || 0,
  "Last Visit": row.last_visit || ''
});

const transformBill = (row: any): Bill => ({
  "Bill No": row.bill_no,
  "Date": row.date,
  "Customer Name": row.customer_name,
  "Phone Number": row.phone_number || '',
  "Product ID": row.product_id || '',
  "Product Name": row.product_name || '',
  "Metal Type": row.metal_type || '',
  "Carat": row.carat || '',
  "Weight (g)": parseFloat(row.weight_g) || 0,
  "Rate per g": parseFloat(row.rate_per_g) || 0,
  "Making Charges": parseFloat(row.making_charges) || 0,
  "Making Charges Percent": parseFloat(row.making_charges_percent) || 0,
  "GST (%)": parseFloat(row.gst_percent) || 0,
  "Gold Price per 10g": parseFloat(row.gold_price_per_10g) || 0,
  "Silver Price per 10g": parseFloat(row.silver_price_per_10g) || 0,
  "Total Amount": parseFloat(row.total_amount) || 0
});

const transformInventory = (row: any): InventoryItem => ({
  "Product ID": row.product_id,
  "Product Name": row.product_name,
  "Category": row.category || '',
  "Current Stock": row.current_stock || 0,
  "Minimum Stock": row.minimum_stock || 5,
  "Last Updated": row.last_updated
});

// Product operations
export const getAllProducts = async (): Promise<Product[]> => {
  console.log('Fetching products from Supabase...');
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  console.log('Raw products data:', data);
  return data?.map(transformProduct) || [];
};

export const addProduct = async (product: Product) => {
  console.log('Adding product to Supabase:', product);
  const { error } = await supabase
    .from('products')
    .insert({
      product_id: product["Product ID"],
      product_name: product["Product Name"],
      category: product["Category"],
      carat: product["Carat"],
      weight_g: product["Weight (g)"],
      quantity: product["Quantity"],
      rate_per_g: product["Rate per g"],
      metal_type: product["Metal Type"],
      notes: product["Notes"]
    });

  if (error) {
    console.error('Error adding product:', error);
    return { status: 'error', message: error.message };
  }

  return { status: 'success', message: 'Product added successfully' };
};

export const updateProduct = async (product: Product) => {
  console.log('Updating product in Supabase:', product);
  const { error } = await supabase
    .from('products')
    .update({
      product_name: product["Product Name"],
      category: product["Category"],
      carat: product["Carat"],
      weight_g: product["Weight (g)"],
      quantity: product["Quantity"],
      rate_per_g: product["Rate per g"],
      metal_type: product["Metal Type"],
      notes: product["Notes"]
    })
    .eq('product_id', product["Product ID"]);

  if (error) {
    console.error('Error updating product:', error);
    return { status: 'error', message: error.message };
  }

  return { status: 'success', message: 'Product updated successfully' };
};

export const deleteProduct = async (productId: string) => {
  console.log('Deleting product from Supabase:', productId);
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('product_id', productId);

  if (error) {
    console.error('Error deleting product:', error);
    return { status: 'error', message: error.message };
  }

  return { status: 'success', message: 'Product deleted successfully' };
};

// Customer operations
export const getAllCustomers = async (): Promise<Customer[]> => {
  console.log('Fetching customers from Supabase...');
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }

  console.log('Raw customers data:', data);
  return data?.map(transformCustomer) || [];
};

export const addCustomer = async (customer: Customer) => {
  console.log('Adding customer to Supabase:', customer);
  const { error } = await supabase
    .from('customers')
    .insert({
      customer_id: customer["Customer ID"],
      name: customer["Name"],
      phone: customer["Phone"],
      email: customer["Email"],
      status: customer["Status"],
      total_purchases: customer["Total Purchases"],
      last_visit: customer["Last Visit"]
    });

  if (error) {
    console.error('Error adding customer:', error);
    return { status: 'error', message: error.message };
  }

  return { status: 'success', message: 'Customer added successfully' };
};

// Bill operations
export const getAllBills = async (): Promise<Bill[]> => {
  console.log('Fetching bills from Supabase...');
  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bills:', error);
    throw error;
  }

  console.log('Raw bills data:', data);
  return data?.map(transformBill) || [];
};

export const addBill = async (bill: Omit<Bill, 'Date' | 'Total Amount'>) => {
  console.log('Adding bill to Supabase:', bill);
  
  // Calculate total amount
  const baseAmount = (bill["Weight (g)"] || 0) * (bill["Rate per g"] || 0);
  const makingCharges = bill["Making Charges"] || 0;
  const gstAmount = (baseAmount + makingCharges) * ((bill["GST (%)"] || 0) / 100);
  const totalAmount = baseAmount + makingCharges + gstAmount;

  const { error } = await supabase
    .from('bills')
    .insert({
      bill_no: bill["Bill No"],
      customer_name: bill["Customer Name"],
      phone_number: bill["Phone Number"],
      product_id: bill["Product ID"],
      product_name: bill["Product Name"],
      metal_type: bill["Metal Type"],
      carat: bill["Carat"],
      weight_g: bill["Weight (g)"],
      rate_per_g: bill["Rate per g"],
      making_charges: bill["Making Charges"],
      making_charges_percent: bill["Making Charges Percent"],
      gst_percent: bill["GST (%)"],
      gold_price_per_10g: bill["Gold Price per 10g"],
      silver_price_per_10g: bill["Silver Price per 10g"],
      total_amount: totalAmount
    });

  if (error) {
    console.error('Error adding bill:', error);
    return { status: 'error', message: error.message };
  }

  return { status: 'success', message: 'Bill added successfully' };
};

export const deleteBill = async (billNo: string) => {
  console.log('Deleting bill from Supabase:', billNo);
  const { error } = await supabase
    .from('bills')
    .delete()
    .eq('bill_no', billNo);

  if (error) {
    console.error('Error deleting bill:', error);
    return { status: 'error', message: error.message };
  }

  return { status: 'success', message: 'Bill deleted successfully' };
};

// Inventory operations
export const getAllInventory = async (): Promise<InventoryItem[]> => {
  console.log('Fetching inventory from Supabase...');
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }

  console.log('Raw inventory data:', data);
  return data?.map(transformInventory) || [];
};

export const updateInventory = async (item: InventoryItem) => {
  console.log('Updating inventory in Supabase:', item);
  const { error } = await supabase
    .from('inventory')
    .upsert({
      product_id: item["Product ID"],
      product_name: item["Product Name"],
      category: item["Category"],
      current_stock: item["Current Stock"],
      minimum_stock: item["Minimum Stock"]
    }, {
      onConflict: 'product_id'
    });

  if (error) {
    console.error('Error updating inventory:', error);
    return { status: 'error', message: error.message };
  }

  return { status: 'success', message: 'Inventory updated successfully' };
};

// Export as supabaseApi to replace googleSheetsApi
export const supabaseApi = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllCustomers,
  addCustomer,
  getAllBills,
  addBill,
  deleteBill,
  getAllInventory,
  updateInventory
};
