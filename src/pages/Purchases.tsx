import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, Eye, FileText, Download, ShoppingCart, DollarSign, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PurchaseItem {
  name: string;
  quantity: number;
  purchasePrice: number;
  total: number;
}

interface Purchase {
  id: string;
  invoiceNo: string;
  supplierName: string;
  date: string;
  totalAmount: number;
  paymentStatus: 'paid' | 'partial' | 'due';
  paymentMade: number;
  balance: number;
  items: PurchaseItem[];
  discount: number;
  tax: number;
}

// Mock data
const mockPurchases: Purchase[] = [
  {
    id: "1",
    invoiceNo: "INV-2024-001",
    supplierName: "TechSupply Co.",
    date: "2024-01-15",
    totalAmount: 1250.00,
    paymentStatus: "paid",
    paymentMade: 1250.00,
    balance: 0.00,
    discount: 50.00,
    tax: 100.00,
    items: [
      { name: "iPhone 14 Screen", quantity: 5, purchasePrice: 200.00, total: 1000.00 },
      { name: "Phone Cases", quantity: 20, purchasePrice: 10.00, total: 200.00 },
    ],
  },
  {
    id: "2",
    invoiceNo: "INV-2024-002",
    supplierName: "Mobile Parts Ltd.",
    date: "2024-01-14",
    totalAmount: 890.50,
    paymentStatus: "partial",
    paymentMade: 500.00,
    balance: 390.50,
    discount: 0.00,
    tax: 71.24,
    items: [
      { name: "Samsung Batteries", quantity: 10, purchasePrice: 75.00, total: 750.00 },
      { name: "Charging Cables", quantity: 15, purchasePrice: 4.50, total: 67.50 },
    ],
  },
  {
    id: "3",
    invoiceNo: "INV-2024-003",
    supplierName: "Accessories Hub",
    date: "2024-01-16",
    totalAmount: 567.80,
    paymentStatus: "due",
    paymentMade: 0.00,
    balance: 567.80,
    discount: 25.00,
    tax: 45.42,
    items: [
      { name: "Screen Protectors", quantity: 50, purchasePrice: 8.00, total: 400.00 },
      { name: "Headphones", quantity: 12, purchasePrice: 15.00, total: 180.00 },
    ],
  },
];

