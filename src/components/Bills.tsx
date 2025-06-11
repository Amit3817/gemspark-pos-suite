import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/components/ui/use-toast";
import WhatsAppIntegration from "./WhatsAppIntegration";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Printer, Eye, Trash2 } from "lucide-react";
import { Bill } from "@/services/supabaseApi";

export default function Bills() {
  const { t } = useLanguage();
  const { bills, isLoadingBills, refreshData, deleteBill } = useAppContext();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [billToDelete, setBillToDelete] = useState<string | null>(null);

  console.log('Bills component - data:', bills);

  const filteredBills = bills.filter((bill: Bill) =>
    bill["Bill No"].toLowerCase().includes(searchQuery.toLowerCase()) ||
    bill["Customer Name"].toLowerCase().includes(searchQuery.toLowerCase()) ||
    bill["Phone Number"].toString().includes(searchQuery) ||
    bill["Date"].toString().includes(searchQuery)
  );

  const handleViewDetails = (bill: Bill) => {
    setSelectedBill(bill);
    setShowBillDetails(true);
  };

  const handlePrintBill = async (bill: Bill) => {
    try {
      // Generate PDF
      const pdfDataUrl = await generateBillPDF(bill);
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Write the PDF to the new window
      printWindow.document.write(`
        <html>
          <head>
            <title>Bill ${bill["Bill No"]}</title>
            <style>
              body { margin: 0; }
              iframe { width: 100%; height: 100vh; border: none; }
            </style>
          </head>
          <body>
            <iframe src="${pdfDataUrl}"></iframe>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for PDF to load
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);

      toast({
        title: "Printing Bill",
        description: `Bill ${bill["Bill No"]} is being printed`,
      });
    } catch (error) {
      console.error('Error printing bill:', error);
      toast({
        title: "Error",
        description: "Failed to print bill. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendWhatsApp = (bill: Bill) => {
    // Create a complete Bill object with all required properties
    const completeBill: Bill = {
      ...bill,
      "Making Charges Percent": bill["Making Charges Percent"] || 10,
      "Gold Price per 10g": bill["Gold Price per 10g"] || 0,
      "Silver Price per 10g": bill["Silver Price per 10g"] || 0
    };
    
    setSelectedBill(completeBill);
    setShowWhatsApp(true);
  };

  const handleDeleteBill = async (billNo: string) => {
    try {
      await deleteBill(billNo);
      toast({
        title: "Bill Deleted",
        description: `Bill ${billNo} has been deleted successfully`,
      });
      setBillToDelete(null);
    } catch (error) {
      console.error('Error deleting bill:', error);
      toast({
        title: "Error",
        description: "Failed to delete bill. Please try again.",
        variant: "destructive",
      });
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Bill Details Dialog */}
      <Dialog open={showBillDetails} onOpenChange={setShowBillDetails}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Bill Details - {selectedBill?.["Bill No"]}</DialogTitle>
            <DialogDescription>
              Detailed information about the bill
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            {selectedBill && (
              <div className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Customer Information</h3>
                    <p className="mt-1">Name: {selectedBill["Customer Name"]}</p>
                    <p>Phone: {selectedBill["Phone Number"]}</p>
                    <p>Date: {new Date(selectedBill["Date"]).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Product Details</h3>
                    <p className="mt-1">Product: {selectedBill["Product Name"]}</p>
                    <p>Metal: {selectedBill["Metal Type"]}</p>
                    <p>Weight: {selectedBill["Weight (g)"]}g</p>
                    <p>Rate: ₹{selectedBill["Rate per g"]}/g</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-sm text-muted-foreground">Amount Details</h3>
                  <div className="mt-2 space-y-1">
                    <p>Making Charges: ₹{selectedBill["Making Charges"]}</p>
                    <p>GST ({selectedBill["GST (%)"]}%): ₹{selectedBill["GST Amount"]}</p>
                    <p className="font-bold text-lg">Total Amount: ₹{selectedBill["Total Amount"]}</p>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!billToDelete} onOpenChange={(open) => !open && setBillToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete bill {billToDelete} and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => billToDelete && handleDeleteBill(billToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                          onClick={() => setBillToDelete(bill["Bill No"])}
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
