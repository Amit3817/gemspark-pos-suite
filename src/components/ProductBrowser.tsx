import React, { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppContext } from "@/contexts/AppContext";

interface ProductBrowserProps {
  open: boolean;
  onClose: () => void;
  onAddToCart: (product: any) => void;
}

export const ProductBrowser: React.FC<ProductBrowserProps> = ({
  open,
  onClose,
  onAddToCart,
}) => {
  const { t } = useLanguage();
  const { products } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return products.filter(product =>
      (product["Product Name"]?.toLowerCase() || '').includes(searchLower) ||
      (product["Metal Type"]?.toLowerCase() || '').includes(searchLower)
    );
  }, [products, searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('billing.browseProducts')}</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('billing.searchProducts')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('billing.noProductsFound')}
              </div>
            ) : (
              filteredProducts.map((product, index) => (
                <div
                  key={`product-browser-${product["Product ID"]}-${index}`}
                  className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/50"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{product["Product Name"]}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="font-normal">
                        {product["Metal Type"]}
                      </Badge>
                      <span>•</span>
                      <span>{product["Weight (g)"]}g</span>
                      {product.Carat && (
                        <>
                          <span>•</span>
                          <span>{product.Carat}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {t('billing.add')}
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}; 