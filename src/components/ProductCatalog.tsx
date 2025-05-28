
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { googleSheetsApi, Product } from "@/services/googleSheetsApi";
import { useToast } from "@/hooks/use-toast";

export default function ProductCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { t } = useLanguage();
  const { toast } = useToast();

  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: googleSheetsApi.getAllProducts,
  });

  useEffect(() => {
    if (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: "Failed to load products from Google Sheets",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const categories = [
    { id: "All", name: t('products.categories.all') },
    { id: "Rings", name: t('products.categories.rings') },
    { id: "Necklaces", name: t('products.categories.necklaces') },
    { id: "Earrings", name: t('products.categories.earrings') },
    { id: "Bracelets", name: t('products.categories.bracelets') },
    { id: "Pendants", name: t('products.categories.pendants') }
  ];

  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product["Product Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product["Category"].toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product["Metal Type"].toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product["Category"] === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockBadge = (stock: number) => {
    if (stock <= 5) return <Badge variant="destructive">{t('products.stockStatus.low')}</Badge>;
    if (stock <= 10) return <Badge variant="outline" className="border-yellow-500 text-yellow-600">{t('products.stockStatus.medium')}</Badge>;
    return <Badge variant="outline" className="border-green-500 text-green-600">{t('products.stockStatus.inStock')}</Badge>;
  };

  const formatPrice = (weight: number, ratePerGram: number) => {
    const totalPrice = weight * ratePerGram;
    return `₹${totalPrice.toLocaleString()}`;
  };

  const getProductImage = (category: string) => {
    switch (category.toLowerCase()) {
      case 'rings':
        return "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop";
      case 'necklaces':
        return "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop";
      case 'earrings':
        return "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop";
      case 'bracelets':
        return "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&h=300&fit=crop";
      case 'pendants':
        return "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop";
      default:
        return "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop";
    }
  };

  const productsByCategory = selectedCategory === "All" 
    ? categories.slice(1).map(category => ({
        ...category,
        products: filteredProducts.filter((product: Product) => product["Category"] === category.id)
      }))
    : [{
        id: selectedCategory,
        name: categories.find(cat => cat.id === selectedCategory)?.name || selectedCategory,
        products: filteredProducts
      }];

  if (isLoading) {
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
          <Button variant="outline" onClick={() => refetch()}>
            Refresh Data
          </Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary w-full sm:w-auto">
            {t('products.addNew')}
          </Button>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col gap-4">
        <Input
          placeholder={t('products.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        
        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="text-xs"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Products by Category */}
      {productsByCategory.map((category) => (
        category.products.length > 0 && (
          <div key={category.id} className="space-y-4">
            {selectedCategory === "All" && (
              <h3 className="text-xl font-semibold text-primary border-b pb-2">{category.name}</h3>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.products.map((product: Product) => (
                <Card key={product["Product ID"]} className="hover:shadow-lg transition-shadow flex flex-col h-full">
                  <CardHeader className="pb-3">
                    <div className="aspect-square w-full mb-3 overflow-hidden rounded-lg bg-gray-100">
                      <img 
                        src={getProductImage(product["Category"])} 
                        alt={product["Product Name"]}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base md:text-lg leading-tight">{product["Product Name"]}</CardTitle>
                        <p className="text-xs md:text-sm text-muted-foreground">{product["Product ID"]}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {getStockBadge(product["Quantity"])}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <div className="space-y-3 flex-1">
                      <div className="grid grid-cols-1 gap-2 text-xs md:text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium text-muted-foreground">{t('products.fields.category')}:</span>
                          <span className="text-right">{product["Category"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-muted-foreground">{t('products.fields.metal')}:</span>
                          <span className="text-right">{product["Metal Type"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-muted-foreground">Carat:</span>
                          <span className="text-right">{product["Carat"]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-muted-foreground">{t('products.fields.weight')}:</span>
                          <span className="text-right">{product["Weight (g)"]}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-muted-foreground">Rate/g:</span>
                          <span className="text-right">₹{product["Rate per g"]}</span>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t mt-auto">
                        <div className="space-y-3">
                          <div>
                            <p className="text-lg md:text-xl font-bold text-primary">
                              {formatPrice(product["Weight (g)"], product["Rate per g"])}
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              {product["Quantity"]} {t('products.inStock')}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button size="sm" variant="outline" className="w-full text-xs">
                              {t('products.actions.edit')}
                            </Button>
                            <Button size="sm" className="w-full text-xs bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 break-words">
                              {t('products.actions.addToSale')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      ))}

      {filteredProducts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('products.noProducts')}</p>
        </div>
      )}
    </div>
  );
}
