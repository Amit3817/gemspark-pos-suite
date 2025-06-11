import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/components/ui/use-toast";
import { Customer } from "@/services/supabaseApi";
import { Search, UserPlus, History, ShoppingCart } from "lucide-react";

export default function Customers() {
  const { t } = useLanguage();
  const { customers, isLoadingCustomers, refreshData, setShowAddCustomerModal } = useAppContext();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  console.log('Customers component - data:', customers);

  const filteredCustomers = customers
    .filter((customer: Customer) => {
      const searchLower = searchQuery.toLowerCase();
      const name = customer["Name"]?.toLowerCase() || '';
      const phone = customer["Phone"]?.toString() || '';
      const email = customer["Email"]?.toLowerCase() || '';
      
      return name.includes(searchLower) ||
             phone.includes(searchQuery) ||
             email.includes(searchLower);
    })
    .sort((a: Customer, b: Customer) => {
      const nameA = a["Name"]?.toLowerCase() || '';
      const nameB = b["Name"]?.toLowerCase() || '';
      return nameA.localeCompare(nameB);
    });

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
    setShowAddCustomerModal(true);
  };

  const handleViewHistory = (customerId: string) => {
    toast({
      title: t('customers.customerHistory'),
      description: `${t('customers.viewingHistory')} ${customerId}`,
    });
    console.log('Viewing customer history:', customerId);
  };

  const handleNewSale = (customerId: string) => {
    toast({
      title: t('customers.newSale'),
      description: `${t('customers.startingNewSale')} ${customerId}`,
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
          <p className="text-muted-foreground">{t('customers.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-primary">{t('customers.title')}</h2>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={refreshData}
            className="hover:bg-gray-100"
          >
            {t('common.refresh')}
          </Button>
          <Button 
            onClick={handleAddNew}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary shadow-sm"
          >
            {t('customers.addNew')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            key: "total-customers",
            title: t('customers.totalCustomers'),
            value: totalCustomers,
            description: t('customers.totalRegistered'),
            icon: "👥",
            className: "hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-gray-50"
          },
          {
            key: "vip-customers",
            title: t('customers.vipCustomers'),
            value: vipCustomers,
            description: t('customers.premiumCustomers'),
            icon: "👑",
            className: "hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-yellow-50",
            valueClassName: "text-yellow-600"
          },
          {
            key: "new-customers",
            title: t('customers.newThisMonth'),
            value: newCustomers,
            description: t('customers.newRegistrations'),
            icon: "🆕",
            className: "hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-green-50",
            valueClassName: "text-green-600"
          }
        ].map(stat => (
          <Card key={stat.key} className={stat.className}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <span className="text-2xl">{stat.icon}</span>
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.valueClassName || ''}`}>{stat.value}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Export */}
      <Card key="search-export" className="border-0 bg-gradient-to-br from-white to-gray-50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder={t('customers.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:max-w-md bg-white"
            />
            <Button 
              variant="outline"
              className="hover:bg-gray-100"
            >
              {t('customers.exportList')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map((customer: Customer, index: number) => {
          const customerId = customer["Customer ID"] || `customer-${index}`;
          return (
            <div key={customerId} className="customer-card-wrapper">
              <Card 
                className="hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{customer["Name"]}</CardTitle>
                      <p className="text-sm text-muted-foreground">{customerId}</p>
                    </div>
                    {getStatusBadge(customer["Status"])}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="font-medium text-muted-foreground">{t('customers.phone')}:</span>
                        <p className="font-medium">{customer["Phone"] || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="font-medium text-muted-foreground">{t('customers.email')}:</span>
                        <p className="truncate font-medium">{customer["Email"] || 'N/A'}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="font-medium text-muted-foreground">{t('customers.totalPurchases')}:</span>
                        <p className="font-bold text-primary">₹{customer["Total Purchases"]?.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="font-medium text-muted-foreground">{t('customers.lastVisit')}:</span>
                        <p className="font-medium">{customer["Last Visit"] || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 hover:bg-gray-100"
                        onClick={() => handleViewHistory(customerId)}
                      >
                        {t('customers.viewHistory')}
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 shadow-sm"
                        onClick={() => handleNewSale(customerId)}
                      >
                        {t('customers.newSale')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {filteredCustomers.length === 0 && !isLoadingCustomers && (
        <Card key="no-customers" className="border-0 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground text-lg">{t('customers.noCustomers')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
