import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Tags,
  ShoppingCart,
  Menu,
  X,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", to: "/", icon: LayoutDashboard },
  { name: "Items", to: "/items", icon: Package },
  { name: "Suppliers", to: "/suppliers", icon: Users },
  { name: "Categories", to: "/categories", icon: Tags },
  { name: "POS", to: "/pos", icon: ShoppingCart },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-shop-bg">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-shop-sidebar shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-border flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Store className="h-8 w-8 text-primary" />
              <span className="text-lg font-semibold text-foreground">ShopZen</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 mt-6 px-4 overflow-y-auto">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.to}
                      className={`
                        flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isActive 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'text-muted-foreground hover:bg-shop-card-hover hover:text-foreground'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-card border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-6">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome to ShopZen Management System
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}