const mockSuppliers = ["TechSupply Co.", "Mobile Parts Ltd.", "Accessories Hub", "Wholesale Direct"];

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [formData, setFormData] = useState({
    supplierName: "",
    date: "",
    invoiceNo: "",
    discount: "0",
    tax: "8",
    paymentMade: "0",
  });
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    purchasePrice: "",
  });
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [newItemForm, setNewItemForm] = useState({
    name: "",
    category: "",
    purchasePrice: "",
    salePrice: "",
    stock: "",
    barcode: "",
  });

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || purchase.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return "bg-green-500 text-white";
      case 'partial': return "bg-yellow-500 text-white";
      case 'due': return "bg-red-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const totalPurchases = purchases.length;
  const totalAmount = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  const totalDue = purchases.reduce((sum, purchase) => sum + purchase.balance, 0);
  const paidPurchases = purchases.filter(p => p.paymentStatus === 'paid').length;

  const addItemToPurchase = () => {
    if (!newItem.name || !newItem.quantity || !newItem.purchasePrice) {
      toast({
        title: "Error",
        description: "Please fill all item fields",
        variant: "destructive",
      });
      return;
    }

    const quantity = parseInt(newItem.quantity);
    const purchasePrice = parseFloat(newItem.purchasePrice);
    const total = quantity * purchasePrice;

    const item: PurchaseItem = {
      name: newItem.name,
      quantity,
      purchasePrice,
      total,
    };

    setPurchaseItems([...purchaseItems, item]);
    setNewItem({ name: "", quantity: "", purchasePrice: "" });
  };

  const removeItemFromPurchase = (index: number) => {
    setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = purchaseItems.reduce((sum, item) => sum + item.total, 0);
    const discount = parseFloat(formData.discount) || 0;
    const taxRate = parseFloat(formData.tax) || 0;
    const afterDiscount = subtotal - discount;
    const tax = (afterDiscount * taxRate) / 100;
    const grandTotal = afterDiscount + tax;
    const paymentMade = parseFloat(formData.paymentMade) || 0;
    const balance = grandTotal - paymentMade;

    return { subtotal, discount, tax, grandTotal, balance };
  };

  const handleAddPurchase = () => {
    if (!formData.supplierName || !formData.invoiceNo || purchaseItems.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in required fields and add at least one item",
        variant: "destructive",
      });
      return;
    }

    const { grandTotal, balance } = calculateTotals();
    const paymentMade = parseFloat(formData.paymentMade) || 0;
    let paymentStatus: 'paid' | 'partial' | 'due' = 'due';
    
    if (paymentMade >= grandTotal) {
      paymentStatus = 'paid';
    } else if (paymentMade > 0) {
      paymentStatus = 'partial';
    }

    const newPurchase: Purchase = {
      id: Date.now().toString(),
      invoiceNo: formData.invoiceNo,
      supplierName: formData.supplierName,
      date: formData.date || new Date().toISOString().split('T')[0],
      totalAmount: grandTotal,
      paymentStatus,
      paymentMade,
      balance: Math.max(0, balance),
      items: [...purchaseItems],
      discount: parseFloat(formData.discount) || 0,
      tax: parseFloat(formData.tax) || 0,
    };

    setPurchases([...purchases, newPurchase]);
    
    // Reset form
    setFormData({
      supplierName: "",
      date: "",
      invoiceNo: "",
      discount: "0",
      tax: "8",
      paymentMade: "0",
    });
    setPurchaseItems([]);
    setShowAddDialog(false);
    
    toast({
      title: "Success",
      description: "Purchase added successfully",
    });
  };

  const handleDeletePurchase = (id: string) => {
    setPurchases(purchases.filter(purchase => purchase.id !== id));
    toast({
      title: "Success",
      description: "Purchase deleted successfully",
    });
  };

  const handleAddNewItem = () => {
    if (!newItemForm.name || !newItemForm.purchasePrice) {
      toast({
        title: "Error",
        description: "Please fill in required fields (Name and Purchase Price)",
        variant: "destructive",
      });
      return;
    }

    // Add the new item to our items list (in a real app, this would be saved to database)
    toast({
      title: "Success",
      description: "New item added successfully",
    });

    // Auto-fill the purchase form with the new item
    setNewItem({
      name: newItemForm.name,
      quantity: "1",
      purchasePrice: newItemForm.purchasePrice,
    });

    // Reset the new item form
    setNewItemForm({
      name: "",
      category: "",
      purchasePrice: "",
      salePrice: "",
      stock: "",
      barcode: "",
    });

    setShowAddItemDialog(false);
  };

  const printInvoice = (purchase: Purchase) => {
    toast({
      title: "Printing Invoice",
      description: `Printing invoice ${purchase.invoiceNo}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Purchases</h1>
          <p className="text-muted-foreground mt-2">Manage supplier purchases and track payments</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Purchase
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPurchases}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Due</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">${totalDue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Purchases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidPurchases}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice number or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="due">Due</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Purchases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-medium">{purchase.invoiceNo}</TableCell>
                  <TableCell>{purchase.supplierName}</TableCell>
                  <TableCell>{purchase.date}</TableCell>
                  <TableCell>${purchase.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getPaymentStatusColor(purchase.paymentStatus)}>
                      {purchase.paymentStatus.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={purchase.balance > 0 ? 'text-destructive font-semibold' : ''}>
                      ${purchase.balance.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPurchase(purchase);
                          setShowDetailDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => printInvoice(purchase)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePurchase(purchase.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Purchase Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Purchase</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Purchase Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplierName">Supplier *</Label>
                <Select value={formData.supplierName} onValueChange={(value) => setFormData({ ...formData, supplierName: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSuppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceNo">Invoice Number *</Label>
                <Input
                  id="invoiceNo"
                  value={formData.invoiceNo}
                  onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            {/* Add Items Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Item Name</Label>
                    <Input
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="Enter item name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                      placeholder="Qty"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Purchase Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newItem.purchasePrice}
                      onChange={(e) => setNewItem({ ...newItem, purchasePrice: e.target.value })}
                      placeholder="Price"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <div className="flex gap-2">
                      <Button onClick={addItemToPurchase} className="flex-1">
                        Add to Purchase
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowAddItemDialog(true)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        New Item
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                {purchaseItems.length > 0 && (
                  <div className="space-y-2">
                    <Label>Added Items</Label>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {purchaseItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${item.purchasePrice.toFixed(2)}</TableCell>
                            <TableCell>${item.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItemFromPurchase(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Totals and Payment */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Discount ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tax (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.tax}
                        onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Made ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.paymentMade}
                      onChange={(e) => setFormData({ ...formData, paymentMade: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const { subtotal, discount, tax, grandTotal, balance } = calculateTotals();
                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Discount:</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-semibold">
                          <span>Grand Total:</span>
                          <span>${grandTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment Made:</span>
                          <span>${(parseFloat(formData.paymentMade) || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Balance:</span>
                          <span className={balance > 0 ? 'text-destructive' : ''}>${Math.max(0, balance).toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddPurchase}>Add Purchase</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Purchase Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Purchase Details</DialogTitle>
          </DialogHeader>
          {selectedPurchase && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-semibold">Invoice Number</Label>
                  <p>{selectedPurchase.invoiceNo}</p>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Supplier</Label>
                  <p>{selectedPurchase.supplierName}</p>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Date</Label>
                  <p>{selectedPurchase.date}</p>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold">Payment Status</Label>
                  <Badge className={getPaymentStatusColor(selectedPurchase.paymentStatus)}>
                    {selectedPurchase.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Items Purchased</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPurchase.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.purchasePrice.toFixed(2)}</TableCell>
                          <TableCell>${item.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${(selectedPurchase.totalAmount - selectedPurchase.tax + selectedPurchase.discount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span>-${selectedPurchase.discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${selectedPurchase.tax.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold">
                      <span>Total Amount:</span>
                      <span>${selectedPurchase.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Made:</span>
                      <span>${selectedPurchase.paymentMade.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Balance:</span>
                      <span className={selectedPurchase.balance > 0 ? 'text-destructive' : ''}>${selectedPurchase.balance.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-2">
                <Button onClick={() => printInvoice(selectedPurchase)} className="gap-2">
                  <FileText className="h-4 w-4" />
                  Print Invoice
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Item Dialog */}
      <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name *</Label>
              <Input
                id="itemName"
                value={newItemForm.name}
                onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                placeholder="Enter item name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemCategory">Category</Label>
              <Input
                id="itemCategory"
                value={newItemForm.category}
                onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value })}
                placeholder="Enter category"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemPurchasePrice">Purchase Price *</Label>
                <Input
                  id="itemPurchasePrice"
                  type="number"
                  step="0.01"
                  value={newItemForm.purchasePrice}
                  onChange={(e) => setNewItemForm({ ...newItemForm, purchasePrice: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemSalePrice">Sale Price</Label>
                <Input
                  id="itemSalePrice"
                  type="number"
                  step="0.01"
                  value={newItemForm.salePrice}
                  onChange={(e) => setNewItemForm({ ...newItemForm, salePrice: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemStock">Stock Quantity</Label>
              <Input
                id="itemStock"
                type="number"
                value={newItemForm.stock}
                onChange={(e) => setNewItemForm({ ...newItemForm, stock: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemBarcode">Barcode</Label>
              <Input
                id="itemBarcode"
                value={newItemForm.barcode}
                onChange={(e) => setNewItemForm({ ...newItemForm, barcode: e.target.value })}
                placeholder="Enter barcode"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddItemDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNewItem}>
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}