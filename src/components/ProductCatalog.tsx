
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Product } from "@/services/supabaseApi";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/contexts/AppContext";

export default function ProductCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { t } = useLanguage();
  const { toast } = useToast();
  const { 
    products, 
    isLoadingProducts, 
    refreshData, 
    setShowAddProductModal, 
    setShowEditProductModal, 
    setEditingProduct,
    deleteProduct 
  } = useAppContext();

  console.log('ProductCatalog - products:', products);

  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product["Product Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.Category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product["Metal Type"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product["Product ID"].toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || product.Category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(products.map((p: Product) => p.Category)))];

  const getStockBadge = (quantity: number) => {
    if (quantity === 0) {
      return <Badge variant="destructive">{t('products.outOfStock')}</Badge>;
    } else if (quantity <= 5) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-600">{t('products.lowStock')}</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800 border-green-200">{t('products.inStock')}</Badge>;
    }
  };

  const handleAddNew = () => {
    setShowAddProductModal(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowEditProductModal(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId);
    }
  };

  const handleViewDetails = (productId: string) => {
    toast({
      title: "Product Details",
      description: `Viewing details for product ${productId}`,
    });
    console.log('Viewing product details:', productId);
  };

  const totalProducts = products.length;
  const inStockProducts = products.filter((p: Product) => p.Quantity > 0).length;
  const lowStockProducts = products.filter((p: Product) => p.Quantity > 0 && p.Quantity <= 5).length;

  if (isLoadingProducts) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex justify-center items-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">{t('products.title')}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData}>
            Refresh Data
          </Button>
          <Button 
            onClick={handleAddNew}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary w-full sm:w-auto"
          >
            {t('products.addNew')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('products.totalProducts')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('products.inStock')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{inStockProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('products.lowStock')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockProducts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder={t('products.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-md"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? t('products.allCategories') : category}
            </option>
          ))}
        </select>
        <Button variant="outline">{t('products.exportCatalog')}</Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {filteredProducts.map((product: Product) => (
          <Card key={product["Product ID"]} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{product["Product Name"]}</CardTitle>
                  <p className="text-sm text-muted-foreground">{product["Product ID"]}</p>
                </div>
                {getStockBadge(product.Quantity)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Product Image */}
                {product["Image URL"] && (
                  <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={product["Image URL"]} 
                      alt={product["Product Name"]}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">{t('products.category')}:</span>
                    <p className="truncate">{product.Category}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">{t('products.metalType')}:</span>
                    <p className="truncate">{product["Metal Type"] || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">{t('products.carat')}:</span>
                    <p>{product.Carat || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">{t('products.weight')}:</span>
                    <p>{product["Weight (g)"]}g</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">{t('products.stock')}:</span>
                    <p className="font-bold text-primary">{product.Quantity}</p>
                  </div>
                </div>
                
                {product.Notes && (
                  <div>
                    <span className="font-medium text-muted-foreground text-sm">{t('products.notes')}:</span>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.Notes}</p>
                  </div>
                )}
                
                <div className="flex gap-2 pt-3 border-t">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleViewDetails(product["Product ID"])}
                  >
                    {t('products.viewDetails')}
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEdit(product)}
                  >
                    {t('common.edit')}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDelete(product["Product ID"])}
                  >
                    {t('common.delete')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && !isLoadingProducts && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('products.noProducts')}</p>
        </div>
      )}
    </div>
  );
}
