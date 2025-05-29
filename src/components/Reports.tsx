
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
  const { t } = useLanguage();
  const { exportData } = useAppContext();
  const { toast } = useToast();

  const reportTypes = [
    {
      title: t('reports.salesReport'),
      description: t('reports.salesDescription'),
      icon: "📈",
      period: t('reports.last30Days')
    },
    {
      title: t('reports.inventoryReport'),
      description: t('reports.inventoryDescription'),
      icon: "📦",
      period: t('reports.currentStock')
    },
    {
      title: t('reports.customerReport'),
      description: t('reports.customerDescription'),
      icon: "👥",
      period: t('reports.last6Months')
    },
    {
      title: t('reports.gstReport'),
      description: t('reports.gstDescription'),
      icon: "🧾",
      period: t('reports.financialYear')
    },
    {
      title: t('reports.profitAnalysis'),
      description: t('reports.profitDescription'),
      icon: "💰",
      period: t('reports.quarterly')
    },
    {
      title: t('reports.employeePerformance'),
      description: t('reports.employeeDescription'),
      icon: "⭐",
      period: t('reports.monthly')
    }
  ];

  const quickStats = [
    { label: t('dashboard.todaySales'), value: "₹45,230", change: "+12.5%" },
    { label: t('reports.thisMonth'), value: "₹8,45,670", change: "+8.2%" },
    { label: t('reports.thisQuarter'), value: "₹24,56,890", change: "+15.6%" },
    { label: t('reports.thisYear'), value: "₹89,45,670", change: "+22.1%" }
  ];

  const recentReports = [
    { name: t('sampleData.reports.monthlySales'), date: "2024-01-01", type: t('sampleData.reportTypes.sales'), size: "2.4 MB" },
    { name: t('sampleData.reports.inventoryValuation'), date: "2023-12-28", type: t('sampleData.reportTypes.inventory'), size: "1.8 MB" },
    { name: t('sampleData.reports.gstSummary'), date: "2023-12-25", type: t('sampleData.reportTypes.tax'), size: "892 KB" },
    { name: t('sampleData.reports.customerAnalysis'), date: "2023-12-20", type: t('sampleData.reportTypes.customer'), size: "3.1 MB" }
  ];

  const handleViewReport = (reportTitle: string) => {
    toast({
      title: "Viewing Report",
      description: `Opening ${reportTitle}`,
    });
    console.log('Viewing report:', reportTitle);
  };

  const handleGenerateReport = (reportTitle: string) => {
    toast({
      title: "Generating Report",
      description: `Generating ${reportTitle}...`,
    });
    console.log('Generating report:', reportTitle);
  };

  const handleCustomReport = () => {
    toast({
      title: "Custom Report",
      description: "Opening custom report builder",
    });
    console.log('Opening custom report builder');
  };

  const handleDownload = (reportName: string) => {
    toast({
      title: "Downloading",
      description: `Downloading ${reportName}`,
    });
    console.log('Downloading report:', reportName);
  };

  const handleShare = (reportName: string) => {
    toast({
      title: "Sharing",
      description: `Sharing ${reportName}`,
    });
    console.log('Sharing report:', reportName);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">{t('reports.title')}</h2>
        <Button 
          onClick={handleCustomReport}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary w-full sm:w-auto"
        >
          {t('reports.custom')} {t('reports.title')}
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
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleViewReport(report.title)}
                >
                  {t('common.view')}
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleGenerateReport(report.title)}
                >
                  {t('reports.generateReport')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>{t('reports.recentReports')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3">
                <div className="flex-1">
                  <h4 className="font-medium">{report.name}</h4>
                  <p className="text-sm text-muted-foreground">{report.type} • {report.date} • {report.size}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDownload(report.name)}
                  >
                    {t('common.download')}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleShare(report.name)}
                  >
                    {t('common.share')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
