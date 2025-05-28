import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProductCatalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { t } = useLanguage();

  const categories = [
    { id: "All", name: t('products.categories.all') },
    { id: "Rings", name: t('products.categories.rings') },
    { id: "Necklaces", name: t('products.categories.necklaces') },
    { id: "Earrings", name: t('products.categories.earrings') },
    { id: "Bracelets", name: t('products.categories.bracelets') },
    { id: "Pendants", name: t('products.categories.pendants') }
  ];

  const products = [
    {
      id: "PRD-001",
      name: t('products.items.goldRing'),
      category: "Rings",
      metal: t('products.metals.18kGold'),
      gemstone: t('products.gemstones.ruby'),
      weight: "3.2g",
      price: "₹35,000",
      stock: 12,
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop"
    },
    {
      id: "PRD-002",
      name: t('products.items.pearlNecklace'),
      category: "Necklaces",
      metal: t('products.metals.silver'),
      gemstone: t('products.gemstones.pearl'),
      weight: "25.8g",
      price: "₹18,500",
      stock: 8,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop"
    },
    {
      id: "PRD-003",
      name: t('products.items.emeraldEarrings'),
      category: "Earrings",
      metal: t('products.metals.22kGold'),
      gemstone: t('products.gemstones.emerald'),
      weight: "5.4g",
      price: "₹32,000",
      stock: 6,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop"
    },
    {
      id: "PRD-004",
      name: t('products.items.silverBracelet'),
      category: "Bracelets",
      metal: t('products.metals.sterlingSilver'),
      gemstone: t('common.none'),
      weight: "15.2g",
      price: "₹8,750",
      stock: 15,
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&h=300&fit=crop"
    },
    {
      id: "PRD-005",
      name: t('products.items.rubyPendant'),
      category: "Pendants",
      metal: t('products.metals.18kGold'),
      gemstone: t('products.gemstones.ruby'),
      weight: "4.1g",
      price: "₹28,500",
      stock: 4,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop"
    },
    {
      id: "PRD-006",
      name: t('products.items.weddingBand'),
      category: "Rings",
      metal: t('products.metals.platinum'),
      gemstone: t('common.none'),
      weight: "8.7g",
      price: "₹65,000",
      stock: 10,
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop"
    },
    {
      id: "PRD-007",
      name: t('products.items.goldChain'),
      category: "Necklaces",
      metal: t('products.metals.22kGold'),
      gemstone: t('common.none'),
      weight: "12.3g",
      price: "₹35,200",
      stock: 7,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop"
    },
    {
      id: "PRD-008",
      name: t('products.items.sapphireEarrings'),
      category: "Earrings",
      metal: t('products.metals.18kGold'),
      gemstone: t('products.gemstones.sapphire'),
      weight: "4.8g",
      price: "₹29,800",
      stock: 5,
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop"
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.metal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockBadge = (stock: number) => {
    if (stock <= 5) return <Badge variant="destructive">{t('products.stockStatus.low')}</Badge>;
    if (stock <= 10) return <Badge variant="outline" className="border-yellow-500 text-yellow-600">{t('products.stockStatus.medium')}</Badge>;
    return <Badge variant="outline" className="border-green-500 text-green-600">{t('products.stockStatus.inStock')}</Badge>;
  };

  const productsByCategory = selectedCategory === "All" 
    ? categories.slice(1).map(category => ({
        ...category,
        products: filteredProducts.filter(product => product.category === category.id)
      }))
    : [{
        id: selectedCategory,
        name: categories.find(cat => cat.id === selectedCategory)?.name || selectedCategory,
        products: filteredProducts
      }];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">{t('products.title')}</h2>
        <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary w-full sm:w-auto">
          {t('products.addNew')}
        </Button>
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
              {category.products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow flex flex-col h-full">
                  <CardHeader className="pb-3">
                    <div className="aspect-square w-full mb-3 overflow-hidden rounded-lg bg-gray-100">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base md:text-lg leading-tight">{product.name}</CardTitle>
                        <p className="text-xs md:text-sm text-muted-foreground">{product.id}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {getStockBadge(product.stock)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <div className="space-y-3 flex-1">
                      <div className="grid grid-cols-1 gap-2 text-xs md:text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium text-muted-foreground">{t('products.fields.category')}:</span>
                          <span className="text-right">{t(`products.categories.${product.category.toLowerCase()}`)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-muted-foreground">{t('products.fields.metal')}:</span>
                          <span className="text-right">{product.metal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-muted-foreground">{t('products.fields.gemstone')}:</span>
                          <span className="text-right">{product.gemstone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-muted-foreground">{t('products.fields.weight')}:</span>
                          <span className="text-right">{product.weight}</span>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t mt-auto">
                        <div className="space-y-3">
                          <div>
                            <p className="text-lg md:text-xl font-bold text-primary">{product.price}</p>
                            <p className="text-xs md:text-sm text-muted-foreground">{product.stock} {t('products.inStock')}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button size="sm" variant="outline" className="w-full text-xs">{t('products.actions.edit')}</Button>
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

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('products.noProducts')}</p>
        </div>
      )}
    </div>
  );
}
