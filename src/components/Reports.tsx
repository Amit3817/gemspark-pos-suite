
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Reports() {
  const { t } = useLanguage();

  const reportTypes = [
    {
      title: t('reports.salesReport'),
      description: "Daily, weekly, and monthly sales analysis",
      icon: "📈",
      period: "Last 30 days"
    },
    {
      title: t('reports.inventoryReport'),
      description: "Stock levels and inventory valuation",
      icon: "📦",
      period: "Current stock"
    },
    {
      title: t('reports.customerReport'),
      description: "Customer purchase patterns and preferences",
      icon: "👥",
      period: "Last 6 months"
    },
    {
      title: "GST Report",
      description: "Tax calculations and compliance reports",
      icon: "🧾",
      period: "Financial year"
    },
    {
      title: "Profit Analysis",
      description: "Margin analysis and profitability insights",
      icon: "💰",
      period: "Quarterly"
    },
    {
      title: "Employee Performance",
      description: "Staff sales performance and productivity",
      icon: "⭐",
      period: "Monthly"
    }
  ];

  const quickStats = [
    { label: t('dashboard.todaySales'), value: "₹45,230", change: "+12.5%" },
    { label: t('reports.thisMonth'), value: "₹8,45,670", change: "+8.2%" },
    { label: t('reports.thisQuarter'), value: "₹24,56,890", change: "+15.6%" },
    { label: t('reports.thisYear'), value: "₹89,45,670", change: "+22.1%" }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">{t('reports.title')}</h2>
        <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary w-full sm:w-auto">
          {t('reports.custom')} Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {reportTypes.map((report, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{report.icon}</span>
                <div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{report.period}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">{t('common.view')}</Button>
                <Button size="sm" className="flex-1">{t('reports.generateReport')}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Monthly Sales Report - December 2024", date: "2024-01-01", type: "Sales", size: "2.4 MB" },
              { name: "Inventory Valuation Report", date: "2023-12-28", type: "Inventory", size: "1.8 MB" },
              { name: "GST Summary - Q4 2023", date: "2023-12-25", type: "Tax", size: "892 KB" },
              { name: "Customer Analysis Report", date: "2023-12-20", type: "Customer", size: "3.1 MB" }
            ].map((report, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3">
                <div className="flex-1">
                  <h4 className="font-medium">{report.name}</h4>
                  <p className="text-sm text-muted-foreground">{report.type} • {report.date} • {report.size}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Download</Button>
                  <Button size="sm" variant="outline">Share</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
