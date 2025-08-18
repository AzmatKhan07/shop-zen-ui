import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2,
  CreditCard,
  Smartphone,
  DollarSign,
  Receipt,
  MessageSquare,
  Calculator,
  Package
} from "lucide-react";

const mockItems = [
  { id: 1, name: "iPhone 14 Pro", price: 1199, category: "Electronics", barcode: "1234567890123" },
  { id: 2, name: "Samsung Galaxy Buds", price: 179, category: "Accessories", barcode: "1234567890124" },
  { id: 3, name: "MacBook Pro 16\"", price: 2299, category: "Computers", barcode: "1234567890125" },
  { id: 4, name: "Wireless Mouse", price: 39, category: "Accessories", barcode: "1234567890126" },
  { id: 5, name: "USB-C Cable", price: 25, category: "Accessories", barcode: "1234567890127" },
  { id: 6, name: "Phone Case", price: 29, category: "Accessories", barcode: "1234567890128" },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  discount: number;
}

export default function POS() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerDiscount, setCustomerDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(10); // 10% tax

  const filteredItems = mockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.barcode.includes(searchTerm)
  );

  const addToCart = (item: typeof mockItems[0]) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1, discount: 0 }]);
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateDiscount = (id: number, discount: number) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, discount } : item
    ));
  };

  const subtotal = cart.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    const itemDiscount = itemTotal * (item.discount / 100);
    return sum + (itemTotal - itemDiscount);
  }, 0);

  const globalDiscount = subtotal * (customerDiscount / 100);
  const afterDiscount = subtotal - globalDiscount;
  const tax = afterDiscount * (taxRate / 100);
  const grandTotal = afterDiscount + tax;

  const clearCart = () => {
    setCart([]);
    setCustomerDiscount(0);
  };

  const printReceipt = () => {
    const receiptContent = `
      <div style="font-family: monospace; max-width: 300px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 24px;">ShopZen</h2>
          <p style="margin: 5px 0;">Mobile Shop Management</p>
          <p style="margin: 5px 0;">Date: ${new Date().toLocaleDateString()}</p>
          <p style="margin: 5px 0;">Time: ${new Date().toLocaleTimeString()}</p>
          <hr style="border: 1px dashed #000; margin: 10px 0;">
        </div>
        
        <div style="margin-bottom: 20px;">
          ${cart.map(item => {
            const itemTotal = item.price * item.quantity;
            const itemDiscount = itemTotal * (item.discount / 100);
            const finalPrice = itemTotal - itemDiscount;
            return `
              <div style="margin-bottom: 10px;">
                <div style="font-weight: bold;">${item.name}</div>
                <div style="display: flex; justify-content: space-between;">
                  <span>${item.quantity} x $${item.price.toFixed(2)}</span>
                  <span>$${finalPrice.toFixed(2)}</span>
                </div>
                ${item.discount > 0 ? `<div style="font-size: 12px; color: #666;">Discount: ${item.discount}%</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
        
        <hr style="border: 1px dashed #000; margin: 10px 0;">
        
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          ${customerDiscount > 0 ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: #666;">
              <span>Discount (${customerDiscount}%):</span>
              <span>-$${globalDiscount.toFixed(2)}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span>Tax (${taxRate}%):</span>
            <span>$${tax.toFixed(2)}</span>
          </div>
          <hr style="border: 1px solid #000; margin: 10px 0;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px;">
            <span>TOTAL:</span>
            <span>$${grandTotal.toFixed(2)}</span>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <p style="margin: 5px 0;">Thank you for your business!</p>
          <p style="margin: 5px 0; font-size: 12px;">Visit us again soon</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank', 'width=300,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              @media print {
                body { margin: 0; padding: 0; }
                @page { size: 80mm auto; margin: 0; }
              }
              body { 
                font-family: 'Courier New', monospace; 
                font-size: 12px; 
                line-height: 1.4;
              }
            </style>
          </head>
          <body>
            ${receiptContent}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Point of Sale</h1>
            <p className="text-muted-foreground">Process sales and manage transactions</p>
          </div>
        </div>
        <Button variant="outline" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section - Item Search */}
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Search Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-shop-card-hover cursor-pointer"
                    onClick={() => addToCart(item)}
                  >
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">${item.price}</div>
                      <Button size="sm" variant="outline">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredItems.length === 0 && searchTerm && (
                  <div className="text-center py-8 text-muted-foreground">
                    No items found matching "{searchTerm}"
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {["Electronics", "Accessories", "Computers", "All Items"].map((category) => (
                  <Button key={category} variant="outline" className="text-xs" size="sm">
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Section - Cart */}
        <div className="lg:col-span-5">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Shopping Cart ({cart.length})
                </span>
                <Badge variant="secondary">{cart.reduce((sum, item) => sum + item.quantity, 0)} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingCart className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Cart is empty</p>
                  <p className="text-sm">Add items to start a transaction</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="w-20">Qty</TableHead>
                          <TableHead className="w-16">Disc%</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cart.map((item) => {
                          const itemTotal = item.price * item.quantity;
                          const itemDiscount = itemTotal * (item.discount / 100);
                          const finalPrice = itemTotal - itemDiscount;
                          
                          return (
                            <TableRow key={item.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium text-sm">{item.name}</div>
                                  <div className="text-xs text-muted-foreground">${item.price} each</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={item.discount}
                                  onChange={(e) => updateDiscount(item.id, Number(e.target.value))}
                                  className="w-16 text-xs"
                                  min="0"
                                  max="100"
                                />
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ${finalPrice.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-status-danger hover:text-status-danger"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Payment */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm">Discount (%):</label>
                <Input
                  type="number"
                  value={customerDiscount}
                  onChange={(e) => setCustomerDiscount(Number(e.target.value))}
                  className="w-20 text-sm"
                  min="0"
                  max="100"
                />
              </div>
              
              {customerDiscount > 0 && (
                <div className="flex justify-between text-sm text-status-active">
                  <span>Discount:</span>
                  <span>-${globalDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span>Tax ({taxRate}%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <hr />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" disabled={cart.length === 0}>
                <DollarSign className="mr-2 h-4 w-4" />
                Cash Payment
              </Button>
              <Button className="w-full justify-start" variant="outline" disabled={cart.length === 0}>
                <CreditCard className="mr-2 h-4 w-4" />
                Card Payment
              </Button>
              <Button className="w-full justify-start" variant="outline" disabled={cart.length === 0}>
                <Smartphone className="mr-2 h-4 w-4" />
                Mobile Wallet
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline" disabled={cart.length === 0} onClick={printReceipt}>
                <Receipt className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
              <Button className="w-full" variant="outline" disabled={cart.length === 0}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Share via WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}