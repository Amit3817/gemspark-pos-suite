
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Dashboard() {
  const { t } = useLanguage();

  const stats = [
    { title: t('dashboard.todaySales'), value: "₹45,230", change: "+12.5%", color: "text-green-600" },
    { title: t('dashboard.totalProducts'), value: "1,247", change: "+3.2%", color: "text-blue-600" },
    { title: t('dashboard.lowStock'), value: "23", change: "+5 items", color: "text-yellow-600" },
    { title: t('dashboard.totalCustomers'), value: "892", change: "+8.1%", color: "text-purple-600" },
  ];

  const recentSales = [
    { id: "INV-001", customer: "Priya Sharma", amount: "₹12,500", time: "10:30 AM" },
    { id: "INV-002", customer: "Rajesh Kumar", amount: "₹8,750", time: "11:15 AM" },
    { id: "INV-003", customer: "Anita Desai", amount: "₹25,000", time: "12:45 PM" },
  ];

  const lowStockItems = [
    { name: "Gold Ring 18K", stock: 3, category: "Rings" },
    { name: "Diamond Earrings", stock: 1, category: "Earrings" },
    { name: "Silver Bracelet", stock: 5, category: "Bracelets" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-primary">{t('dashboard.title')}</h2>
        <div className="flex space-x-3">
          <Button variant="outline">{t('common.export')} Report</Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary">
            New Sale
          </Button>
        </div>
      </div>

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
              <Button variant="ghost" size="sm">{t('common.view')} All</Button>
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
              {t('dashboard.lowStock')} Alert
              <Button variant="ghost" size="sm">Manage</Button>
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
                    <p className="font-bold text-yellow-600">{item.stock} left</p>
                    <Button size="sm" variant="outline" className="mt-1">
                      Restock
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
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <span className="text-2xl">💎</span>
              <span>Add Product</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <span className="text-2xl">👤</span>
              <span>New Customer</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <span className="text-2xl">🧾</span>
              <span>Generate Bill</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <span className="text-2xl">📊</span>
              <span>View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
