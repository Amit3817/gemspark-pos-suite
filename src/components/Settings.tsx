
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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
    importData();
  };

  const handleSync = () => {
    refreshData();
  };

  const handleHelp = () => {
    toast({
      title: "Help & Support",
      description: "Opening help documentation",
    });
    console.log('Opening help and support');
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
                    <Input
                      type={setting.type}
                      value={settings[setting.key as keyof typeof settings]}
                      onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                      className="w-full"
                    />
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
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={handleImport}>
              <span className="text-2xl">📥</span>
              <span className="text-sm">{t('settings.importData')}</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={handleSync}>
              <span className="text-2xl">🔄</span>
              <span className="text-sm">{t('settings.syncSettings')}</span>
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
