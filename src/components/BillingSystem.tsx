
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabaseApi, Product } from "@/services/supabaseApi";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import WhatsAppIntegration from "./WhatsAppIntegration";

interface CartItem extends Product {
  cartQuantity: number;
  calculatedRate: number;
}

export default function BillingSystem() {
  const { t } = useLanguage();
  const { addBill, addCustomer } = useAppContext();
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [goldPrice, setGoldPrice] = useState<number>(0);
  const [silverPrice, setSilverPrice] = useState<number>(0);
  const [makingChargesPercent, setMakingChargesPercent] = useState<number>(10);
  const [completedBill, setCompletedBill] = useState<any>(null);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: supabaseApi.getAllProducts,
  });

  const filteredProducts = products.filter(product =>
    product["Product Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateRate = (product: Product): number => {
    const metalType = product["Metal Type"]?.toLowerCase();
    const weight = product["Weight (g)"];
    
    if (metalType?.includes("gold") && goldPrice > 0) {
      return (goldPrice / 10) * weight;
    } else if (metalType?.includes("silver") && silverPrice > 0) {
      return (silverPrice / 10) * weight;
    }
    return 0;
  };

  const addToCart = (product: Product) => {
    const calculatedRate = calculateRate(product);
    
    if (calculatedRate === 0) {
      const metalType = product["Metal Type"]?.toLowerCase();
      const missingPrice = metalType?.includes("gold") ? "gold" : "silver";
      toast({
        title: "Price Required",
        description: `Please set ${missingPrice} price before adding this item`,
        variant: "destructive",
      });
      return;
    }

    const existingItem = cartItems.find(item => item["Product ID"] === product["Product ID"]);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item["Product ID"] === product["Product ID"]
          ? { ...item, cartQuantity: item.cartQuantity + 1, calculatedRate }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, cartQuantity: 1, calculatedRate }]);
    }
    toast({
      title: "Added to Cart",
      description: `${product["Product Name"]} added to cart`,
    });
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
    setCartItems(cartItems.filter(item => item["Product ID"] !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(cartItems.map(item =>
        item["Product ID"] === productId
          ? { ...item, cartQuantity: Math.min(quantity, item.Quantity) }
          : item
      ));
    }
  };

  const hasGoldItems = cartItems.some(item => item["Metal Type"]?.toLowerCase().includes("gold"));
  const hasSilverItems = cartItems.some(item => item["Metal Type"]?.toLowerCase().includes("silver"));

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.calculatedRate * item.cartQuantity);
  }, 0);

  const makingCharges = (subtotal * makingChargesPercent) / 100;
  const gstPercent = 3;
  const gstAmount = (subtotal + makingCharges) * (gstPercent / 100);
  const total = subtotal + makingCharges + gstAmount;

  const handleCompleteSale = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add items to cart before completing sale",
        variant: "destructive",
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Error",
        description: "Please provide customer name and phone number",
        variant: "destructive",
      });
      return;
    }

    if (hasGoldItems && goldPrice <= 0) {
      toast({
        title: "Error",
        description: "Please enter gold price for gold items",
        variant: "destructive",
      });
      return;
    }

    if (hasSilverItems && silverPrice <= 0) {
      toast({
        title: "Error",
        description: "Please enter silver price for silver items",
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
        
        const bill = {
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
          "Gold Price per 10g": hasGoldItems ? goldPrice : 0,
          "Silver Price per 10g": hasSilverItems ? silverPrice : 0,
        };

        await addBill(bill);
        
        if (!firstBill) {
          firstBill = {
            ...bill,
            "Date": new Date().toISOString(),
            "Total Amount": total
          };
        }
      }

      // Set completed bill for WhatsApp integration
      setCompletedBill(firstBill);
      
      // Clear cart and customer info
      setCartItems([]);
      setCustomerInfo({ name: "", phone: "", email: "" });
      setGoldPrice(0);
      setSilverPrice(0);
      
      toast({
        title: "Sale Completed",
        description: "Bills created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete sale",
        variant: "destructive",
      });
    }
  };

  const handlePrintReceipt = () => {
    if (!completedBill) {
      toast({
        title: "No Receipt to Print",
        description: "Please complete a sale first",
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
            <title>Receipt - ${completedBill["Bill No"]}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .details { margin: 10px 0; }
              .total { font-weight: bold; font-size: 18px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>GemSpark Jewelry</h2>
              <p>Receipt</p>
            </div>
            <div class="details">
              <p><strong>Bill No:</strong> ${completedBill["Bill No"]}</p>
              <p><strong>Date:</strong> ${new Date(completedBill["Date"]).toLocaleDateString()}</p>
              <p><strong>Customer:</strong> ${completedBill["Customer Name"]}</p>
              <p><strong>Phone:</strong> ${completedBill["Phone Number"]}</p>
              <p><strong>Product:</strong> ${completedBill["Product Name"]}</p>
              <p><strong>Metal Type:</strong> ${completedBill["Metal Type"]}</p>
              <p><strong>Weight:</strong> ${completedBill["Weight (g)"]}g</p>
              <p><strong>Rate per gram:</strong> ₹${completedBill["Rate per g"]}</p>
              <p><strong>Making Charges:</strong> ₹${completedBill["Making Charges"]}</p>
              <p><strong>GST:</strong> ${completedBill["GST (%)"]}%</p>
              <p class="total"><strong>Total Amount:</strong> ₹${completedBill["Total Amount"]}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }

    toast({
      title: "Receipt Printed",
      description: "Receipt has been sent to printer",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-primary">{t('nav.billing')}</h2>
        <div className="flex space-x-3">
          <Button variant="outline">{t('billing.loadDraft')}</Button>
          <Button variant="outline">{t('common.save')} {t('billing.draft')}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Metal Prices (Required for Adding Items)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gold-price">Gold Price (per 10g)</Label>
                <Input
                  id="gold-price"
                  type="number"
                  value={goldPrice}
                  onChange={(e) => setGoldPrice(Number(e.target.value))}
                  placeholder="Enter gold price per 10g"
                />
              </div>
              <div>
                <Label htmlFor="silver-price">Silver Price (per 10g)</Label>
                <Input
                  id="silver-price"
                  type="number"
                  value={silverPrice}
                  onChange={(e) => setSilverPrice(Number(e.target.value))}
                  placeholder="Enter silver price per 10g"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('billing.addProducts')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Input 
                  placeholder={t('products.search')} 
                  className="flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={() => setSearchTerm("")}>{t('common.clear')}</Button>
              </div>
              
              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredProducts.map((product) => {
                  const calculatedRate = calculateRate(product);
                  return (
                    <div key={product["Product ID"]} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{product["Product Name"]}</h4>
                        <p className="text-sm text-muted-foreground">
                          {product.Category} • {product["Metal Type"]} • Stock: {product.Quantity}
                        </p>
                        <p className="text-sm font-medium">
                          {calculatedRate > 0 ? `₹${calculatedRate.toLocaleString()}` : 'Set metal price first'}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => addToCart(product)}
                        disabled={product.Quantity === 0 || calculatedRate === 0}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <Card>
            <CardHeader>
              <CardTitle>{t('billing.cartItems')}</CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">{t('billing.noItemsInCart')}</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item["Product ID"]} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item["Product Name"]}</h4>
                        <p className="text-sm text-muted-foreground">
                          ₹{item.calculatedRate.toLocaleString()} per item
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateCartQuantity(item["Product ID"], item.cartQuantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.cartQuantity}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateCartQuantity(item["Product ID"], item.cartQuantity + 1)}
                            disabled={item.cartQuantity >= item.Quantity}
                          >
                            +
                          </Button>
                        </div>
                        <p className="font-medium w-24 text-right">
                          ₹{(item.calculatedRate * item.cartQuantity).toLocaleString()}
                        </p>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => removeFromCart(item["Product ID"])}
                        >
                          {t('common.delete')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Billing Summary */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t('billing.customerInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customer-name">{t('customers.customerName')}</Label>
                <Input
                  id="customer-name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  placeholder={t('billing.customerNamePlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="customer-phone">{t('customers.phone')}</Label>
                <Input
                  id="customer-phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  placeholder={t('billing.phoneNumberPlaceholder')}
                />
              </div>
              <div>
                <Label htmlFor="customer-email">{t('customers.email')} ({t('billing.optional')})</Label>
                <Input
                  id="customer-email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  placeholder={t('billing.emailAddressPlaceholder')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Making Charges */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Charges</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="making-charges">Making Charges (%)</Label>
                <Input
                  id="making-charges"
                  type="number"
                  value={makingChargesPercent}
                  onChange={(e) => setMakingChargesPercent(Number(e.target.value))}
                  placeholder="Enter making charges percentage"
                />
              </div>
            </CardContent>
          </Card>

          {/* Bill Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{t('billing.billSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t('billing.subtotal')}:</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Making Charges ({makingChargesPercent}%):</span>
                  <span>₹{makingCharges.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('billing.gst')} ({gstPercent}%):</span>
                  <span>₹{gstAmount.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>{t('billing.total')}:</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('bills.paymentMethod')}</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">{t('bills.payment.cash')}</SelectItem>
                    <SelectItem value="card">{t('bills.payment.card')}</SelectItem>
                    <SelectItem value="upi">{t('bills.payment.upi')}</SelectItem>
                    <SelectItem value="cheque">{t('billing.cheque')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 pt-4">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleCompleteSale}
                  disabled={cartItems.length === 0}
                >
                  {t('billing.completeSale')}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowWhatsApp(true)}
                  disabled={!completedBill}
                >
                  {t('billing.sendViaWhatsApp')}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handlePrintReceipt}
                  disabled={!completedBill}
                >
                  {t('billing.printReceipt')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Integration */}
          {showWhatsApp && completedBill && (
            <Card>
              <CardContent className="p-4">
                <WhatsAppIntegration 
                  bill={completedBill}
                  customerPhone={completedBill["Phone Number"]}
                />
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setShowWhatsApp(false)}
                >
                  Close WhatsApp
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
