import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { googleSheetsApi, Bill } from "@/services/googleSheetsApi";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";

export default function Bills() {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();
  const { toast } = useToast();
  const { refreshData, printBill, sendWhatsApp, deleteBill } = useAppContext();

  const { data: bills = [], isLoading, error, refetch } = useQuery({
    queryKey: ['bills'],
    queryFn: googleSheetsApi.getAllBills,
  });

  useEffect(() => {
    if (error) {
      console.error('Error loading bills:', error);
      toast({
        title: "Error",
        description: "Failed to load bills from Google Sheets",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const filteredBills = bills.filter((bill: Bill) =>
    bill["Bill No"].toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill["Customer Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill["Phone Number"].includes(searchTerm) ||
    bill["Date"].toString().includes(searchTerm)
  );

  const handleViewDetails = (bill: Bill) => {
    toast({
      title: "Bill Details",
      description: `Viewing details for bill ${bill["Bill No"]}`,
    });
    console.log('Viewing bill details:', bill);
  };

  const handlePrintBill = (billNo: string) => {
    printBill(billNo);
  };

  const handleSendWhatsApp = (bill: Bill) => {
    sendWhatsApp(bill["Bill No"], bill["Phone Number"]);
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

  if (isLoading) {
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
                          onClick={() => handlePrintBill(bill["Bill No"])}
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

      {filteredBills.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('bills.noBills')}</p>
        </div>
      )}
    </div>
  );
}
