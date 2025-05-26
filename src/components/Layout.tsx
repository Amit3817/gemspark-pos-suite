
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 touch-manipulation">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-white shadow-sm flex items-center px-4 md:px-6">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center space-x-2 md:space-x-4">
              <h1 className="text-xl md:text-2xl font-bold text-primary">GemSpark POS</h1>
              <div className="h-8 w-px bg-border hidden md:block"></div>
              <span className="text-xs md:text-sm text-muted-foreground hidden md:block">Jewelry Store Management</span>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <div className="text-xs md:text-sm text-muted-foreground">
                Welcome, Admin
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
