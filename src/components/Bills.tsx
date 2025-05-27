
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Bills() {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

  const bills = [
    {
      id: "BILL-001",
      customerName: "Priya Sharma",
      phone: "+91 98765 43210",
      amount: "₹45,000",
      date: "2024-01-15",
      items: 2,
      paymentMethod: "Card",
      status: "Paid"
    },
    {
      id: "BILL-002",
      customerName: "Rajesh Kumar",
      phone: "+91 87654 32109",
      amount: "₹18,500",
      date: "2024-01-14",
      items: 1,
      paymentMethod: "UPI",
      status: "Paid"
    },
    {
      id: "BILL-003",
      customerName: "Anita Desai",
      phone: "+91 76543 21098",
      amount: "₹32,000",
      date: "2024-01-13",
      items: 1,
      paymentMethod: "Cash",
      status: "Paid"
    },
    {
      id: "BILL-004",
      customerName: "Suresh Patel",
      phone: "+91 65432 10987",
      amount: "₹8,750",
      date: "2024-01-12",
      items: 1,
      paymentMethod: "Card",
      status: "Pending"
    },
    {
      id: "BILL-005",
      customerName: "Meera Reddy",
      phone: "+91 54321 09876",
      amount: "₹28,500",
      date: "2024-01-11",
      items: 1,
      paymentMethod: "UPI",
      status: "Paid"
    },
    {
      id: "BILL-006",
      customerName: "Vikram Singh",
      phone: "+91 43210 98765",
      amount: "₹65,000",
      date: "2024-01-10",
      items: 2,
      paymentMethod: "Cash",
      status: "Paid"
    },
    {
      id: "BILL-007",
      customerName: "Sita Rao",
      phone: "+91 32109 87654",
      amount: "₹35,200",
      date: "2024-01-09",
      items: 1,
      paymentMethod: "Card",
      status: "Paid"
    },
    {
      id: "BILL-008",
      customerName: "Arjun Gupta",
      phone: "+91 21098 76543",
      amount: "₹29,800",
      date: "2024-01-08",
      items: 1,
      paymentMethod: "UPI",
      status: "Paid"
    }
  ];

  const filteredBills = bills.filter(bill =>
    bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.phone.includes(searchTerm) ||
    bill.date.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-100 text-green-800 border-green-200">{t('bills.status.paid')}</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">{t('bills.status.pending')}</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "Cash":
        return t('bills.payment.cash');
      case "Card":
        return t('bills.payment.card');
      case "UPI":
        return t('bills.payment.upi');
      default:
        return method;
    }
  };

  const totalBills = bills.length;
  const totalRevenue = bills.reduce((sum, bill) => {
    const amount = parseInt(bill.amount.replace(/[₹,]/g, ''));
    return sum + amount;
  }, 0);
  const averageBill = Math.round(totalRevenue / totalBills);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">{t('bills.title')}</h2>
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
                  <TableHead className="hidden lg:table-cell">{t('bills.items')}</TableHead>
                  <TableHead className="hidden lg:table-cell">{t('bills.paymentMethod')}</TableHead>
                  <TableHead>{t('bills.status')}</TableHead>
                  <TableHead className="text-right">{t('common.view')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.map((bill) => (
                  <TableRow key={bill.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{bill.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{bill.customerName}</div>
                        <div className="text-sm text-muted-foreground md:hidden">{bill.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{bill.phone}</TableCell>
                    <TableCell className="font-bold text-primary">{bill.amount}</TableCell>
                    <TableCell className="hidden sm:table-cell">{bill.date}</TableCell>
                    <TableCell className="hidden lg:table-cell">{bill.items}</TableCell>
                    <TableCell className="hidden lg:table-cell">{getPaymentMethodText(bill.paymentMethod)}</TableCell>
                    <TableCell>{getStatusBadge(bill.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          {t('bills.viewDetails')}
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs hidden sm:inline-flex">
                          {t('bills.printBill')}
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

      {filteredBills.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('bills.noBills')}</p>
        </div>
      )}
    </div>
  );
}
