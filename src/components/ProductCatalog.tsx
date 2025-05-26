
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-primary">Product Catalog</h2>
        <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary">
          Add New Product
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <Input
          placeholder="Search products, categories, metals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Button variant="outline">Filter by Category</Button>
        <Button variant="outline">Filter by Metal</Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{product.image}</span>
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{product.id}</p>
                  </div>
                </div>
                {getStockBadge(product.stock)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Category:</span>
                    <p className="text-muted-foreground">{product.category}</p>
                  </div>
                  <div>
                    <span className="font-medium">Metal:</span>
                    <p className="text-muted-foreground">{product.metal}</p>
                  </div>
                  <div>
                    <span className="font-medium">Gemstone:</span>
                    <p className="text-muted-foreground">{product.gemstone}</p>
                  </div>
                  <div>
                    <span className="font-medium">Weight:</span>
                    <p className="text-muted-foreground">{product.weight}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-2xl font-bold text-primary">{product.price}</p>
                    <p className="text-sm text-muted-foreground">{product.stock} in stock</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm">Add to Sale</Button>
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
