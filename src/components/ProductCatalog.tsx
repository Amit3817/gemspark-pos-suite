import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from "@/services/supabaseApi";
import { useToast } from "@/components/ui/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { ShoppingCart } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CartItem extends Product {
  cartQuantity: number;
}

export default function ProductCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
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

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product) => {
    if (product.Quantity <= 0) {
      toast({
        title: t('products.outOfStock', { productName: product["Product Name"] }),
        variant: 'destructive'
      });
      return;
    }
    const existingItem = cartItems.find(item => item["Product ID"] === product["Product ID"]);
    
    if (existingItem) {
      if (existingItem.cartQuantity >= product.Quantity) {
        toast({
          title: t('products.stockLimitReached', { productName: product["Product Name"] }),
          description: t('products.cannotAddMore', { quantity: product.Quantity }),
          variant: "destructive",
        });
        return;
      }
      setCartItems(cartItems.map(item =>
        item["Product ID"] === product["Product ID"]
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, cartQuantity: 1 }]);
    }
    
    toast({
      title: t('products.addedToCart'),
      description: `${product["Product Name"]} ${t('products.addedToCart').toLowerCase()}`,
    });
  };

  const removeFromCart = (productId: string) => {
    setItemToRemove(productId);
  };

  const confirmRemoveFromCart = () => {
    if (!itemToRemove) return;

    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item["Product ID"] !== itemToRemove);
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });

    toast({
      title: t('products.itemRemoved'),
      description: t('products.itemRemovedFromCart'),
    });

    setItemToRemove(null);
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    const product = products.find(p => p["Product ID"] === productId);
    if (!product) return;

    if (newQuantity < 1) {
      toast({
        title: t('products.invalidQuantity'),
        description: t('products.quantityCannotBeLess'),
        variant: "destructive",
      });
      return;
    }

    if (newQuantity > product.Quantity) {
      toast({
        title: t('products.insufficientStock'),
        description: t('products.onlyAvailable', { quantity: product.Quantity }),
        variant: "destructive",
      });
      return;
    }

    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item["Product ID"] === productId
          ? { ...item, cartQuantity: newQuantity }
          : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  console.log('ProductCatalog - products:', products);

  const filteredProducts = products.filter((product: Product) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      (product["Product Name"]?.toLowerCase() || '').includes(searchLower) ||
      (product.Category?.toLowerCase() || '').includes(searchLower) ||
      (product["Metal Type"]?.toLowerCase() || '').includes(searchLower) ||
      (product["Product ID"]?.toLowerCase() || '').includes(searchLower);
    
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
          <p className="text-muted-foreground">{t('products.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-primary">{t('products.title')}</h2>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={refreshData}
            className="hover:bg-gray-100"
          >
            {t('common.refresh')}
          </Button>
          <Button 
            onClick={handleAddNew}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary shadow-sm"
          >
            {t('products.addNew')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="text-2xl">📦</span>
              {t('products.totalProducts')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {t('products.totalInventoryItems')}
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="text-2xl">✅</span>
              {t('products.inStockProducts')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{inStockProducts}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {t('products.availableForSale')}
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-white to-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              {t('products.lowStockProducts')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockProducts}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {t('products.needAttention')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder={t('products.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:max-w-md bg-white"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {categories.map((category, index) => (
                <option key={`category-option-${category}-${index}`} value={category}>
                  {category === "all" ? t('products.allCategories') : category}
                </option>
              ))}
            </select>
            <Button 
              variant="outline"
              className="hover:bg-gray-100"
            >
              {t('products.exportCatalog')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product: Product, index: number) => {
          const cartItem = cartItems.find(item => item["Product ID"] === product["Product ID"]);
          const isInCart = !!cartItem;
          
          return (
            <Card 
              key={`product-card-${product["Product ID"]}-${index}`} 
              className="hover:shadow-lg transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50"
            >
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
                  <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    {product["Image URL"] ? (
                      <img 
                        src={product["Image URL"]} 
                        alt={product["Product Name"]}
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-product.png';
                          target.onerror = null; // Prevent infinite loop
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <span className="text-gray-400 text-sm">{t('products.noImage')}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{t('products.category')}</p>
                      <p className="font-medium">{product.Category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('products.metalType')}</p>
                      <p className="font-medium">{product["Metal Type"] || t('common.none')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('products.weight')}</p>
                      <p className="font-medium">{product["Weight (g)"]}g</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('products.quantity')}</p>
                      <p className="font-medium">{product.Quantity}</p>
                    </div>
                  </div>

                  {/* Cart Actions */}
                  <div className="pt-2">
                    {isInCart ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCartQuantity(product["Product ID"], cartItem.cartQuantity - 1)}
                            className="flex-1 hover:bg-gray-100"
                            disabled={cartItem.cartQuantity <= 1}
                          >
                            -
                          </Button>
                          <span className="flex-1 text-center font-medium">{cartItem.cartQuantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateCartQuantity(product["Product ID"], cartItem.cartQuantity + 1)}
                            className="flex-1 hover:bg-gray-100"
                            disabled={cartItem.cartQuantity >= product.Quantity}
                          >
                            +
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFromCart(product["Product ID"])}
                            className="flex-1"
                          >
                            {t('products.removeFromCart')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => addToCart(product)}
                        disabled={product.Quantity === 0}
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 shadow-sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.Quantity === 0 ? t('products.outOfStock') : t('products.addToCart')}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cart Summary */}
      {cartItems.length > 0 && (
        <Card className="sticky bottom-4 mt-4 border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-lg">{cartItems.length} {t('products.itemsInCart')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('products.totalItems')}: {cartItems.reduce((sum, item) => sum + item.cartQuantity, 0)}
                </p>
              </div>
              <Button
                onClick={() => window.location.href = '/billing'}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 shadow-sm"
              >
                {t('products.proceedToBilling')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredProducts.length === 0 && !isLoadingProducts && (
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground text-lg">{t('products.noProducts')}</p>
          </CardContent>
        </Card>
      )}

      {/* Remove Item Confirmation Dialog */}
      <AlertDialog open={!!itemToRemove} onOpenChange={(open) => !open && setItemToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('products.removeItem')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('products.removeItemConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('products.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveFromCart}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('products.remove')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
