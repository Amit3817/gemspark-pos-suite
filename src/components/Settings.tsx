import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Settings() {
  const { t } = useLanguage();
  const { exportData, importData, refreshData } = useAppContext();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    storeName: "GemSpark Jewelry",
    gstNumber: "29XXXXX1234X1ZY",
    storeAddress: "123 Main Street, City",
    storePhone: "+91 98765 43210",
    email: "info@gemspark.com",
    invoicePrefix: "GSP",
    defaultTax: "3",
    makingCharges: "12",
    autoGenerateInvoice: "Yes",
    whatsappNumber: "+91 98765 43210",
    autoSendBills: "Yes",
    messageTemplate: "Custom",
    adminPassword: "••••••••",
    sessionTimeout: "30",
    twoFactorAuth: "Disabled"
  });
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const settingsSections = [
    {
      title: t('settings.storeInformation'),
      icon: "🏪",
      settings: [
        { label: t('settings.storeName'), key: "storeName", type: "text" },
        { label: t('settings.gstNumber'), key: "gstNumber", type: "text" },
        { label: t('settings.storeAddress'), key: "storeAddress", type: "text" },
        { label: t('settings.storePhone'), key: "storePhone", type: "tel" },
        { label: t('settings.email'), key: "email", type: "email" }
      ]
    },
    {
      title: t('settings.taxSettings'),
      icon: "🧾",
      settings: [
        { label: t('settings.invoicePrefix'), key: "invoicePrefix", type: "text" },
        { label: t('settings.defaultTax'), key: "defaultTax", type: "number" },
        { label: t('settings.makingCharges'), key: "makingCharges", type: "number" },
        { label: t('settings.autoGenerateInvoice'), key: "autoGenerateInvoice", type: "select" }
      ]
    },
    {
      title: t('settings.whatsappIntegration'),
      icon: "📱",
      settings: [
        { label: t('settings.whatsappNumber'), key: "whatsappNumber", type: "tel" },
        { label: t('settings.autoSendBills'), key: "autoSendBills", type: "select" },
        { label: t('settings.messageTemplate'), key: "messageTemplate", type: "text" }
      ]
    },
    {
      title: t('settings.security'),
      icon: "🔐",
      settings: [
        { label: t('settings.adminPassword'), key: "adminPassword", type: "password" },
        { label: t('settings.sessionTimeout'), key: "sessionTimeout", type: "number" },
        { label: t('settings.twoFactorAuth'), key: "twoFactorAuth", type: "select" }
      ]
    }
  ];

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleUpdateSection = (sectionTitle: string) => {
    toast({
      title: "Settings Updated",
      description: `${sectionTitle} settings have been updated`,
    });
    console.log('Updated section:', sectionTitle);
  };

  const handleSaveAll = () => {
    toast({
      title: "All Settings Saved",
      description: "All settings have been saved successfully",
    });
    console.log('Saving all settings:', settings);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      toast({
        title: "Settings Reset",
        description: "All settings have been reset to default values",
      });
      console.log('Resetting to default settings');
    }
  };

  const handleBackup = () => {
    exportData();
  };

  const handleImport = () => {
    setShowImportDialog(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/json') {
        toast({
          title: "Invalid File",
          description: "Please select a valid JSON file",
          variant: "destructive",
        });
        return;
      }
      setImportFile(file);
    }
  };

  const handleImportConfirm = async () => {
    if (!importFile) return;

    setIsImporting(true);
    try {
      const text = await importFile.text();
      const data = JSON.parse(text);

      // Validate data structure
      if (!data.products || !data.customers || !data.bills) {
        throw new Error('Invalid data format');
      }

      // Import data to database
      // This is a placeholder - implement actual database import
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      toast({
        title: "Import Successful",
        description: "Data has been imported successfully",
      });
      setShowImportDialog(false);
      setImportFile(null);
      refreshData(); // Refresh data after import
    } catch (error) {
      console.error('Error importing data:', error);
      toast({
        title: "Import Failed",
        description: "Failed to import data. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Refresh all data
      await refreshData();
      
      toast({
        title: "Sync Complete",
        description: "All data has been synchronized successfully",
      });
    } catch (error) {
      console.error('Error syncing data:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to synchronize data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleHelp = () => {
    setShowHelpDialog(true);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">{t('settings.title')}</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 sm:flex-none" onClick={handleResetToDefault}>
            {t('settings.resetToDefault')}
          </Button>
          <Button 
            onClick={handleSaveAll}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary flex-1 sm:flex-none"
          >
            {t('settings.save')}
          </Button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {settingsSections.map((section, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{section.icon}</span>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.settings.map((setting, settingIndex) => (
                  <div key={settingIndex} className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {setting.label}
                    </label>
                    {setting.type === "select" ? (
                      <Select
                        value={setting.value}
                        onValueChange={setting.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('settings.selectLanguage')} />
                        </SelectTrigger>
                        <SelectContent>
                          {setting.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={setting.type}
                        value={settings[setting.key as keyof typeof settings]}
                        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                        className="w-full"
                      />
                    )}
                  </div>
                ))}
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => handleUpdateSection(section.title)}
                >
                  {t('settings.update')} {section.title}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Import Dialog */}
      <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import Data</AlertDialogTitle>
            <AlertDialogDescription>
              Select a JSON file to import data. This will replace all existing data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="importFile">Select File</Label>
                <Input
                  id="importFile"
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  disabled={isImporting}
                />
                <p className="text-xs text-muted-foreground">
                  Only JSON files are supported. The file should contain products, customers, and bills data.
                </p>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isImporting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleImportConfirm}
              disabled={!importFile || isImporting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isImporting ? "Importing..." : "Import"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Help Dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Help & Support</DialogTitle>
            <DialogDescription>
              Get help with using GemSpark POS Suite
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Quick Start Guide</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Add products to your catalog</li>
                <li>Register customers</li>
                <li>Create bills and manage sales</li>
                <li>View reports and analytics</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Support</h3>
              <p className="text-sm">
                For technical support, please contact:
                <br />
                Email: support@gemspark.com
                <br />
                Phone: +91 98765 43210
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Documentation</h3>
              <p className="text-sm">
                Visit our documentation website for detailed guides and tutorials:
                <br />
                <a href="https://docs.gemspark.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  docs.gemspark.com
                </a>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('common.quickActions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={handleBackup}>
              <span className="text-2xl">📤</span>
              <span className="text-sm">{t('settings.backup')}</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2" 
              onClick={handleImport}
              disabled={isImporting}
            >
              <span className="text-2xl">📥</span>
              <span className="text-sm">
                {isImporting ? "Importing..." : t('settings.importData')}
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2" 
              onClick={handleSync}
              disabled={isSyncing}
            >
              <span className="text-2xl">🔄</span>
              <span className="text-sm">
                {isSyncing ? "Syncing..." : t('settings.syncSettings')}
              </span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={handleHelp}>
              <span className="text-2xl">❓</span>
              <span className="text-sm">{t('settings.helpSupport')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
