
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { googleSheetsApi, InventoryItem } from "@/services/googleSheetsApi";
import { useEffect } from "react";

export default function Inventory() {
  const { t } = useLanguage();
  const { importData, exportData, refreshData, updateInventory } = useAppContext();
  const { toast } = useToast();

  const { data: inventoryItems = [], isLoading, error, refetch } = useQuery({
    queryKey: ['inventory'],
    queryFn: googleSheetsApi.getAllInventory,
  });

  useEffect(() => {
    if (error) {
      console.error('Error loading inventory:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory from Google Sheets",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleAddNew = () => {
    toast({
      title: "Add New Item",
      description: "Opening form to add new inventory item",
    });
    console.log('Opening add new inventory item form');
  };

  const handleEdit = (itemId: string) => {
    toast({
      title: "Edit Item",
      description: `Editing inventory item ${itemId}`,
    });
    console.log('Editing item:', itemId);
  };

  const handleUpdateStock = async (item: InventoryItem) => {
    await updateInventory(item);
  };

  const getStatusBadge = (currentStock: number, minStock: number) => {
    if (currentStock <= minStock * 0.5) {
      return <Badge variant="destructive">{t('common.critical')}</Badge>;
    } else if (currentStock <= minStock) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-600">{t('products.stockStatus.low')}</Badge>;
    }
    return <Badge variant="outline" className="border-green-500 text-green-600">{t('common.adequate')}</Badge>;
  };

  const criticalItems = inventoryItems.filter((item: InventoryItem) => 
    item["Current Stock"] <= item["Min Stock"] * 0.5
  ).length;
  
  const lowStockItems = inventoryItems.filter((item: InventoryItem) => 
    item["Current Stock"] <= item["Min Stock"] && item["Current Stock"] > item["Min Stock"] * 0.5
  ).length;
  
  const totalItems = inventoryItems.length;

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex justify-center items-center py-12">
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">{t('inventory.title')}</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 sm:flex-none" onClick={refreshData}>
            Refresh Data
          </Button>
          <Button 
            onClick={handleAddNew}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary flex-1 sm:flex-none"
          >
            {t('inventory.addNew')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('inventory.totalItems')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('inventory.lowStockItems')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('common.critical')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Items */}
      <Card>
        <CardHeader>
          <CardTitle>{t('inventory.status')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventoryItems.map((item: InventoryItem) => (
              <div key={item["Item ID"]} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{item["Item Name"]}</h3>
                    {getStatusBadge(item["Current Stock"], item["Min Stock"])}
                  </div>
                  <p className="text-sm text-muted-foreground">{item["Category"]} • {item["Item ID"]}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold">{item["Current Stock"]}</p>
                    <p className="text-xs text-muted-foreground">{t('inventory.currentStock')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{item["Min Stock"]} - {item["Max Stock"]}</p>
                    <p className="text-xs text-muted-foreground">{t('inventory.minMax')}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(item["Item ID"])}
                    >
                      {t('common.edit')}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => handleUpdateStock(item)}
                    >
                      Update Stock
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {inventoryItems.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No inventory items found</p>
        </div>
      )}
    </div>
  );
}
