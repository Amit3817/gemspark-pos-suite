import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, TrendingUp, DollarSign, Package, Users, FileText, AlertTriangle } from "lucide-react";
import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppContext } from "@/contexts/AppContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
import { Paper, Typography, Box, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled MUI components with Tailwind classes
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '0.5rem',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.3s ease-in-out'
  }
}));

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("sales");
  const [dateRange, setDateRange] = useState("month");
  const [showSuccess, setShowSuccess] = useState(false);
  const { t } = useLanguage();
  const { bills, products, customers, inventory } = useAppContext();

  // Date range calculations
  const getDateRange = useMemo(() => {
    const now = new Date();
    const ranges = {
      week: new Date(now.setDate(now.getDate() - 7)),
      month: new Date(now.setMonth(now.getMonth() - 1)),
      quarter: new Date(now.setMonth(now.getMonth() - 3)),
      year: new Date(now.setFullYear(now.getFullYear() - 1))
    };
    return ranges[dateRange as keyof typeof ranges];
  }, [dateRange]);

  // Filter data based on date range
  const filteredBills = useMemo(() => {
    return bills.filter(bill => new Date(bill.Date) >= getDateRange);
  }, [bills, getDateRange]);

  // Calculate metrics
  const metrics = useMemo(() => {
    // Sales metrics
    const totalSales = filteredBills.reduce((sum, bill) => sum + (bill["Total Amount"] || 0), 0);
    const totalGST = filteredBills.reduce((sum, bill) => sum + ((bill["Total Amount"] || 0) * (bill["GST (%)"] || 0) / 100), 0);
    const totalMakingCharges = filteredBills.reduce((sum, bill) => sum + (bill["Making Charges"] || 0), 0);
    
    // Product metrics
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => (p.Quantity || 0) < 5).length;
    const outOfStockProducts = products.filter(p => (p.Quantity || 0) === 0).length;
    
    // Customer metrics
    const totalCustomers = customers.length;
    const newCustomers = customers.filter(c => new Date(c["Last Visit"]) >= getDateRange).length;
    const repeatCustomers = customers.filter(c => 
      filteredBills.filter(b => b["Customer Name"] === c.Name).length > 1
    ).length;

    // Inventory metrics
    const inventoryValue = inventory.reduce((sum, item) => 
      sum + ((item["Weight (g)"] || 0) * (item["Rate per g"] || 0)), 0
    );

    // Sales by metal type
    const salesByMetal = products.reduce((acc: { [key: string]: number }, product) => {
      const metalType = product["Metal Type"] || 'Other';
      acc[metalType] = (acc[metalType] || 0) + filteredBills
        .filter(bill => bill["Product ID"] === product["Product ID"])
        .reduce((sum, bill) => sum + (bill["Total Amount"] || 0), 0);
      return acc;
    }, {});

    // Sales trend
    const salesTrend = filteredBills.reduce((acc: { [key: string]: number }, bill) => {
      const date = new Date(bill.Date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + (bill["Total Amount"] || 0);
      return acc;
    }, {});

    return {
      sales: {
        total: totalSales,
        gst: totalGST,
        makingCharges: totalMakingCharges,
        byMetal: salesByMetal,
        trend: Object.entries(salesTrend).map(([date, amount]) => ({ date, amount }))
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts,
        outOfStock: outOfStockProducts
      },
      customers: {
        total: totalCustomers,
        new: newCustomers,
        repeat: repeatCustomers
      },
      inventory: {
        value: inventoryValue
      }
    };
  }, [filteredBills, products, customers, inventory, getDateRange]);

  // Prepare chart data
  const chartData = useMemo(() => {
    switch (selectedReport) {
      case 'sales':
        return {
          bar: Object.entries(metrics.sales.byMetal).map(([metal, sales]) => ({
            name: metal,
            sales: sales
          })),
          line: metrics.sales.trend,
          pie: Object.entries(metrics.sales.byMetal).map(([metal, sales]) => ({
            name: metal,
            value: sales
          }))
        };
      case 'inventory':
        return {
          bar: products.map(p => ({
            name: p["Product Name"],
            stock: p.Quantity || 0
          })),
          pie: products.map(p => ({
            name: p["Product Name"],
            value: (p.Quantity || 0) * (p["Rate per g"] || 0)
          }))
        };
      case 'customer':
        return {
          bar: customers.map(c => ({
            name: c.Name,
            purchases: filteredBills.filter(b => b["Customer Name"] === c.Name).length
          })),
          pie: [
            { name: 'New', value: metrics.customers.new },
            { name: 'Repeat', value: metrics.customers.repeat }
          ]
        };
      default:
        return {
          bar: [],
          line: [],
          pie: []
        };
    }
  }, [selectedReport, metrics, products, customers, filteredBills]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const handleGenerateReport = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleViewReport = () => {
    // TODO: Implement report viewing logic
    console.log(`Viewing ${selectedReport} report`);
  };

  // MUI DataGrid columns
  const salesColumns: GridColDef[] = [
    { field: 'date', headerName: t('reports.table.date'), flex: 1 },
    { field: 'customer', headerName: t('reports.table.customer'), flex: 1 },
    { field: 'product', headerName: t('reports.table.product'), flex: 1 },
    { 
      field: 'amount', 
      headerName: t('reports.table.amount'), 
      flex: 1,
      renderCell: (params) => `₹${params.value.toLocaleString()}`
    },
    { 
      field: 'gst', 
      headerName: t('reports.table.gst'), 
      flex: 1,
      renderCell: (params) => `₹${params.value.toLocaleString()}`
    },
    { 
      field: 'makingCharges', 
      headerName: t('reports.table.makingCharges'), 
      flex: 1,
      renderCell: (params) => `₹${params.value.toLocaleString()}`
    }
  ];

  // Transform data for MUI DataGrid
  const salesRows = filteredBills.map((bill, index) => ({
    id: index,
    date: new Date(bill.Date).toLocaleDateString(),
    customer: bill["Customer Name"],
    product: bill["Product Name"],
    amount: bill["Total Amount"],
    gst: (bill["Total Amount"] * (bill["GST (%)"] || 0)) / 100,
    makingCharges: bill["Making Charges"]
  }));

  return (
    <div className="space-y-6">
      {/* Header and Controls - Using Tailwind and shadcn/ui */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-primary">{t('reports.title')}</h2>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={handleViewReport}
            className="text-sm"
          >
            {t('reports.viewReport')}
          </Button>
          <Button 
            onClick={handleGenerateReport}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary text-sm"
          >
            <FileText className="w-4 h-4 mr-2" />
            {t('reports.generateReport')}
          </Button>
        </div>
      </div>

      {/* Report Controls - Using shadcn/ui with Tailwind */}
      <Card className="border-2 border-yellow-300 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            📊 {t('reports.settings')}
            <Badge variant="secondary" className="ml-auto">{t('reports.type')}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Using shadcn/ui Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">{t('reports.type')}</label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">{t('reports.types.sales')}</SelectItem>
                  <SelectItem value="inventory">{t('reports.types.inventory')}</SelectItem>
                  <SelectItem value="customer">{t('reports.types.customer')}</SelectItem>
                  <SelectItem value="financial">{t('reports.types.financial')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Using MUI DatePicker */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">{t('reports.dateRange')}</label>
              <DatePicker
                className="w-full bg-white rounded-md"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small"
                  }
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards - Using shadcn/ui with Tailwind */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sales Stats */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('reports.stats.totalSales')}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{metrics.sales.total.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              {t('reports.stats.salesIncrease')}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('reports.stats.totalGST')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{metrics.sales.gst.toLocaleString()}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              {t('reports.stats.gstCollected')}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('reports.stats.makingCharges')}
            </CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{metrics.sales.makingCharges.toLocaleString()}</div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              {t('reports.stats.totalMakingCharges')}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('reports.stats.totalProducts')}
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.products.total}</div>
            <p className="text-xs text-purple-600 flex items-center mt-1">
              {t('reports.stats.allProductsAvailable')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - Using shadcn/ui with Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Metal Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              {t('reports.charts.salesByMetal')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.bar}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="sales" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sales Trend Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {t('reports.charts.salesTrend')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.line}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#8884d8' }}
                    activeDot={{ r: 6, fill: '#8884d8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stock Levels Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              {t('reports.charts.stockLevels')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.bar}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="stock" fill="#00C49F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer Purchases Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t('reports.charts.customerPurchases')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.pie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.pie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Data Table - Using MUI DataGrid */}
      <StyledPaper>
        <Typography variant="h6" className="mb-4">
          {t('reports.data')}
        </Typography>
        <Box className="h-[400px] w-full">
          <DataGrid
            rows={salesRows}
            columns={salesColumns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
            className="bg-white rounded-lg"
          />
        </Box>
      </StyledPaper>

      {/* Success Message - Using MUI Snackbar */}
      {showSuccess && (
        <Box
          className="fixed bottom-4 right-4"
          sx={{
            backgroundColor: 'success.light',
            color: 'success.contrastText',
            padding: 2,
            borderRadius: 1,
            boxShadow: 3
          }}
        >
          <Typography variant="body2">
            {t('reports.success')}
          </Typography>
        </Box>
      )}
    </div>
  );
}
