import { supabase } from '@/integrations/supabase/client';

// Types matching your existing interfaces
export interface Product {
  "Product ID": string;
  "Product Name": string;
  "Category": string;
  "Carat": string;
  "Weight (g)": number;
  "Quantity": number;
  "Metal Type": string;
  "Notes": string;
  "Image URL": string;
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
  "Metal Type": row.metal_type || '',
  "Notes": row.notes || '',
  "Image URL": row.image_url || ''
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
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        product_id,
        product_name,
        category,
        carat,
        weight_g,
        quantity,
        metal_type,
        notes,
        image_url,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(transformProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const addProduct = async (product: Product) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        product_id: product["Product ID"],
        product_name: product["Product Name"],
        category: product.Category,
        carat: product.Carat,
        weight_g: product["Weight (g)"],
        quantity: product.Quantity,
        metal_type: product["Metal Type"],
        notes: product.Notes,
        image_url: product["Image URL"]
      }])
      .select()
      .single();

    if (error) throw error;
    return { status: 'success', data: transformProduct(data) };
  } catch (error) {
    console.error('Error adding product:', error);
    return { status: 'error', message: error.message };
  }
};

export const updateProduct = async (product: Product) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        product_name: product["Product Name"],
        category: product.Category,
        carat: product.Carat,
        weight_g: product["Weight (g)"],
        quantity: product.Quantity,
        metal_type: product["Metal Type"],
        notes: product.Notes,
        image_url: product["Image URL"]
      })
      .eq('product_id', product["Product ID"])
      .select()
      .single();

    if (error) throw error;
    return { status: 'success', data: transformProduct(data) };
  } catch (error) {
    console.error('Error updating product:', error);
    return { status: 'error', message: error.message };
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('product_id', productId);

    if (error) throw error;
    return { status: 'success' };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { status: 'error', message: error.message };
  }
};

// Customer operations
export const getAllCustomers = async (): Promise<Customer[]> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select(`
        customer_id,
        name,
        phone,
        email,
        status,
        total_purchases,
        last_visit,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(transformCustomer);
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const addCustomer = async (customer: Customer) => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert([{
        customer_id: customer["Customer ID"],
        name: customer.Name,
        phone: customer.Phone,
        email: customer.Email,
        status: customer.Status,
        total_purchases: customer["Total Purchases"],
        last_visit: customer["Last Visit"]
      }])
      .select()
      .single();

    if (error) throw error;
    return { status: 'success', data: transformCustomer(data) };
  } catch (error) {
    console.error('Error adding customer:', error);
    return { status: 'error', message: error.message };
  }
};

// Bill operations
export const getAllBills = async (): Promise<Bill[]> => {
  try {
    const { data, error } = await supabase
      .from('bills')
      .select(`
        bill_no,
        date,
        customer_name,
        phone_number,
        product_id,
        product_name,
        metal_type,
        carat,
        weight_g,
        rate_per_g,
        making_charges,
        making_charges_percent,
        gst_percent,
        gold_price_per_10g,
        silver_price_per_10g,
        total_amount,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(transformBill);
  } catch (error) {
    console.error('Error fetching bills:', error);
    throw error;
  }
};

export const addBill = async (bill: Omit<Bill, 'Date' | 'Total Amount'>) => {
  try {
    const { data, error } = await supabase
      .from('bills')
      .insert([{
        bill_no: bill["Bill No"],
        customer_name: bill["Customer Name"],
        phone_number: bill["Phone Number"],
        product_id: bill["Product ID"],
        product_name: bill["Product Name"],
        metal_type: bill["Metal Type"],
        carat: bill.Carat,
        weight_g: bill["Weight (g)"],
        rate_per_g: bill["Rate per g"],
        making_charges: bill["Making Charges"],
        making_charges_percent: bill["Making Charges Percent"],
        gst_percent: bill["GST (%)"],
        gold_price_per_10g: bill["Gold Price per 10g"],
        silver_price_per_10g: bill["Silver Price per 10g"],
        date: new Date().toISOString(),
        total_amount: calculateTotalAmount(bill)
      }])
      .select()
      .single();

    if (error) throw error;
    return { status: 'success', data: transformBill(data) };
  } catch (error) {
    console.error('Error adding bill:', error);
    return { status: 'error', message: error.message };
  }
};

export const deleteBill = async (billNo: string) => {
  try {
    const { error } = await supabase
      .from('bills')
      .delete()
      .eq('bill_no', billNo);

    if (error) throw error;
    return { status: 'success' };
  } catch (error) {
    console.error('Error deleting bill:', error);
    return { status: 'error', message: error.message };
  }
};

// Inventory operations
export const getAllInventory = async (): Promise<InventoryItem[]> => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select(`
        product_id,
        product_name,
        category,
        current_stock,
        minimum_stock,
        last_updated,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(transformInventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

export const updateInventory = async (item: InventoryItem) => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .update(item)
      .eq('id', item.id)
      .select()
      .single();

    if (error) throw error;
    return { status: 'success', data };
  } catch (error) {
    console.error('Error updating inventory:', error);
    return { status: 'error', message: error.message };
  }
};

// Helper function to calculate total amount
const calculateTotalAmount = (bill: Omit<Bill, 'Date' | 'Total Amount'>): number => {
  const baseAmount = bill["Weight (g)"] * bill["Rate per g"];
  const makingCharges = baseAmount * (bill["Making Charges Percent"] / 100);
  const subtotal = baseAmount + makingCharges;
  const gstAmount = subtotal * (bill["GST (%)"] / 100);
  return Math.round((subtotal + gstAmount) * 100) / 100;
};

// Export the API functions
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
