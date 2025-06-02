
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { googleSheetsApi, Product } from "@/services/googleSheetsApi";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

interface CartItem extends Product {
  cartQuantity: number;
}

export default function BillingSystem() {
  const { t } = useLanguage();
  const { addBill } = useAppContext();
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Fetch products for selection
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: googleSheetsApi.getAllProducts,
  });

  const filteredProducts = products.filter(product =>
    product["Product Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.Category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item["Product ID"] === product["Product ID"]);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item["Product ID"] === product["Product ID"]
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, cartQuantity: 1 }]);
    }
    toast({
      title: "Added to Cart",
      description: `${product["Product Name"]} added to cart`,
    });
  };

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

  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = (item["Weight (g)"] * item["Rate per g"]) || 0;
    return sum + (itemPrice * item.cartQuantity);
  }, 0);

  const gstPercent = 3;
  const gstAmount = (subtotal * gstPercent) / 100;
  const total = subtotal + gstAmount;

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

    try {
      // Create bills for each cart item
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
          "Rate per g": item["Rate per g"],
          "Making Charges": 0,
          "GST (%)": gstPercent,
        };

        await addBill(bill);
      }

      // Clear cart and customer info
      setCartItems([]);
      setCustomerInfo({ name: "", phone: "", email: "" });
      
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
              
              {/* Product List */}
              <div className="max-h-60 overflow-y-auto space-y-2">
                {filteredProducts.map((product) => (
                  <div key={product["Product ID"]} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{product["Product Name"]}</h4>
                      <p className="text-sm text-muted-foreground">
                        {product.Category} • {product["Metal Type"]} • Stock: {product.Quantity}
                      </p>
                      <p className="text-sm font-medium">₹{(product["Weight (g)"] * product["Rate per g"]).toLocaleString()}</p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => addToCart(product)}
                      disabled={product.Quantity === 0}
                    >
                      Add to Cart
                    </Button>
                  </div>
                ))}
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
                          ₹{(item["Weight (g)"] * item["Rate per g"]).toLocaleString()} per item
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
                          ₹{((item["Weight (g)"] * item["Rate per g"]) * item.cartQuantity).toLocaleString()}
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
                <Button variant="outline" className="w-full">
                  {t('billing.sendViaWhatsApp')}
                </Button>
                <Button variant="outline" className="w-full">
                  {t('billing.printReceipt')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
