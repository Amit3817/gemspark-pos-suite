
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppContext } from "@/contexts/AppContext";
import { Product } from "@/services/supabaseApi";

export default function AddProductModal() {
  const { t } = useLanguage();
  const { showAddProductModal, setShowAddProductModal, addProduct, isLoading } = useAppContext();

  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    category: "",
    carat: "",
    weight: "",
    quantity: "",
    metalType: "",
    notes: ""
  });

  const categories = ["Rings", "Necklaces", "Earrings", "Bracelets", "Pendants"];
  const metalTypes = ["Gold", "Silver", "Platinum"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.productName || !formData.category) {
      return;
    }

    const product: Product = {
      "Product ID": formData.productId,
      "Product Name": formData.productName,
      "Category": formData.category,
      "Carat": formData.carat,
      "Weight (g)": parseFloat(formData.weight) || 0,
      "Quantity": parseInt(formData.quantity) || 0,
      "Metal Type": formData.metalType,
      "Notes": formData.notes
    };

    await addProduct(product);
    handleClose();
  };

  const handleClose = () => {
    setShowAddProductModal(false);
    setFormData({
      productId: "",
      productName: "",
      category: "",
      carat: "",
      weight: "",
      quantity: "",
      metalType: "",
      notes: ""
    });
  };

  return (
    <Dialog open={showAddProductModal} onOpenChange={setShowAddProductModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('products.addNew')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="productId">Product ID *</Label>
              <Input
                id="productId"
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="productName">Product Name *</Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="metalType">Metal Type</Label>
              <Select value={formData.metalType} onValueChange={(value) => setFormData({ ...formData, metalType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metal" />
                </SelectTrigger>
                <SelectContent>
                  {metalTypes.map((metal) => (
                    <SelectItem key={metal} value={metal}>
                      {metal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="carat">Carat</Label>
              <Input
                id="carat"
                value={formData.carat}
                onChange={(e) => setFormData({ ...formData, carat: e.target.value })}
                placeholder="e.g., 22K, 18K"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Weight (g)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
