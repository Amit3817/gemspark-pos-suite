import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, Trash2, Plus, Minus, Printer, Send, Search, Share2, UserPlus, AlertCircle, Info, IndianRupee, Receipt, MessageSquare, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WhatsAppIntegration } from "./WhatsAppIntegration";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProductBrowser } from "@/components/ProductBrowser";

interface CartItem extends Product {
  cartQuantity: number;
  calculatedRate: number;
}

const BillingSystem = () => {
  const { t } = useLanguage();
  const { addBill, addCustomer, refreshData, bills, products, customers } = useAppContext();
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [goldPrice, setGoldPrice] = useState<string>("");
  const [silverPrice, setSilverPrice] = useState<string>("");
  const [makingChargesPercent, setMakingChargesPercent] = useState<number>(10);
  const [gstPercent, setGstPercent] = useState<number>(3);
  const [completedBill, setCompletedBill] = useState<Bill | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    weight: number;
    makingCharges: number;
    gst: number;
  }>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showProductBrowser, setShowProductBrowser] = useState(false);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    const savedData = localStorage.getItem('billingSystemData');
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart.map((item: CartItem) => ({
          ...item,
          calculatedRate: calculateRate(item)
        })));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setCustomerInfo(parsed.customerInfo || { name: "", phone: "", email: "" });
        setGoldPrice(parsed.goldPrice || "");
        setSilverPrice(parsed.silverPrice || "");
        setMakingChargesPercent(parsed.makingChargesPercent || 10);
      } catch (error) {
        console.error('Error loading saved billing data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      customerInfo,
      goldPrice,
      silverPrice,
      makingChargesPercent
    };
    localStorage.setItem('billingSystemData', JSON.stringify(dataToSave));
  }, [customerInfo, goldPrice, silverPrice, makingChargesPercent]);

  const calculateRate = (product: Product): number => {
    const metalType = product["Metal Type"]?.toLowerCase();
    const weight = product["Weight (g)"];
    const goldPriceNum = parseFloat(goldPrice) || 0;
    const silverPriceNum = parseFloat(silverPrice) || 0;
    
    if (metalType?.includes("gold") && goldPriceNum > 0) {
      return (goldPriceNum / 10) * weight;
    } else if (metalType?.includes("silver") && silverPriceNum > 0) {
      return (silverPriceNum / 10) * weight;
    }
    return 0;
  };

  const updateCartRates = () => {
    setCartItems(cartItems.map(item => ({
      ...item,
      calculatedRate: calculateRate(item)
    })));
  };

  React.useEffect(() => {
    if (cartItems.length > 0) {
      updateCartRates();
    }
  }, [goldPrice, silverPrice]);

  const removeFromCart = (productId: string) => {
    const newCartItems = cartItems.filter(item => item["Product ID"] !== productId);
    setCartItems(newCartItems);
    localStorage.setItem('cartItems', JSON.stringify(newCartItems));
    toast({
      title: t('billing.toast.removedFromCart'),
      description: t('billing.toast.itemRemoved'),
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      const newCartItems = cartItems.map(item =>
        item["Product ID"] === productId
          ? { ...item, cartQuantity: Math.min(quantity, item.Quantity) }
          : item
      );
      setCartItems(newCartItems);
      localStorage.setItem('cartItems', JSON.stringify(newCartItems));
    }
  };

  const goldPriceNum = parseFloat(goldPrice) || 0;
  const silverPriceNum = parseFloat(silverPrice) || 0;
  const hasGoldItems = cartItems.some(item => item["Metal Type"]?.toLowerCase().includes("gold"));
  const hasSilverItems = cartItems.some(item => item["Metal Type"]?.toLowerCase().includes("silver"));

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.calculatedRate * item.cartQuantity);
  }, 0);

  const makingCharges = (subtotal * makingChargesPercent) / 100;
  const gstAmount = (subtotal + makingCharges) * (gstPercent / 100);
  const total = subtotal + makingCharges + gstAmount;

  const generateBillPDF = async (billData: Bill): Promise<string> => {
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice - ${billData["Bill No"]}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: white;
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .company-name { 
              font-size: 28px; 
              font-weight: bold; 
              color: #333; 
              margin-bottom: 5px;
            }
            .invoice-title { 
              font-size: 20px; 
              color: #666; 
            }
            .details-section { 
              margin: 20px 0; 
              display: flex; 
              justify-content: space-between;
            }
            .details-left, .details-right { 
              width: 45%; 
            }
            .detail-row { 
              margin: 8px 0; 
              display: flex; 
              justify-content: space-between;
            }
            .label { 
              font-weight: bold; 
              color: #333; 
            }
            .value { 
              color: #666; 
            }
            .total-section { 
              margin-top: 30px; 
              border-top: 2px solid #333; 
              padding-top: 15px;
            }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              margin: 5px 0; 
              font-size: 18px; 
              font-weight: bold;
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              font-size: 12px; 
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">GemSpark Jewelry</div>
            <div class="invoice-title">INVOICE</div>
          </div>
          
          <div class="details-section">
            <div class="details-left">
              <div class="detail-row">
                <span class="label">Invoice No:</span>
                <span class="value">${billData["Bill No"]}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">${new Date(billData["Date"]).toLocaleDateString()}</span>
              </div>
            </div>
            <div class="details-right">
              <div class="detail-row">
                <span class="label">Customer:</span>
                <span class="value">${billData["Customer Name"]}</span>
              </div>
              <div class="detail-row">
                <span class="label">Phone:</span>
                <span class="value">${billData["Phone Number"]}</span>
              </div>
            </div>
          </div>

          <div class="details-section">
            <div class="details-left">
              <div class="detail-row">
                <span class="label">Product:</span>
                <span class="value">${billData["Product Name"]}</span>
              </div>
              <div class="detail-row">
                <span class="label">Metal Type:</span>
                <span class="value">${billData["Metal Type"]}</span>
              </div>
              <div class="detail-row">
                <span class="label">Carat:</span>
                <span class="value">${billData["Carat"]}</span>
              </div>
            </div>
            <div class="details-right">
              <div class="detail-row">
                <span class="label">Weight:</span>
                <span class="value">${billData["Weight (g)"]}g</span>
              </div>
              <div class="detail-row">
                <span class="label">Rate per gram:</span>
                <span class="value">₹${billData["Rate per g"]}</span>
              </div>
            </div>
          </div>

          <div class="total-section">
            <div class="detail-row">
              <span class="label">Making Charges:</span>
              <span class="value">₹${billData["Making Charges"]}</span>
            </div>
            <div class="detail-row">
              <span class="label">GST (${billData["GST (%)"]}%):</span>
              <span class="value">₹${((billData["Weight (g)"] * billData["Rate per g"] + billData["Making Charges"]) * billData["GST (%)"] / 100).toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>TOTAL AMOUNT:</span>
              <span>₹${billData["Total Amount"]}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>GemSpark Jewelry • Phone: +91 98765 43210 • Email: info@gemspark.com</p>
          </div>
        </body>
      </html>
    `;

    // Create a temporary window to generate PDF
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      throw new Error('Unable to open print window');
    }

    return new Promise((resolve, reject) => {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then convert to PDF
      printWindow.onload = () => {
        setTimeout(() => {
          try {
            // Use browser's print to PDF functionality
            printWindow.print();
            
            // Create a data URL representation
            const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
            
            // Close the print window
            printWindow.close();
            
            resolve(dataUrl);
          } catch (error) {
            printWindow.close();
            reject(error);
          }
        }, 1000);
      };
    });
  };

  const handleCompleteSale = async () => {
    setFormSubmitted(true);
    
    if (cartItems.length === 0) {
      toast({
        title: t('billing.toast.missingInfo'),
        description: t('billing.toast.fillRequiredDetails'),
        variant: "destructive",
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: t('billing.toast.missingInfo'),
        description: t('billing.toast.fillRequiredDetails'),
        variant: "destructive",
      });
      return;
    }

    if (hasGoldItems && goldPriceNum <= 0) {
      toast({
        title: t('billing.toast.missingInfo'),
        description: t('billing.toast.fillRequiredDetails'),
        variant: "destructive",
      });
      return;
    }

    if (hasSilverItems && silverPriceNum <= 0) {
      toast({
        title: t('billing.toast.missingInfo'),
        description: t('billing.toast.fillRequiredDetails'),
        variant: "destructive",
      });
      return;
    }

    try {
      // Create customer first
      const customerId = `CUST-${Date.now()}`;
      await addCustomer({
        "Customer ID": customerId,
        "Name": customerInfo.name,
        "Phone": customerInfo.phone,
        "Email": customerInfo.email,
        "Status": "New",
        "Total Purchases": total,
        "Last Visit": new Date().toISOString().split('T')[0]
      });

      // Create bills for each cart item
      let firstBill = null;
      for (const item of cartItems) {
        const billNo = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        
        const billData = {
          "Bill No": billNo,
          "Customer Name": customerInfo.name,
          "Phone Number": customerInfo.phone,
          "Product ID": item["Product ID"],
          "Product Name": item["Product Name"],
          "Metal Type": item["Metal Type"],
          "Carat": item.Carat,
          "Weight (g)": item["Weight (g)"] * item.cartQuantity,
          "Rate per g": item.calculatedRate / item["Weight (g)"],
          "Making Charges": makingCharges,
          "Making Charges Percent": makingChargesPercent,
          "GST (%)": gstPercent,
          "Gold Price per 10g": hasGoldItems ? goldPriceNum : 0,
          "Silver Price per 10g": hasSilverItems ? silverPriceNum : 0,
        };

        await addBill(billData);
        
        if (!firstBill) {
          // Create complete bill object with all required properties
          firstBill = {
            ...billData,
            "Date": new Date().toISOString(),
            "Total Amount": total
          } as Bill;
        }
      }

      // Set completed bill for WhatsApp integration and printing
      setCompletedBill(firstBill);
      
      // Clear cart immediately after successful bill creation
      setCartItems([]);
      localStorage.removeItem('cartItems');
      
      // Refresh data to update all lists
      await refreshData();
      
      toast({
        title: "Sale Completed",
        description: "Bills created successfully. You can now print or send via WhatsApp.",
      });
    } catch (error) {
      console.error('Error completing sale:', error);
      toast({
        title: t('billing.toast.error'),
        description: t('billing.toast.failedToComplete'),
        variant: "destructive",
      });
    }
  };

  const clearBillingData = () => {
    // Show confirmation dialog before clearing
    const shouldClear = window.confirm(t('billing.confirmClearData'));
    if (!shouldClear) return;

    setCustomerInfo({ name: "", phone: "", email: "" });
    setGoldPrice("");
    setSilverPrice("");
    setCompletedBill(null);
    setFormSubmitted(false);
    localStorage.removeItem('billingSystemData');
    
    toast({
      title: t('billing.toast.dataCleared'),
      description: t('billing.toast.readyForNewSale'),
    });
  };

  // Add this function to check if all required details are filled
  const canProceedWithSale = () => {
    return cartItems.length > 0 && 
           customerInfo.name && 
           customerInfo.phone && 
           customerInfo.phone.length >= 10 &&
           ((hasGoldItems && goldPriceNum > 0) || !hasGoldItems) &&
           ((hasSilverItems && silverPriceNum > 0) || !hasSilverItems);
  };

  // Add this new function for downloading invoice
  const handleDownloadInvoice = async () => {
    if (!canProceedWithSale()) {
      toast({
        title: t('billing.toast.missingInfo'),
        description: t('billing.toast.fillRequiredDetails'),
        variant: "destructive",
      });
      return;
    }

    // Show loading toast
    const loadingToast = toast({
      title: t('billing.toast.preparingInvoice'),
      description: t('billing.toast.generatingInvoice'),
    });

    try {
      // Create a temporary bill for invoice
      const tempBill = {
        "Bill No": `INV-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        "Date": new Date().toISOString(),
        "Customer Name": customerInfo.name,
        "Phone Number": customerInfo.phone,
        "Product ID": cartItems[0]["Product ID"],
        "Product Name": cartItems.map(item => 
          `${item["Product Name"]} (${t('billing.quantity')}: ${item.cartQuantity})`
        ).join(", "),
        "Metal Type": cartItems.map(item => 
          `${item["Metal Type"] || t('common.none')}`
        ).join(", "),
        "Carat": cartItems[0].Carat || t('common.none'),
        "Weight (g)": cartItems.reduce((sum, item) => sum + (item["Weight (g)"] * item.cartQuantity), 0),
        "Rate per g": cartItems[0].calculatedRate / cartItems[0]["Weight (g)"],
        "Making Charges": makingCharges,
        "Making Charges Percent": makingChargesPercent,
        "GST (%)": gstPercent,
        "Gold Price per 10g": hasGoldItems ? goldPriceNum : 0,
        "Silver Price per 10g": hasSilverItems ? silverPriceNum : 0,
        "Total Amount": total
      };

      // Create the invoice HTML content
      const invoiceHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${t('billing.details.title')} - ${tempBill["Bill No"]}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px; 
                background: white;
                line-height: 1.6;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px; 
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
              }
              .company-name { 
                font-size: 28px; 
                font-weight: bold; 
                color: #333; 
                margin-bottom: 5px;
              }
              .invoice-title { 
                font-size: 20px; 
                color: #666; 
              }
              .details-section { 
                margin: 20px 0; 
                display: flex; 
                justify-content: space-between;
              }
              .details-left, .details-right { 
                width: 45%; 
              }
              .detail-row { 
                margin: 8px 0; 
                display: flex; 
                justify-content: space-between;
              }
              .label { 
                font-weight: bold; 
                color: #333; 
              }
              .value { 
                color: #666; 
              }
              .items-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              .items-table th, .items-table td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              .items-table th {
                background-color: #f5f5f5;
              }
              .total-section { 
                margin-top: 30px; 
                border-top: 2px solid #333; 
                padding-top: 15px;
              }
              .total-row { 
                display: flex; 
                justify-content: space-between; 
                margin: 5px 0; 
                font-size: 18px; 
                font-weight: bold;
              }
              .footer { 
                text-align: center; 
                margin-top: 30px; 
                font-size: 12px; 
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="company-name">${t('company.name')}</div>
              <div class="invoice-title">${t('billing.details.title')}</div>
            </div>
            
            <div class="details-section">
              <div class="details-left">
                <div class="detail-row">
                  <span class="label">${t('bills.billId')}:</span>
                  <span class="value">${tempBill["Bill No"]}</span>
                </div>
                <div class="detail-row">
                  <span class="label">${t('bills.date')}:</span>
                  <span class="value">${new Date(tempBill["Date"]).toLocaleDateString()}</span>
                </div>
              </div>
              <div class="details-right">
                <div class="detail-row">
                  <span class="label">${t('bills.customerName')}:</span>
                  <span class="value">${tempBill["Customer Name"]}</span>
                </div>
                <div class="detail-row">
                  <span class="label">${t('bills.phone')}:</span>
                  <span class="value">${tempBill["Phone Number"]}</span>
                </div>
              </div>
            </div>

            <table class="items-table">
              <thead>
                <tr>
                  <th>${t('products.productName')}</th>
                  <th>${t('products.metalType')}</th>
                  <th>${t('products.weight')}</th>
                  <th>${t('products.quantity')}</th>
                  <th>${t('metalRates.perGram')}</th>
                  <th>${t('bills.amount')}</th>
                </tr>
              </thead>
              <tbody>
                ${cartItems.map(item => `
                  <tr>
                    <td>${item["Product Name"]}</td>
                    <td>${item["Metal Type"] || t('common.none')}</td>
                    <td>${item["Weight (g)"]}g</td>
                    <td>${item.cartQuantity}</td>
                    <td>₹${(item.calculatedRate / item["Weight (g)"]).toFixed(2)}</td>
                    <td>₹${(item.calculatedRate * item.cartQuantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="total-section">
              <div class="detail-row">
                <span class="label">${t('billing.makingCharges')} (${makingChargesPercent}%):</span>
                <span class="value">₹${makingCharges.toFixed(2)}</span>
              </div>
              <div class="detail-row">
                <span class="label">${t('billing.gst')} (${gstPercent}%):</span>
                <span class="value">₹${gstAmount.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>${t('billing.total')}:</span>
                <span>₹${total.toFixed(2)}</span>
              </div>
            </div>

            <div class="footer">
              <p>${t('billing.thankYou')}</p>
              <p>${t('company.name')} • ${t('billing.contact')}: ${t('company.phone')} • ${t('billing.email')}: ${t('company.email')}</p>
            </div>
          </body>
        </html>
      `;

      // Create and download the invoice file
      const blob = new Blob([invoiceHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${tempBill["Bill No"]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show success toast
      toast({
        title: t('billing.toast.invoiceDownloaded'),
        description: t('billing.toast.invoiceDownloadSuccess'),
        duration: 5000,
      });

      // Set completed bill
      setCompletedBill(tempBill);

    } catch (error) {
      // Just log the error without showing a toast
      console.error('Error downloading invoice:', error);
    }
  };

  // Modify handleSendWhatsApp to only handle WhatsApp
  const handleSendWhatsApp = () => {
    if (!canProceedWithSale()) {
      toast({
        title: t('billing.toast.missingInfo'),
        description: t('billing.toast.fillRequiredDetails'),
        variant: "destructive",
      });
      return;
    }

    try {
      // Create WhatsApp message
      const companyInfo = {
        name: t('company.name'),
        phone: t('company.phone'),
        email: t('company.email'),
        address: t('company.address'),
      };

      const messageToSend = `*${companyInfo.name} - ${t('billing.details.title')}*

📝 *${t('bills.billId')}:* ${completedBill?.["Bill No"] || `INV-${Date.now()}`}
📅 *${t('bills.date')}:* ${new Date().toLocaleDateString()}

👤 *${t('bills.customerName')}:* ${customerInfo.name}
📱 *${t('bills.phone')}:* ${customerInfo.phone}

💎 *${t('billing.details.items')}:*
${cartItems.map(item => 
  `• ${item["Product Name"]} (${item["Metal Type"] || t('common.none')})
   - ${t('products.weight')}: ${item["Weight (g)"]}g
   - ${t('products.quantity')}: ${item.cartQuantity}
   - ${t('metalRates.perGram')}: ₹${(item.calculatedRate / item["Weight (g)"]).toFixed(2)}
   - ${t('billing.total')}: ₹${(item.calculatedRate * item.cartQuantity).toFixed(2)}`
).join('\n\n')}

💰 *${t('billing.details.summary')}:*
• ${t('billing.makingCharges')} (${makingChargesPercent}%): ₹${makingCharges.toFixed(2)}
• ${t('billing.gst')} (${gstPercent}%): ₹${gstAmount.toFixed(2)}
• *${t('billing.total')}: ₹${total.toFixed(2)}*

📄 *${t('whatsapp.preview.fullDetails')}*

${t('billing.thankYou')} ✨

📞 ${t('billing.contact')}: ${companyInfo.phone}
📧 ${t('billing.email')}: ${companyInfo.email}`;

      // Format phone number
      let formattedPhone = customerInfo.phone.replace(/\D/g, '');
      if (!formattedPhone.startsWith('91')) {
        formattedPhone = '91' + formattedPhone;
      }

      // Open WhatsApp
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageToSend)}`;
      window.open(whatsappUrl, '_blank');

      toast({
        title: t('billing.toast.whatsappOpened'),
        description: t('billing.toast.attachInvoice'),
        duration: 10000,
      });

    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      toast({
        title: t('billing.toast.error'),
        description: t('billing.toast.whatsappError'),
        variant: "destructive",
      });
    }
  };

  const handlePrintReceipt = () => {
    if (!completedBill) {
      toast({
        title: t('billing.toast.noReceipt'),
        description: t('billing.toast.completeSaleFirst'),
        variant: "destructive",
      });
      return;
    }

    // Create a printable receipt
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${t('billing.details.title')} - ${completedBill["Bill No"]}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .details { margin: 10px 0; }
              .total { font-weight: bold; font-size: 18px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>${t('company.name')}</h2>
              <p>${t('billing.details.title')}</p>
            </div>
            <div class="details">
              <p><strong>${t('bills.billId')}:</strong> ${completedBill["Bill No"]}</p>
              <p><strong>${t('bills.date')}:</strong> ${new Date(completedBill["Date"]).toLocaleDateString()}</p>
              <p><strong>${t('bills.customerName')}:</strong> ${completedBill["Customer Name"]}</p>
              <p><strong>${t('bills.phone')}:</strong> ${completedBill["Phone Number"]}</p>
              <p><strong>${t('products.productName')}:</strong> ${completedBill["Product Name"]}</p>
              <p><strong>${t('products.metalType')}:</strong> ${completedBill["Metal Type"]}</p>
              <p><strong>${t('products.weight')}:</strong> ${completedBill["Weight (g)"]}g</p>
              <p><strong>${t('metalRates.perGram')}:</strong> ₹${completedBill["Rate per g"]}</p>
              <p><strong>${t('billing.makingCharges')}:</strong> ₹${completedBill["Making Charges"]}</p>
              <p><strong>${t('billing.gst')}:</strong> ${completedBill["GST (%)"]}%</p>
              <p class="total"><strong>${t('billing.total')}:</strong> ₹${completedBill["Total Amount"]}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      
      // Clear the billing data after successful print
      clearBillingData();
    }

    toast({
      title: t('billing.toast.receiptPrinted'),
      description: t('billing.toast.receiptSentToPrinter'),
    });
  };

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return products.filter(product => 
      (product["Product Name"]?.toLowerCase() || '').includes(searchLower) ||
      (product["Metal Type"]?.toLowerCase() || '').includes(searchLower)
    );
  }, [products, searchQuery]);

  // Calculate bill totals
  const billTotals = useMemo(() => {
    return selectedProducts.reduce((acc, product) => {
      const subtotal = product.price * product.quantity;
      const makingCharges = product.makingCharges * product.quantity;
      const gstAmount = (subtotal + makingCharges) * (product.gst / 100);
      return {
        subtotal: acc.subtotal + subtotal,
        makingCharges: acc.makingCharges + makingCharges,
        gst: acc.gst + gstAmount,
        total: acc.total + subtotal + makingCharges + gstAmount
      };
    }, { subtotal: 0, makingCharges: 0, gst: 0, total: 0 });
  }, [selectedProducts]);

  // Product selection columns for DataGrid
  const productColumns: GridColDef[] = [
    { field: 'name', headerName: t('billing.productName'), flex: 1 },
    { field: 'metalType', headerName: t('billing.metalType'), flex: 1 },
    { 
      field: 'price', 
      headerName: t('billing.price'), 
      flex: 1,
      renderCell: (params) => `₹${params.value.toLocaleString()}`
    },
    { 
      field: 'weight', 
      headerName: t('billing.weight'), 
      flex: 1,
      renderCell: (params) => `${params.value}g`
    },
    {
      field: 'actions',
      headerName: t('billing.actions'),
      flex: 1,
      renderCell: (params) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleAddProduct(params.row)}
        >
          <Plus className="h-4 w-4 mr-1" />
          {t('billing.add')}
        </Button>
      )
    }
  ];

  const handleAddProduct = (product: any) => {
    setSelectedProducts(prev => [...prev, {
      id: product["Product ID"],
      name: product["Product Name"],
      quantity: 1,
      price: product["Rate per g"] * product["Weight (g)"],
      weight: product["Weight (g)"],
      makingCharges: product["Making Charges"] || 0,
      gst: product["GST (%)"] || 0
    }]);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, quantity: Math.max(1, quantity) } : p
    ));
  };

  const handleGenerateBill = () => {
    if (!selectedCustomer || selectedProducts.length === 0) return;

    const newBill = {
      "Bill No": `BILL-${Date.now()}`,
      "Date": new Date().toISOString(),
      "Customer Name": selectedCustomer,
      "Product ID": selectedProducts[0].id,
      "Product Name": selectedProducts[0].name,
      "Quantity": selectedProducts[0].quantity,
      "Weight (g)": selectedProducts[0].weight,
      "Rate per g": selectedProducts[0].price / selectedProducts[0].weight,
      "Making Charges": selectedProducts[0].makingCharges,
      "GST (%)": selectedProducts[0].gst,
      "Total Amount": billTotals.total,
      "Status": "Completed"
    };

    addBill(newBill);
    // Reset form
    setSelectedCustomer("");
    setSelectedProducts([]);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-primary">{t('billing.title')}</h2>
        <Button
          variant="outline"
          onClick={() => setShowProductBrowser(true)}
          className="hover:bg-gray-100"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {t('billing.browseProducts')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="text-2xl">🛒</span>
              {t('billing.cartItems')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cartItems.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {t('billing.items')}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="text-2xl">💰</span>
              {t('billing.subtotal')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{subtotal.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {t('billing.beforeTax')}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="text-2xl">💵</span>
              {t('billing.total')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">₹{total.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {t('billing.total')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Details and Metal Rates */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <span className="text-xl">👤</span>
              {t('billing.customerDetails')}
            </CardTitle>
            <CardDescription>{t('billing.customerInfoHelp')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName" className="text-sm font-medium">
                {t('billing.customerName')}
              </Label>
              <Input
                id="customerName"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="bg-white"
                placeholder={t('billing.customerNamePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium">
                {t('billing.customerPhone')}
              </Label>
              <Input
                id="phoneNumber"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="bg-white"
                placeholder={t('billing.customerPhonePlaceholder')}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <span className="text-xl">💎</span>
              {t('billing.metalRates')}
            </CardTitle>
            <CardDescription>{t('billing.metalRatesHelp')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goldPrice" className="text-sm font-medium">
                {t('billing.goldPrice')}
              </Label>
              <Input
                id="goldPrice"
                type="number"
                value={goldPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  const cleanValue = value === "" ? "" : String(Number(value));
                  setGoldPrice(cleanValue);
                }}
                className="bg-white"
                placeholder={t('billing.goldPricePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="silverPrice" className="text-sm font-medium">
                {t('billing.silverPrice')}
              </Label>
              <Input
                id="silverPrice"
                type="number"
                value={silverPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  const cleanValue = value === "" ? "" : String(Number(value));
                  setSilverPrice(cleanValue);
                }}
                className="bg-white"
                placeholder={t('billing.silverPricePlaceholder')}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charges and Tax */}
      <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <span className="text-xl">📊</span>
            {t('billing.chargesAndTax')}
          </CardTitle>
          <CardDescription>{t('billing.chargesAndTaxHelp')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="makingCharges" className="text-sm font-medium">
                {t('billing.makingChargesPercent')}
              </Label>
              <Input
                id="makingCharges"
                type="number"
                value={makingChargesPercent}
                onChange={(e) => setMakingChargesPercent(Number(e.target.value))}
                className="bg-white"
                placeholder="10"
              />
              <p className="text-xs text-muted-foreground">
                {t('billing.percentageOfSubtotal')}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gstPercentage" className="text-sm font-medium">
                {t('billing.gstPercent')}
              </Label>
              <Input
                id="gstPercentage"
                type="number"
                value={gstPercent}
                onChange={(e) => setGstPercent(Number(e.target.value))}
                className="bg-white"
                placeholder="3"
              />
              <p className="text-xs text-muted-foreground">
                {t('billing.percentageOfTotal')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <span className="text-xl">💳</span>
            {t('billing.paymentMethod')}
          </CardTitle>
          <CardDescription>{t('bills.paymentMethod')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder={t('billing.selectPaymentMethod')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">{t('bills.payment.cash')}</SelectItem>
              <SelectItem value="card">{t('bills.payment.card')}</SelectItem>
              <SelectItem value="upi">{t('bills.payment.upi')}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Cart Summary */}
      <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <span className="text-xl">🛍️</span>
            {t('billing.cartSummary')}
          </CardTitle>
          <CardDescription>
            {cartItems.length === 0 ? t('billing.noItems') : t('billing.cartItems')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-4">
                {t('billing.emptyCart')}
              </p>
              <Button
                variant="outline"
                onClick={() => setShowProductBrowser(true)}
                className="hover:bg-gray-100"
              >
                {t('billing.browseProducts')}
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{item["Product Name"]}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="font-normal">
                          {item["Metal Type"] || t('common.none')}
                        </Badge>
                        <span>•</span>
                        <span>{t('products.weight')}: {item["Weight (g)"]}g</span>
                        {item.Carat && (
                          <>
                            <span>•</span>
                            <span>{t('products.carat')}: {item.Carat}</span>
                          </>
                        )}
                        {item.Quantity && (
                          <>
                            <span>•</span>
                            <span>{t('products.quantity')}: {item.cartQuantity}</span>
                          </>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t('metalRates.perGram')}: ₹{(item.calculatedRate / item["Weight (g)"]).toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{t('billing.total')}: ₹{(item.calculatedRate * item.cartQuantity).toFixed(2)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item["Product ID"])}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        {t('products.remove')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Validation Alerts */}
      {formSubmitted && (
        <div className="space-y-4">
          {cartItems.length === 0 && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('billing.errors.title')}</AlertTitle>
              <AlertDescription>{t('billing.errors.emptyCart')}</AlertDescription>
            </Alert>
          )}
          {cartItems.length > 0 && (!customerInfo.name || !customerInfo.phone) && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('billing.errors.title')}</AlertTitle>
              <AlertDescription>{t('billing.errors.customerInfo')}</AlertDescription>
            </Alert>
          )}
          {cartItems.some(item => item["Metal Type"]?.toLowerCase().includes("gold")) && !goldPrice && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('billing.errors.title')}</AlertTitle>
              <AlertDescription>{t('billing.errors.goldPrice')}</AlertDescription>
            </Alert>
          )}
          {cartItems.some(item => item["Metal Type"]?.toLowerCase().includes("silver")) && !silverPrice && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t('billing.errors.title')}</AlertTitle>
              <AlertDescription>{t('billing.errors.silverPrice')}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  variant="outline"
                  onClick={handleDownloadInvoice}
                  disabled={!canProceedWithSale()}
                  className="w-full sm:w-auto hover:bg-gray-100"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t('common.download')}
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('whatsapp.tips.pdfMention')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  variant="outline"
                  onClick={handleSendWhatsApp}
                  disabled={!canProceedWithSale()}
                  className="w-full sm:w-auto hover:bg-gray-100"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {t('whatsapp.sendInvoice')}
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('whatsapp.tips.openWhatsApp')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  onClick={handleCompleteSale}
                  disabled={!canProceedWithSale()}
                  className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary shadow-sm"
                >
                  {t('billing.generateBill')}
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('billing.generateBill')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <ProductBrowser
        open={showProductBrowser}
        onClose={() => setShowProductBrowser(false)}
        onAddToCart={handleAddProduct}
      />
    </div>
  );
};

export default BillingSystem;
