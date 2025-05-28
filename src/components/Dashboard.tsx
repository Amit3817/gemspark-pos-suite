
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Dashboard() {
  const { t } = useLanguage();

  const stats = [
    { title: t('dashboard.todaySales'), value: "₹45,230", change: "+12.5%", color: "text-green-600" },
    { title: t('dashboard.totalProducts'), value: "1,247", change: "+3.2%", color: "text-blue-600" },
    { title: t('dashboard.lowStock'), value: "23", change: "+5 items", color: "text-yellow-600" },
    { title: t('dashboard.totalCustomers'), value: "892", change: "+8.1%", color: "text-purple-600" },
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

  const recentSales = [
    { id: "INV-001", customer: t('sampleData.customers.priyaSharma'), amount: "₹12,500", time: "10:30 AM" },
    { id: "INV-002", customer: t('sampleData.customers.rajeshKumar'), amount: "₹8,750", time: "11:15 AM" },
    { id: "INV-003", customer: t('sampleData.customers.anitaDesai'), amount: "₹25,000", time: "12:45 PM" },
  ];

  const lowStockItems = [
    { name: t('sampleData.items.goldRing18K'), stock: 3, category: t('sampleData.categories.rings') },
    { name: t('sampleData.items.emeraldEarrings'), stock: 1, category: t('sampleData.categories.earrings') },
    { name: t('sampleData.items.silverBracelet'), stock: 5, category: t('sampleData.categories.bracelets') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-primary">{t('dashboard.title')}</h2>
        <div className="flex space-x-3">
          <Button variant="outline">{t('common.export')} {t('reports.title')}</Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary">
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
              <Button variant="ghost" size="sm">{t('common.view')} {t('common.all')}</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {t('dashboard.lowStock')} {t('common.alert')}
              <Button variant="ghost" size="sm">{t('common.manage')}</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-600">{item.stock} {t('common.left')}</p>
                    <Button size="sm" variant="outline" className="mt-1">
                      {t('inventory.restock')}
                    </Button>
                  </div>
                </div>
              ))}
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
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <span className="text-2xl">💍</span>
              <span>{t('products.addNew')}</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <span className="text-2xl">👤</span>
              <span>{t('customers.addNew')}</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <span className="text-2xl">🧾</span>
              <span>{t('common.generateBill')}</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <span className="text-2xl">📊</span>
              <span>{t('common.viewReports')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
