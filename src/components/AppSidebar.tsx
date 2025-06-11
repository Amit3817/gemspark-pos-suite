import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { t } = useLanguage();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const [cartCount, setCartCount] = useState(0);

  // Load cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart);
          const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.cartQuantity, 0);
          setCartCount(totalItems);
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      } else {
        setCartCount(0);
      }
    };

    // Initial load
    updateCartCount();

    // Listen for storage changes
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  const menuItems = [
    { title: t('sidebar.dashboard'), url: "/", icon: "📊" },
    { title: t('sidebar.products'), url: "/products", icon: "💎" },
    { 
      title: t('sidebar.billing'), 
      url: "/billing", 
      icon: "🧾",
      badge: cartCount > 0 ? cartCount : undefined
    },
    { title: t('sidebar.customers'), url: "/customers", icon: "👥" },
    { title: t('sidebar.reports'), url: "/reports", icon: "📈" },
    { title: t('sidebar.settings'), url: "/settings", icon: "⚙️" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = (path: string) =>
    isActive(path) 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-56"} collapsible="icon">
      <SidebarContent className="bg-sidebar">
        <div className="p-3 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-sm">G</span>
            </div>
            {!collapsed && (
              <span className="text-sidebar-foreground font-semibold text-sm">GemSpark</span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            {!collapsed && t('sidebar.mainMenu')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls(item.url)}>
                      <span className="text-lg">{item.icon}</span>
                      {!collapsed && (
                        <div className="flex items-center justify-between flex-1">
                          <span className="ml-3">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
