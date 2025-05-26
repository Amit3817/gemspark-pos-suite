
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ProductCatalog() {
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    {
      id: "PRD-001",
      name: "Diamond Solitaire Ring",
      category: "Rings",
      metal: "18K Gold",
      gemstone: "Diamond",
      weight: "3.2g",
      price: "₹45,000",
      stock: 12,
      image: "💍"
    },
    {
      id: "PRD-002",
      name: "Pearl Necklace Set",
      category: "Necklaces",
      metal: "Silver",
      gemstone: "Pearl",
      weight: "25.8g",
      price: "₹18,500",
      stock: 8,
      image: "📿"
    },
    {
      id: "PRD-003",
      name: "Emerald Earrings",
      category: "Earrings",
      metal: "22K Gold",
      gemstone: "Emerald",
      weight: "5.4g",
      price: "₹32,000",
      stock: 6,
      image: "💚"
    },
    {
      id: "PRD-004",
      name: "Silver Bracelet",
      category: "Bracelets",
      metal: "Sterling Silver",
      gemstone: "None",
      weight: "15.2g",
      price: "₹8,750",
      stock: 15,
      image: "🔗"
    },
    {
      id: "PRD-005",
      name: "Ruby Pendant",
      category: "Pendants",
      metal: "18K Gold",
      gemstone: "Ruby",
      weight: "4.1g",
      price: "₹28,500",
      stock: 4,
      image: "❤️"
    },
    {
      id: "PRD-006",
      name: "Wedding Band Set",
      category: "Rings",
      metal: "Platinum",
      gemstone: "Diamond",
      weight: "8.7g",
      price: "₹65,000",
      stock: 10,
      image: "💎"
    }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.metal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockBadge = (stock: number) => {
    if (stock <= 5) return <Badge variant="destructive">Low Stock</Badge>;
    if (stock <= 10) return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Medium</Badge>;
    return <Badge variant="outline" className="border-green-500 text-green-600">In Stock</Badge>;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">Product Catalog</h2>
        <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary w-full sm:w-auto">
          Add New Product
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <Input
          placeholder="Search products, categories, metals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-md"
        />
        <div className="flex gap-2 sm:gap-4">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">Filter by Category</Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">Filter by Metal</Button>
        </div>
      </div>

      {/* Products Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0">{product.image}</span>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base md:text-lg leading-tight truncate">{product.name}</CardTitle>
                    <p className="text-xs md:text-sm text-muted-foreground">{product.id}</p>
                  </div>
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
                    <span className="font-medium text-muted-foreground">Category:</span>
                    <span className="text-right">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">Metal:</span>
                    <span className="text-right">{product.metal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">Gemstone:</span>
                    <span className="text-right">{product.gemstone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">Weight:</span>
                    <span className="text-right">{product.weight}</span>
                  </div>
                </div>
                
                <div className="pt-3 border-t mt-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-lg md:text-xl font-bold text-primary">{product.price}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{product.stock} in stock</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none">Edit</Button>
                      <Button size="sm" className="flex-1 sm:flex-none">Add to Sale</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your search.</p>
        </div>
      )}
    </div>
  );
}
