import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppContext } from "@/contexts/AppContext";
import { Product } from "@/services/supabaseApi";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AddProductModal() {
  const { t } = useLanguage();
  const { showAddProductModal, setShowAddProductModal, addProduct, isLoading, products } = useAppContext();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    category: "",
    carat: "",
    weight: "",
    quantity: "",
    metalType: "",
    notes: "",
    imageUrl: ""
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Get dynamic categories from existing products
  const defaultCategories = ["Rings", "Necklaces", "Earrings", "Bracelets", "Pendants"];
  const uniqueProductCategories = [...new Set(products.map(p => p.Category))];
  const additionalCategories = uniqueProductCategories.filter(cat => !defaultCategories.includes(cat));
  const allCategories = [...defaultCategories, ...additionalCategories];

  const metalTypes = ["Gold", "Silver", "Platinum"];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File, productId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
        return null;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.productName || !formData.category) {
      toast({
        title: t('common.error'),
        description: t('products.validation.requiredFields'),
        variant: "destructive",
      });
      return;
    }

    let imageUrl = "";
    
    // Upload image if selected
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile, formData.productId);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    const product: Product = {
      "Product ID": formData.productId,
      "Product Name": formData.productName,
      "Category": formData.category,
      "Carat": formData.carat,
      "Weight (g)": parseFloat(formData.weight) || 0,
      "Quantity": parseInt(formData.quantity) || 0,
      "Metal Type": formData.metalType,
      "Notes": formData.notes,
      "Image URL": imageUrl
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
      notes: "",
      imageUrl: ""
    });
    setImageFile(null);
    setImagePreview("");
  };

  return (
    <Dialog open={showAddProductModal} onOpenChange={setShowAddProductModal}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('products.addNew')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="productId">{t('products.productId')} *</Label>
              <Input
                id="productId"
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                required
                placeholder={t('products.productIdPlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="category">{t('products.category')} *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('products.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((category, index) => (
                    <SelectItem key={`category-${category}-${index}`} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="productName">{t('products.productNameLabel')} *</Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              required
              placeholder={t('products.productNamePlaceholder')}
            />
          </div>

          <div>
            <Label htmlFor="image">{t('products.image')}</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt={t('products.imagePreview')} 
                  className="w-20 h-20 object-cover rounded border"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="metalType">{t('products.metalType')}</Label>
              <Select value={formData.metalType} onValueChange={(value) => setFormData({ ...formData, metalType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('products.selectMetal')} />
                </SelectTrigger>
                <SelectContent>
                  {metalTypes.map((metal, index) => (
                    <SelectItem key={`metal-${metal}-${index}`} value={metal}>
                      {metal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="carat">{t('products.carat')}</Label>
              <Input
                id="carat"
                value={formData.carat}
                onChange={(e) => setFormData({ ...formData, carat: e.target.value })}
                placeholder={t('products.caratPlaceholder')}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">{t('products.weight')}</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder={t('products.weightPlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="quantity">{t('products.quantity')}</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder={t('products.quantityPlaceholder')}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">{t('products.notes')}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t('products.notesPlaceholder')}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? t('products.adding') : t('products.add')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
