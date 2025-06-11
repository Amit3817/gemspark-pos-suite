import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const { t } = useLanguage();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 touch-manipulation">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b bg-white shadow-sm flex items-center px-3 md:px-4">
            <SidebarTrigger className="mr-3" />
            <div className="flex items-center space-x-2 md:space-x-3">
              <h1 className="text-xl md:text-2xl font-bold text-primary">{t('header.title')}</h1>
              <div className="h-8 w-px bg-border hidden md:block"></div>
              <span className="text-xs md:text-sm text-muted-foreground hidden md:block">{t('header.subtitle')}</span>
            </div>
            <div className="ml-auto flex items-center space-x-3">
              <LanguageToggle />
              <div className="text-xs md:text-sm text-muted-foreground">
                {t('header.welcome')}
              </div>
            </div>
          </header>
          <main className="flex-1 p-2 md:p-3 overflow-y-auto max-w-[1400px] mx-auto w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
