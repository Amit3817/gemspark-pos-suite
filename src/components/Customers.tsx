import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Customer } from "@/services/googleSheetsApi";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { testGoogleScript, testWithJsonp } from "@/services/testGoogleScript";

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();
  const { toast } = useToast();
  const { customers, isLoadingCustomers, refreshData } = useAppContext();

  console.log('Customers component - data:', customers);

  const handleTestConnection = async () => {
    toast({
      title: "Testing Connection",
      description: "Running connection tests...",
    });
    
    console.log('=== Starting Google Apps Script Connection Tests ===');
    
    const test1 = await testGoogleScript();
    console.log('Test 1 (Fetch):', test1);
    
    const test2 = await testWithJsonp();
    console.log('Test 2 (JSONP):', test2);
    
    toast({
      title: "Tests Complete",
      description: "Check console for results",
    });
  };

  const filteredCustomers = customers.filter((customer: Customer) =>
    customer["Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer["Phone"].includes(searchTerm) ||
    customer["Email"].toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleAddNew = () => {
    toast({
      title: "Add New Customer",
      description: "Opening form to add new customer",
    });
    console.log('Opening add new customer form');
  };

  const handleViewHistory = (customerId: string) => {
    toast({
      title: "Customer History",
      description: `Viewing history for customer ${customerId}`,
    });
    console.log('Viewing customer history:', customerId);
  };

  const handleNewSale = (customerId: string) => {
    toast({
      title: "New Sale",
      description: `Starting new sale for customer ${customerId}`,
    });
    console.log('Starting new sale for customer:', customerId);
  };

  const totalCustomers = customers.length;
  const vipCustomers = customers.filter((c: Customer) => c["Status"] === "VIP").length;
  const newCustomers = customers.filter((c: Customer) => c["Status"] === "New").length;

  if (isLoadingCustomers) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex justify-center items-center py-12">
          <p className="text-muted-foreground">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">{t('customers.title')}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleTestConnection}>
            Test Connection
          </Button>
          <Button variant="outline" onClick={refreshData}>
            Refresh Data
          </Button>
          <Button 
            onClick={handleAddNew}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary w-full sm:w-auto"
          >
            {t('customers.addNew')}
          </Button>
        </div>
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
        {filteredCustomers.map((customer: Customer) => (
          <Card key={customer["Customer ID"]} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{customer["Name"]}</CardTitle>
                  <p className="text-sm text-muted-foreground">{customer["Customer ID"]}</p>
                </div>
                {getStatusBadge(customer["Status"])}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">{t('customers.phone')}:</span>
                    <span>{customer["Phone"]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">{t('customers.email')}:</span>
                    <span className="truncate ml-2">{customer["Email"]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">{t('customers.totalPurchases')}:</span>
                    <span className="font-bold text-primary">₹{customer["Total Purchases"]?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">{t('customers.lastVisit')}:</span>
                    <span>{customer["Last Visit"]}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-3 border-t">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleViewHistory(customer["Customer ID"])}
                  >
                    {t('customers.viewHistory')}
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleNewSale(customer["Customer ID"])}
                  >
                    {t('customers.newSale')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && !isLoadingCustomers && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('customers.noCustomers')}</p>
        </div>
      )}
    </div>
  );
}
