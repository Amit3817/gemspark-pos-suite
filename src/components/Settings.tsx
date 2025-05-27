
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Settings() {
  const { t } = useLanguage();

  const settingsSections = [
    {
      title: t('settings.storeInformation'),
      icon: "🏪",
      settings: [
        { label: t('settings.storeName'), value: "GemSpark Jewelry", type: "text" },
        { label: t('settings.gstNumber'), value: "29XXXXX1234X1ZY", type: "text" },
        { label: t('settings.storeAddress'), value: "123 Main Street, City", type: "text" },
        { label: t('settings.storePhone'), value: "+91 98765 43210", type: "tel" },
        { label: t('settings.email'), value: "info@gemspark.com", type: "email" }
      ]
    },
    {
      title: t('settings.taxSettings'),
      icon: "🧾",
      settings: [
        { label: t('settings.invoicePrefix'), value: "GSP", type: "text" },
        { label: t('settings.defaultTax'), value: "3", type: "number" },
        { label: t('settings.makingCharges'), value: "12", type: "number" },
        { label: t('settings.autoGenerateInvoice'), value: "Yes", type: "select" }
      ]
    },
    {
      title: t('settings.whatsappIntegration'),
      icon: "📱",
      settings: [
        { label: t('settings.whatsappNumber'), value: "+91 98765 43210", type: "tel" },
        { label: t('settings.autoSendBills'), value: "Yes", type: "select" },
        { label: t('settings.messageTemplate'), value: "Custom", type: "text" }
      ]
    },
    {
      title: t('settings.security'),
      icon: "🔐",
      settings: [
        { label: t('settings.adminPassword'), value: "••••••••", type: "password" },
        { label: t('settings.sessionTimeout'), value: "30", type: "number" },
        { label: t('settings.twoFactorAuth'), value: "Disabled", type: "select" }
      ]
    }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">{t('settings.title')}</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 sm:flex-none">{t('settings.resetToDefault')}</Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary flex-1 sm:flex-none">
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
                      defaultValue={setting.value}
                      className="w-full"
                    />
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full mt-4">
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
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <span className="text-2xl">📤</span>
              <span className="text-sm">{t('settings.backup')}</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <span className="text-2xl">📥</span>
              <span className="text-sm">{t('settings.importData')}</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <span className="text-2xl">🔄</span>
              <span className="text-sm">{t('settings.syncSettings')}</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <span className="text-2xl">❓</span>
              <span className="text-sm">{t('settings.helpSupport')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
