import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users, 
  AlertTriangle,
  Plus,
  BarChart3,
  ShoppingCart
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const stats = [
    {
      title: "Today's Sales",
      value: "$1,245",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "This Week",
      value: "$8,750",
      change: "+8.2%", 
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "This Month",
      value: "$34,200",
      change: "-2.1%",
      trend: "down", 
      icon: BarChart3,
    },
    {
      title: "Total Items",
      value: "1,247",
      change: "+5 new",
      trend: "up",
      icon: Package,
    },
  ];

  const lowStockItems = [
    { name: "iPhone 14 Pro", category: "Electronics", stock: 3, minStock: 10 },
    { name: "Samsung Galaxy Buds", category: "Accessories", stock: 1, minStock: 5 },
    { name: "MacBook Pro 16\"", category: "Computers", stock: 2, minStock: 8 },
    { name: "AirPods Pro", category: "Accessories", stock: 4, minStock: 12 },
  ];

  const recentSales = [
    { id: "TXN001", customer: "John Doe", amount: 299, items: 3, time: "2 mins ago" },
    { id: "TXN002", customer: "Sarah Smith", amount: 1249, items: 1, time: "15 mins ago" },
    { id: "TXN003", customer: "Mike Johnson", amount: 89, items: 2, time: "32 mins ago" },
    { id: "TXN004", customer: "Emma Wilson", amount: 599, items: 1, time: "1 hour ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your shop's performance and manage operations</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
          <Link to="/items/new">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </Link>
          <Link to="/pos">
            <Button variant="outline" className="w-full sm:w-auto">
              <ShoppingCart className="mr-2 h-4 w-4" />
              New Sale
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:bg-shop-card-hover transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className={`flex items-center text-xs ${
                stat.trend === "up" ? "text-status-active" : "text-status-danger"
              }`}>
                {stat.trend === "up" ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-status-warning" />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-shop-bg">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-status-danger">
                      {item.stock} left
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Min: {item.minStock}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/items">
              <Button variant="outline" className="w-full mt-4">
                Manage Inventory
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-primary" />
              Recent Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSales.map((sale, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-shop-bg">
                  <div>
                    <div className="font-medium">{sale.id}</div>
                    <div className="text-sm text-muted-foreground">{sale.customer}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${sale.amount}</div>
                    <div className="text-xs text-muted-foreground">
                      {sale.items} items • {sale.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/pos">
              <Button variant="outline" className="w-full mt-4">
                Open POS
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}