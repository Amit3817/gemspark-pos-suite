
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppContext } from "@/contexts/AppContext";
import { Customer } from "@/services/supabaseApi";

export default function AddCustomerModal() {
  const { t } = useLanguage();
  const { showAddCustomerModal, setShowAddCustomerModal, addCustomer, isLoading } = useAppContext();

  const [formData, setFormData] = useState({
    customerId: "",
    name: "",
    phone: "",
    email: "",
    status: "New"
  });

  const statusOptions = ["New", "Regular", "VIP"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerId || !formData.name) {
      return;
    }

    const customer: Customer = {
      "Customer ID": formData.customerId,
      "Name": formData.name,
      "Phone": formData.phone,
      "Email": formData.email,
      "Status": formData.status,
      "Total Purchases": 0,
      "Last Visit": new Date().toISOString().split('T')[0]
    };

    await addCustomer(customer);
    handleClose();
  };

  const handleClose = () => {
    setShowAddCustomerModal(false);
    setFormData({
      customerId: "",
      name: "",
      phone: "",
      email: "",
      status: "New"
    });
  };

  return (
    <Dialog open={showAddCustomerModal} onOpenChange={setShowAddCustomerModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('customers.addNew')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerId">Customer ID *</Label>
              <Input
                id="customerId"
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                required
                placeholder="C001"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Adding..." : "Add Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
