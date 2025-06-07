
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bill } from "@/services/supabaseApi";

interface WhatsAppIntegrationProps {
  bill?: Bill;
  customerPhone?: string;
}

export default function WhatsAppIntegration({ bill, customerPhone }: WhatsAppIntegrationProps) {
  const [phoneNumber, setPhoneNumber] = useState(customerPhone || "");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateBillPDF = async (billData: Bill): Promise<Blob> => {
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

    // Convert HTML to PDF using browser's print functionality
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window');
    }

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Return a mock blob for now - in a real implementation, you'd use a PDF library
    return new Blob([htmlContent], { type: 'text/html' });
  };

  const handleSendWhatsApp = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      let messageToSend = message;
      
      // If bill data is provided, generate PDF and send via WhatsApp
      if (bill) {
        // Generate PDF
        const pdfBlob = await generateBillPDF(bill);
        
        // For now, we'll send a message with bill details and mention that PDF is attached
        // In a real implementation, you'd upload the PDF to a cloud service and share the link
        messageToSend = `*GemSpark Jewelry - Invoice*

📧 *Invoice No:* ${bill["Bill No"]}
📅 *Date:* ${new Date(bill["Date"]).toLocaleDateString()}

👤 *Customer:* ${bill["Customer Name"]}
📱 *Phone:* ${bill["Phone Number"]}

💎 *Product Details:*
• Product: ${bill["Product Name"]}
• Metal: ${bill["Metal Type"]}
• Weight: ${bill["Weight (g)"]}g
• Rate: ₹${bill["Rate per g"]}/g

💰 *Amount Details:*
• Making Charges: ₹${bill["Making Charges"]}
• GST: ${bill["GST (%)"]}%
• *Total: ₹${bill["Total Amount"]}*

Thank you for choosing GemSpark Jewelry! ✨

📞 Contact: +91 98765 43210
📧 Email: info@gemspark.com

*PDF invoice will be shared separately*`;
      }

      // Format phone number
      let formattedPhone = phoneNumber.replace(/\D/g, '');
      if (!formattedPhone.startsWith('91')) {
        formattedPhone = '91' + formattedPhone;
      }

      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageToSend)}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      toast({
        title: "WhatsApp Opened",
        description: "WhatsApp opened with invoice details. PDF can be shared separately.",
      });

    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      toast({
        title: "Error",
        description: "Failed to open WhatsApp",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviewMessage = () => {
    if (bill && !message.trim()) {
      const previewMessage = `*GemSpark Jewelry Invoice Preview*\n\nInvoice: ${bill["Bill No"]}\nCustomer: ${bill["Customer Name"]}\nTotal: ₹${bill["Total Amount"]}\n\n(Full details will be included when sent)`;
      setMessage(previewMessage);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="text-green-600">📱</span>
            WhatsApp Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter phone number with or without country code
              </p>
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium">Custom Message (Optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add custom message or leave empty for auto-generated invoice message..."
                rows={6}
                className="w-full mt-1 resize-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            {bill && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviewMessage}
                className="flex-1"
                size="sm"
              >
                Preview Message
              </Button>
            )}
            <Button
              onClick={handleSendWhatsApp}
              disabled={isLoading || !phoneNumber}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              {isLoading ? "Opening..." : "Send Invoice via WhatsApp"}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1 bg-gray-50 p-3 rounded">
            <p>• This opens WhatsApp with invoice details ready to send</p>
            <p>• PDF invoice will be mentioned in the message</p>
            <p>• Make sure WhatsApp is installed on your device</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
