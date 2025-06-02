
// Jewelry Management System - Google Apps Script
// This script handles all API endpoints for the jewelry management system

// Configuration - Update these with your actual Google Sheets IDs
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your Google Sheets ID
const PRODUCTS_SHEET_NAME = 'Products';
const BILLS_SHEET_NAME = 'Bills';
const CUSTOMERS_SHEET_NAME = 'Customers';
const INVENTORY_SHEET_NAME = 'Inventory';

// Main function that handles all incoming requests
function doGet(e) {
  const method = e.parameter.method;
  
  try {
    switch (method) {
      case 'getAllProducts':
        return getAllProducts();
      case 'getAllBills':
        return getAllBills();
      case 'getAllCustomers':
        return getAllCustomers();
      case 'getAllInventory':
        return getAllInventory();
      case 'getDashboardStats':
        return getDashboardStats();
      default:
        return createResponse('error', 'Invalid method', null);
    }
  } catch (error) {
    console.error('Error in doGet:', error);
    return createResponse('error', error.toString(), null);
  }
}

function doPost(e) {
  const method = e.parameter.method;
  const data = JSON.parse(e.postData.contents);
  
  try {
    switch (method) {
      case 'addProduct':
        return addProduct(data);
      case 'updateProduct':
        return updateProduct(data);
      case 'deleteProduct':
        return deleteProduct(data);
      case 'addBill':
        return addBill(data);
      case 'deleteBill':
        return deleteBill(data);
      case 'addCustomer':
        return addCustomer(data);
      case 'updateInventory':
        return updateInventory(data);
      default:
        return createResponse('error', 'Invalid method', null);
    }
  } catch (error) {
    console.error('Error in doPost:', error);
    return createResponse('error', error.toString(), null);
  }
}

// Helper function to create standardized responses
function createResponse(status, message, data) {
  const response = {
    status: status,
    message: message,
    data: data
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(data || response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Product Functions
function getAllProducts() {
  console.log('Getting all products');
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(PRODUCTS_SHEET_NAME);
  
  if (!sheet) {
    console.error('Products sheet not found');
    return createResponse('error', 'Products sheet not found', []);
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    console.log('No product data found');
    return createResponse('success', 'No products found', []);
  }
  
  const headers = data[0];
  const products = [];
  
  for (let i = 1; i < data.length; i++) {
    const product = {};
    for (let j = 0; j < headers.length; j++) {
      product[headers[j]] = data[i][j];
    }
    products.push(product);
  }
  
  console.log('Found products:', products.length);
  return createResponse('success', 'Products retrieved successfully', products);
}

function addProduct(productData) {
  console.log('Adding product:', productData);
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(PRODUCTS_SHEET_NAME);
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = headers.map(header => productData[header] || '');
  
  sheet.appendRow(newRow);
  
  return createResponse('success', 'Product added successfully', null);
}

function updateProduct(productData) {
  console.log('Updating product:', productData);
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(PRODUCTS_SHEET_NAME);
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const productIdIndex = headers.indexOf('Product ID');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][productIdIndex] === productData['Product ID']) {
      for (let j = 0; j < headers.length; j++) {
        if (productData[headers[j]] !== undefined) {
          sheet.getRange(i + 1, j + 1).setValue(productData[headers[j]]);
        }
      }
      break;
    }
  }
  
  return createResponse('success', 'Product updated successfully', null);
}

function deleteProduct(data) {
  console.log('Deleting product:', data.productId);
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(PRODUCTS_SHEET_NAME);
  
  const dataRange = sheet.getDataRange().getValues();
  const headers = dataRange[0];
  const productIdIndex = headers.indexOf('Product ID');
  
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][productIdIndex] === data.productId) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
  
  return createResponse('success', 'Product deleted successfully', null);
}

// Bill Functions
function getAllBills() {
  console.log('Getting all bills');
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(BILLS_SHEET_NAME);
  
  if (!sheet) {
    console.error('Bills sheet not found');
    return createResponse('error', 'Bills sheet not found', []);
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    console.log('No bill data found');
    return createResponse('success', 'No bills found', []);
  }
  
  const headers = data[0];
  const bills = [];
  
  for (let i = 1; i < data.length; i++) {
    const bill = {};
    for (let j = 0; j < headers.length; j++) {
      bill[headers[j]] = data[i][j];
    }
    bills.push(bill);
  }
  
  console.log('Found bills:', bills.length);
  return createResponse('success', 'Bills retrieved successfully', bills);
}

function addBill(billData) {
  console.log('Adding bill:', billData);
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(BILLS_SHEET_NAME);
  
  // Add current date and calculate total amount
  billData['Date'] = new Date().toISOString().split('T')[0];
  
  // Calculate total amount
  const weight = parseFloat(billData['Weight (g)']) || 0;
  const ratePerG = parseFloat(billData['Rate per g']) || 0;
  const makingCharges = parseFloat(billData['Making Charges']) || 0;
  const gstPercent = parseFloat(billData['GST (%)']) || 0;
  
  const baseAmount = weight * ratePerG;
  const totalBeforeGST = baseAmount + makingCharges;
  const gstAmount = (totalBeforeGST * gstPercent) / 100;
  const totalAmount = totalBeforeGST + gstAmount;
  
  billData['Total Amount'] = Math.round(totalAmount);
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = headers.map(header => billData[header] || '');
  
  sheet.appendRow(newRow);
  
  return createResponse('success', 'Bill added successfully', null);
}

