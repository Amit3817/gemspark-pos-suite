
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

  const generateBillMessage = (billData: Bill) => {
    return `*GemSpark Jewelry - Bill Receipt*

📧 *Bill No:* ${billData["Bill No"]}
📅 *Date:* ${new Date(billData["Date"]).toLocaleDateString()}

👤 *Customer Details:*
Name: ${billData["Customer Name"]}
Phone: ${billData["Phone Number"]}

💎 *Product Details:*
Product: ${billData["Product Name"]}
ID: ${billData["Product ID"]}
Metal: ${billData["Metal Type"]}
Carat: ${billData["Carat"]}
Weight: ${billData["Weight (g)"]}g

💰 *Pricing:*
Rate per gram: ₹${billData["Rate per g"]}
Making Charges: ₹${billData["Making Charges"]} (${billData["Making Charges Percent"]}%)
GST: ${billData["GST (%)"]}%
*Total Amount: ₹${billData["Total Amount"]}*

Thank you for shopping with GemSpark Jewelry! ✨

For any queries, contact us at:
📱 +91 98765 43210
📧 info@gemspark.com`;
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
      
      // If bill data is provided and no custom message, generate bill message
      if (bill && !message.trim()) {
        messageToSend = generateBillMessage(bill);
      }

      // Format phone number (remove any non-digit characters and add country code if needed)
      let formattedPhone = phoneNumber.replace(/\D/g, '');
      if (!formattedPhone.startsWith('91')) {
        formattedPhone = '91' + formattedPhone;
      }

      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageToSend)}`;
      
      // Open WhatsApp in new window
      window.open(whatsappUrl, '_blank');

      toast({
        title: "WhatsApp Opened",
        description: "WhatsApp has been opened with the message ready to send",
      });

      console.log('WhatsApp URL:', whatsappUrl);
      console.log('Message sent to:', formattedPhone);
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
      setMessage(generateBillMessage(bill));
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-green-600">📱</span>
          WhatsApp Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter phone number with or without country code
          </p>
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter custom message or leave empty to auto-generate bill message..."
            rows={8}
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          {bill && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviewMessage}
              className="flex-1"
            >
              Preview Bill Message
            </Button>
          )}
          <Button
            onClick={handleSendWhatsApp}
            disabled={isLoading || !phoneNumber}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "Opening..." : "Send via WhatsApp"}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>• This will open WhatsApp Web/App with the message ready to send</p>
          <p>• Make sure WhatsApp is installed on your device</p>
          <p>• The recipient must have WhatsApp to receive the message</p>
        </div>
      </CardContent>
    </Card>
  );
}
