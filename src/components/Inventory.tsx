
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Inventory() {
  const inventoryItems = [
    { id: "INV-001", name: "Gold Rings", category: "Rings", currentStock: 45, minStock: 20, maxStock: 100, status: "adequate" },
    { id: "INV-002", name: "Diamond Earrings", category: "Earrings", currentStock: 8, minStock: 15, maxStock: 50, status: "low" },
    { id: "INV-003", name: "Silver Necklaces", category: "Necklaces", currentStock: 32, minStock: 25, maxStock: 75, status: "adequate" },
    { id: "INV-004", name: "Pearl Sets", category: "Sets", currentStock: 3, minStock: 10, maxStock: 30, status: "critical" },
    { id: "INV-005", name: "Platinum Bands", category: "Rings", currentStock: 67, minStock: 20, maxStock: 80, status: "adequate" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "low":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Low Stock</Badge>;
      case "adequate":
        return <Badge variant="outline" className="border-green-500 text-green-600">Adequate</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const criticalItems = inventoryItems.filter(item => item.status === "critical").length;
  const lowStockItems = inventoryItems.filter(item => item.status === "low").length;
  const totalItems = inventoryItems.length;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">Inventory Management</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 sm:flex-none">Import Stock</Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary flex-1 sm:flex-none">
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Items */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{item.name}</h3>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.category} • {item.id}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold">{item.currentStock}</p>
                    <p className="text-xs text-muted-foreground">Current Stock</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{item.minStock} - {item.maxStock}</p>
                    <p className="text-xs text-muted-foreground">Min - Max</p>
                  </div>
                  <Button size="sm" variant="outline">Update</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