function deleteBill(data) {
  console.log('Deleting bill:', data.billNo);
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(BILLS_SHEET_NAME);
  
  const dataRange = sheet.getDataRange().getValues();
  const headers = dataRange[0];
  const billNoIndex = headers.indexOf('Bill No');
  
  for (let i = 1; i < dataRange.length; i++) {
    if (dataRange[i][billNoIndex] === data.billNo) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
  
  return createResponse('success', 'Bill deleted successfully', null);
}

// Customer Functions
function getAllCustomers() {
  console.log('Getting all customers');
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(CUSTOMERS_SHEET_NAME);
  
  if (!sheet) {
    console.error('Customers sheet not found');
    return createResponse('error', 'Customers sheet not found', []);
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    console.log('No customer data found');
    return createResponse('success', 'No customers found', []);
  }
  
  const headers = data[0];
  const customers = [];
  
  for (let i = 1; i < data.length; i++) {
    const customer = {};
    for (let j = 0; j < headers.length; j++) {
      customer[headers[j]] = data[i][j];
    }
    customers.push(customer);
  }
  
  console.log('Found customers:', customers.length);
  return createResponse('success', 'Customers retrieved successfully', customers);
}

function addCustomer(customerData) {
  console.log('Adding customer:', customerData);
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(CUSTOMERS_SHEET_NAME);
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const newRow = headers.map(header => customerData[header] || '');
  
  sheet.appendRow(newRow);
  
  return createResponse('success', 'Customer added successfully', null);
}

// Inventory Functions
function getAllInventory() {
  console.log('Getting all inventory');
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(INVENTORY_SHEET_NAME);
  
  if (!sheet) {
    console.error('Inventory sheet not found');
    return createResponse('error', 'Inventory sheet not found', []);
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    console.log('No inventory data found');
    return createResponse('success', 'No inventory found', []);
  }
  
  const headers = data[0];
  const inventory = [];
  
  for (let i = 1; i < data.length; i++) {
    const item = {};
    for (let j = 0; j < headers.length; j++) {
      item[headers[j]] = data[i][j];
    }
    inventory.push(item);
  }
  
  console.log('Found inventory items:', inventory.length);
  return createResponse('success', 'Inventory retrieved successfully', inventory);
}

function updateInventory(itemData) {
  console.log('Updating inventory item:', itemData);
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(INVENTORY_SHEET_NAME);
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const itemIdIndex = headers.indexOf('Item ID');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][itemIdIndex] === itemData['Item ID']) {
      for (let j = 0; j < headers.length; j++) {
        if (itemData[headers[j]] !== undefined) {
          sheet.getRange(i + 1, j + 1).setValue(itemData[headers[j]]);
        }
      }
      break;
    }
  }
  
  return createResponse('success', 'Inventory updated successfully', null);
}

// Dashboard Stats Function
function getDashboardStats() {
  console.log('Getting dashboard stats');
  
  const productsSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(PRODUCTS_SHEET_NAME);
  const billsSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(BILLS_SHEET_NAME);
  const customersSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(CUSTOMERS_SHEET_NAME);
  
  const stats = {
    totalSales: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStockItems: 0,
    recentSales: [],
    topProducts: []
  };
  
  // Get product stats
  if (productsSheet) {
    const productData = productsSheet.getDataRange().getValues();
    stats.totalProducts = Math.max(0, productData.length - 1);
    
    // Count low stock items (quantity <= 5)
    if (productData.length > 1) {
      const headers = productData[0];
      const quantityIndex = headers.indexOf('Quantity');
      for (let i = 1; i < productData.length; i++) {
        if (productData[i][quantityIndex] <= 5) {
          stats.lowStockItems++;
        }
      }
    }
  }
  
  // Get bill stats
  if (billsSheet) {
    const billData = billsSheet.getDataRange().getValues();
    if (billData.length > 1) {
      const headers = billData[0];
      const totalAmountIndex = headers.indexOf('Total Amount');
      
      for (let i = 1; i < billData.length; i++) {
        stats.totalSales += parseFloat(billData[i][totalAmountIndex]) || 0;
      }
      
      // Get recent sales (last 3)
      const recentBills = billData.slice(-4, -1); // Get last 3 bills (excluding header)
      stats.recentSales = recentBills.map(row => {
        const bill = {};
        for (let j = 0; j < headers.length; j++) {
          bill[headers[j]] = row[j];
        }
        return bill;
      });
    }
  }
  
  // Get customer stats
  if (customersSheet) {
    const customerData = customersSheet.getDataRange().getValues();
    stats.totalCustomers = Math.max(0, customerData.length - 1);
  }
  
  console.log('Dashboard stats:', stats);
  return createResponse('success', 'Dashboard stats retrieved successfully', stats);
}

// Handle CORS preflight requests
function doOptions() {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
