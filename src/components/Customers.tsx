
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

  const customers = [
    {
      id: "CUST-001",
      name: "Priya Sharma",
      phone: "+91 98765 43210",
      email: "priya.sharma@email.com",
      totalPurchases: "₹2,45,000",
      lastVisit: "2024-01-15",
      status: "VIP",
      purchases: 8
    },
    {
      id: "CUST-002",
      name: "Rajesh Kumar",
      phone: "+91 87654 32109",
      email: "rajesh.kumar@email.com",
      totalPurchases: "₹1,20,000",
      lastVisit: "2024-01-12",
      status: "Regular",
      purchases: 5
    },
    {
      id: "CUST-003",
      name: "Anita Desai",
      phone: "+91 76543 21098",
      email: "anita.desai@email.com",
      totalPurchases: "₹85,000",
      lastVisit: "2024-01-10",
      status: "Regular",
      purchases: 3
    },
    {
      id: "CUST-004",
      name: "Suresh Patel",
      phone: "+91 65432 10987",
      email: "suresh.patel@email.com",
      totalPurchases: "₹45,000",
      lastVisit: "2024-01-08",
      status: "New",
      purchases: 2
    },
    {
      id: "CUST-005",
      name: "Meera Reddy",
      phone: "+91 54321 09876",
      email: "meera.reddy@email.com",
      totalPurchases: "₹3,20,000",
      lastVisit: "2024-01-14",
      status: "VIP",
      purchases: 12
    }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VIP":
        return <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-primary">{t('customers.status.vip')}</Badge>;
      case "Regular":
        return <Badge variant="outline" className="border-blue-500 text-blue-600">{t('customers.status.regular')}</Badge>;
      case "New":
        return <Badge variant="outline" className="border-green-500 text-green-600">{t('customers.status.new')}</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const totalCustomers = customers.length;
  const vipCustomers = customers.filter(c => c.status === "VIP").length;
  const newCustomers = customers.filter(c => c.status === "New").length;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">{t('customers.title')}</h2>
        <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary w-full sm:w-auto">
          {t('customers.addNew')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('customers.totalCustomers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('customers.vipCustomers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{vipCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('customers.newThisMonth')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{newCustomers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder={t('customers.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-md"
        />
        <Button variant="outline">{t('customers.exportList')}</Button>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{customer.id}</p>
                </div>
                {getStatusBadge(customer.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">{t('customers.phone')}:</span>
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">{t('customers.email')}:</span>
                    <span className="truncate ml-2">{customer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">{t('customers.totalPurchases')}:</span>
                    <span className="font-bold text-primary">{customer.totalPurchases}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">{t('customers.orders')}:</span>
                    <span>{customer.purchases}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">{t('customers.lastVisit')}:</span>
                    <span>{customer.lastVisit}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-3 border-t">
                  <Button size="sm" variant="outline" className="flex-1">{t('customers.viewHistory')}</Button>
                  <Button size="sm" className="flex-1">{t('customers.newSale')}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('customers.noCustomers')}</p>
        </div>
      )}
    </div>
  );
}
