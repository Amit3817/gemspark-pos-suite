import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from 'react-i18next';
import { useAppContext } from "@/contexts/AppContext";
import { Product } from "@/services/supabaseApi";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function EditProductModal() {
  const { t } = useTranslation();
  const { showEditProductModal, setShowEditProductModal, updateProduct, editingProduct, isLoading } = useAppContext();
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

  const categories = ["Rings", "Necklaces", "Earrings", "Bracelets", "Pendants"];
  const metalTypes = ["Gold", "Silver", "Platinum"];

  useEffect(() => {
    if (editingProduct) {
      const existingImageUrl = editingProduct["Image URL"] || "";
      setFormData({
        productId: editingProduct["Product ID"],
        productName: editingProduct["Product Name"],
        category: editingProduct["Category"],
        carat: editingProduct["Carat"] || "",
        weight: editingProduct["Weight (g)"]?.toString() || "",
        quantity: editingProduct["Quantity"]?.toString() || "",
        metalType: editingProduct["Metal Type"] || "",
        notes: editingProduct["Notes"] || "",
        imageUrl: existingImageUrl
      });
      setImagePreview(existingImageUrl);
    }
  }, [editingProduct]);

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
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    let imageUrl = formData.imageUrl;
    
    // Upload new image if selected
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

    await updateProduct(product);
  };

  const handleClose = () => {
    setShowEditProductModal(false);
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
    <Dialog open={showEditProductModal} onOpenChange={setShowEditProductModal}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="productId">Product ID *</Label>
              <Input
                id="productId"
                value={formData.productId}
                disabled
                className="bg-gray-100"
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

          <div>
            <Label htmlFor="image">Product Image</Label>
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
                  alt="Preview" 
                  className="w-20 h-20 object-cover rounded border"
                />
              </div>
            )}
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
              {isLoading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
