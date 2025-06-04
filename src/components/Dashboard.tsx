import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";

export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { 
    products, 
    bills, 
    customers,
    isLoadingProducts,
    isLoadingBills,
    isLoadingCustomers,
    setShowAddProductModal, 
    exportData 
  } = useAppContext();

  console.log('Dashboard - Products:', products);
  console.log('Dashboard - Bills:', bills);
  console.log('Dashboard - Customers:', customers);

  // Calculate real stats from centralized data
  const totalProducts = products.length;
  const lowStockItems = products.filter(product => product["Quantity"] <= 5);
  const lowStockCount = lowStockItems.length;

  // Calculate today's sales from bills data
  const todaySales = bills.reduce((total, bill) => {
    const amount = typeof bill["Total Amount"] === 'number' ? bill["Total Amount"] : 0;
    return total + amount;
  }, 0);

  const totalCustomers = customers.length;

  const stats = [
    { title: t('dashboard.todaySales'), value: `₹${todaySales.toLocaleString()}`, change: "+12.5%", color: "text-green-600" },
    { title: t('dashboard.totalProducts'), value: totalProducts.toString(), change: "+3.2%", color: "text-blue-600" },
    { title: t('dashboard.lowStock'), value: lowStockCount.toString(), change: `+${lowStockCount} items`, color: "text-yellow-600" },
    { title: t('dashboard.totalCustomers'), value: totalCustomers.toString(), change: "+8.1%", color: "text-purple-600" },
  ];

  const marketPrices = [
    { 
      metal: t('dashboard.goldPrice'), 
      price: "₹6,890", 
      change: "+2.3%", 
      changeColor: "text-green-600",
      bgColor: "bg-gradient-to-r from-yellow-100 to-yellow-200",
      icon: "🟡"
    },
    { 
      metal: t('dashboard.silverPrice'), 
      price: "₹850", 
      change: "-1.2%", 
      changeColor: "text-red-600",
      bgColor: "bg-gradient-to-r from-gray-100 to-gray-200",
      icon: "⚪"
    }
  ];

  // Process recent sales from real bills data
  const recentSales = bills.slice(0, 3).map(bill => ({
    id: bill["Bill No"] || `BILL-${Math.random().toString(36).substr(2, 9)}`,
    customer: bill["Customer Name"] || 'Unknown Customer',
    amount: `₹${(bill["Total Amount"] || 0).toLocaleString()}`,
    time: new Date().toLocaleTimeString()
  }));

  if (isLoadingProducts || isLoadingBills || isLoadingCustomers) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-primary">{t('dashboard.title')}</h2>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={exportData}>{t('common.export')} {t('reports.title')}</Button>
          <Button 
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary"
            onClick={() => navigate('/billing')}
          >
            {t('customers.newSale')}
          </Button>
        </div>
      </div>

      {/* Market Prices Section */}
      <Card className="border-2 border-yellow-300 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            📈 {t('dashboard.marketPrices')}
            <Badge variant="secondary" className="ml-auto animate-pulse">LIVE</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketPrices.map((price, index) => (
              <div key={index} className={`${price.bgColor} p-4 rounded-lg border-2 border-yellow-200`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{price.icon}</span>
                    <div>
                      <h4 className="font-semibold text-lg">{price.metal}</h4>
                      <p className="text-sm text-gray-600">{t('dashboard.per10Grams')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{price.price}</p>
                    <p className={`text-sm font-medium ${price.changeColor}`}>
                      {price.change}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            {t('dashboard.lastUpdated')}: {new Date().toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.color} flex items-center mt-1`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {t('dashboard.recentSales')}
              <Button variant="ghost" size="sm" onClick={() => navigate('/bills')}>{t('common.view')} {t('common.all')}</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.length > 0 ? (
                recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{sale.customer}</p>
                      <p className="text-sm text-muted-foreground">{sale.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{sale.amount}</p>
                      <p className="text-sm text-muted-foreground">{sale.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No recent sales data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {t('dashboard.lowStock')} {t('common.alert')}
              <Button variant="ghost" size="sm" onClick={() => navigate('/products')}>{t('common.manage')}</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.length > 0 ? (
                lowStockItems.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item["Product Name"]}</p>
                      <p className="text-sm text-muted-foreground">{item["Category"]}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-600">{item["Quantity"]} {t('common.left')}</p>
                      <Button size="sm" variant="outline" className="mt-1" onClick={() => navigate('/products')}>
                        {t('inventory.restock')}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No low stock items</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('common.quickActions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2"
              onClick={() => setShowAddProductModal(true)}
            >
              <span className="text-2xl">💍</span>
              <span>{t('products.addNew')}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2"
              onClick={() => navigate('/customers')}
            >
              <span className="text-2xl">👤</span>
              <span>{t('customers.addNew')}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2"
              onClick={() => navigate('/billing')}
            >
              <span className="text-2xl">🧾</span>
              <span>{t('common.generateBill')}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2"
              onClick={() => navigate('/reports')}
            >
              <span className="text-2xl">📊</span>
              <span>{t('common.viewReports')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
