import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from 'react-i18next';
import { useAppContext } from "@/contexts/AppContext";
import { Customer } from "@/services/supabaseApi";
import { toast } from "@/components/ui/use-toast";

export default function AddCustomerModal() {
  const { t } = useTranslation();
  const { showAddCustomerModal, setShowAddCustomerModal, addCustomer, isLoading } = useAppContext();

  const [formData, setFormData] = useState({
    customerId: "",
    name: "",
    phone: "",
    email: "",
    status: "New"
  });

  const statusOptions = [
    { value: "New", label: t('customers.status.new') },
    { value: "Regular", label: t('customers.status.regular') },
    { value: "VIP", label: t('customers.status.vip') }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerId || !formData.name) {
      toast({
        title: t('common.error'),
        description: t('customers.validation.requiredFields'),
        variant: "destructive",
      });
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('customers.addNew')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerId">{t('customers.customerId')} *</Label>
              <Input
                id="customerId"
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                required
                placeholder={t('customers.customerIdPlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="status">{t('customers.status.label')}</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder={t('customers.status.select')} />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="name">{t('customers.customerName')} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder={t('customers.customerNamePlaceholder')}
            />
          </div>

          <div>
            <Label htmlFor="phone">{t('customers.phone')}</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={t('customers.phonePlaceholder')}
            />
          </div>

          <div>
            <Label htmlFor="email">{t('customers.email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t('customers.emailPlaceholder')}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? t('customers.adding') : t('customers.add')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
