
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Settings() {
  const settingsSections = [
    {
      title: "Store Information",
      icon: "🏪",
      settings: [
        { label: "Store Name", value: "GemSpark Jewelry", type: "text" },
        { label: "GST Number", value: "29XXXXX1234X1ZY", type: "text" },
        { label: "Address", value: "123 Main Street, City", type: "text" },
        { label: "Phone", value: "+91 98765 43210", type: "tel" },
        { label: "Email", value: "info@gemspark.com", type: "email" }
      ]
    },
    {
      title: "Billing Settings",
      icon: "🧾",
      settings: [
        { label: "Invoice Prefix", value: "GSP", type: "text" },
        { label: "GST Rate (%)", value: "3", type: "number" },
        { label: "Making Charges (%)", value: "12", type: "number" },
        { label: "Auto Generate Invoice", value: "Yes", type: "select" }
      ]
    },
    {
      title: "WhatsApp Integration",
      icon: "📱",
      settings: [
        { label: "WhatsApp Number", value: "+91 98765 43210", type: "tel" },
        { label: "Auto Send Bills", value: "Yes", type: "select" },
        { label: "Message Template", value: "Custom", type: "text" }
      ]
    },
    {
      title: "Security",
      icon: "🔐",
      settings: [
        { label: "Admin Password", value: "••••••••", type: "password" },
        { label: "Session Timeout (mins)", value: "30", type: "number" },
        { label: "Two Factor Auth", value: "Disabled", type: "select" }
      ]
    }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">Settings</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 sm:flex-none">Reset to Default</Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary flex-1 sm:flex-none">
            Save Changes
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
                  Update {section.title}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <span className="text-2xl">📤</span>
              <span className="text-sm">Backup Data</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <span className="text-2xl">📥</span>
              <span className="text-sm">Import Data</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <span className="text-2xl">🔄</span>
              <span className="text-sm">Sync Settings</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <span className="text-2xl">❓</span>
              <span className="text-sm">Help & Support</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
