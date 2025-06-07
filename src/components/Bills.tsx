
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bill } from "@/services/googleSheetsApi";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import WhatsAppIntegration from "./WhatsAppIntegration";

export default function Bills() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { bills, isLoadingBills, refreshData, printBill, deleteBill } = useAppContext();

  console.log('Bills component - data:', bills);

  const filteredBills = bills.filter((bill: Bill) =>
    bill["Bill No"].toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill["Customer Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill["Phone Number"].toString().includes(searchTerm) ||
    bill["Date"].toString().includes(searchTerm)
  );

  const handleViewDetails = (bill: Bill) => {
    toast({
      title: "Bill Details",
      description: `Viewing details for bill ${bill["Bill No"]}`,
    });
    console.log('Viewing bill details:', bill);
  };

  const handlePrintBill = (bill: Bill) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${bill["Bill No"]}</title>
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
              <p><strong>Bill No:</strong> ${bill["Bill No"]}</p>
              <p><strong>Date:</strong> ${new Date(bill["Date"]).toLocaleDateString()}</p>
              <p><strong>Customer:</strong> ${bill["Customer Name"]}</p>
              <p><strong>Phone:</strong> ${bill["Phone Number"]}</p>
              <p><strong>Product:</strong> ${bill["Product Name"]}</p>
              <p><strong>Metal Type:</strong> ${bill["Metal Type"]}</p>
              <p><strong>Weight:</strong> ${bill["Weight (g)"]}g</p>
              <p><strong>Rate per gram:</strong> ₹${bill["Rate per g"]}</p>
              <p><strong>Making Charges:</strong> ₹${bill["Making Charges"]}</p>
              <p><strong>GST:</strong> ${bill["GST (%)"]}%</p>
              <p class="total"><strong>Total Amount:</strong> ₹${bill["Total Amount"]}</p>
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

  const handleSendWhatsApp = (bill: Bill) => {
    setSelectedBill(bill);
    setShowWhatsApp(true);
  };

  const handleDeleteBill = async (billNo: string) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      await deleteBill(billNo);
    }
  };

  const getStatusBadge = (status: string = "Paid") => {
    return <Badge className="bg-green-100 text-green-800 border-green-200">{t('bills.status.paid')}</Badge>;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const totalBills = bills.length;
  const totalRevenue = bills.reduce((sum: number, bill: Bill) => {
    return sum + (bill["Total Amount"] || 0);
  }, 0);
  const averageBill = totalBills > 0 ? Math.round(totalRevenue / totalBills) : 0;

  if (isLoadingBills) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex justify-center items-center py-12">
          <p className="text-muted-foreground">Loading bills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">{t('bills.title')}</h2>
        <Button variant="outline" onClick={refreshData}>
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('bills.totalBills')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBills}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('bills.totalRevenue')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('bills.averageBill')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹{averageBill.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder={t('bills.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-md"
        />
      </div>

      {/* WhatsApp Integration */}
      {showWhatsApp && selectedBill && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Send Bill via WhatsApp</CardTitle>
              <Button variant="outline" onClick={() => setShowWhatsApp(false)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <WhatsAppIntegration 
              bill={selectedBill}
              customerPhone={selectedBill["Phone Number"].toString()}
            />
          </CardContent>
        </Card>
      )}

      {/* Bills Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('bills.title')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">{t('bills.billId')}</TableHead>
                  <TableHead>{t('bills.customerName')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('bills.phone')}</TableHead>
                  <TableHead>{t('bills.amount')}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t('bills.date')}</TableHead>
                  <TableHead className="hidden lg:table-cell">Product</TableHead>
                  <TableHead className="hidden lg:table-cell">Metal Type</TableHead>
                  <TableHead>{t('bills.status')}</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.map((bill: Bill) => (
                  <TableRow key={bill["Bill No"]} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{bill["Bill No"]}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{bill["Customer Name"]}</div>
                        <div className="text-sm text-muted-foreground md:hidden">{bill["Phone Number"]}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{bill["Phone Number"]}</TableCell>
                    <TableCell className="font-bold text-primary">₹{bill["Total Amount"]?.toLocaleString()}</TableCell>
                    <TableCell className="hidden sm:table-cell">{formatDate(bill["Date"])}</TableCell>
                    <TableCell className="hidden lg:table-cell">{bill["Product Name"]}</TableCell>
                    <TableCell className="hidden lg:table-cell">{bill["Metal Type"]}</TableCell>
                    <TableCell>{getStatusBadge()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs"
                          onClick={() => handleViewDetails(bill)}
                        >
                          {t('bills.viewDetails')}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs hidden sm:inline-flex"
                          onClick={() => handlePrintBill(bill)}
                        >
                          {t('bills.printBill')}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs bg-green-500 hover:bg-green-600 text-white hidden lg:inline-flex"
                          onClick={() => handleSendWhatsApp(bill)}
                        >
                          WhatsApp
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          className="text-xs hidden xl:inline-flex"
                          onClick={() => handleDeleteBill(bill["Bill No"])}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredBills.length === 0 && !isLoadingBills && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('bills.noBills')}</p>
        </div>
      )}
    </div>
  );
}
