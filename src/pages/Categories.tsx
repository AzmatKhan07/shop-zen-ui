import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Tags,
  ChevronRight,
  Folder,
  FolderOpen
} from "lucide-react";

const mockCategories = [
  {
    id: 1,
    name: "Electronics",
    itemCount: 45,
    subcategories: [
      { id: 11, name: "Smartphones", itemCount: 15 },
      { id: 12, name: "Laptops", itemCount: 8 },
      { id: 13, name: "Tablets", itemCount: 12 },
      { id: 14, name: "Smart Watches", itemCount: 10 }
    ]
  },
  {
    id: 2,
    name: "Accessories",
    itemCount: 67,
    subcategories: [
      { id: 21, name: "Phone Cases", itemCount: 25 },
      { id: 22, name: "Chargers", itemCount: 18 },
      { id: 23, name: "Headphones", itemCount: 14 },
      { id: 24, name: "Screen Protectors", itemCount: 10 }
    ]
  },
  {
    id: 3,
    name: "Computers",
    itemCount: 23,
    subcategories: [
      { id: 31, name: "Desktop", itemCount: 8 },
      { id: 32, name: "Gaming", itemCount: 7 },
      { id: 33, name: "Peripherals", itemCount: 8 }
    ]
  },
  {
    id: 4,
    name: "Home & Garden",
    itemCount: 12,
    subcategories: [
      { id: 41, name: "Smart Home", itemCount: 7 },
      { id: 42, name: "Outdoor", itemCount: 5 }
    ]
  }
];

export default function Categories() {
  const [categories, setCategories] = useState(mockCategories);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([1, 2]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddSubDialogOpen, setIsAddSubDialogOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const totalItems = categories.reduce((sum, cat) => sum + cat.itemCount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2">
          <Tags className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Categories Management</h1>
            <p className="text-muted-foreground">Organize your products with categories and subcategories</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Dialog open={isAddSubDialogOpen} onOpenChange={setIsAddSubDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Subcategory
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Subcategory</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="parentCategory">Parent Category</Label>
                  <select className="w-full px-3 py-2 border rounded-md bg-background">
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="subcategoryName">Subcategory Name</Label>
                  <Input id="subcategoryName" placeholder="Enter subcategory name" />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" onClick={() => setIsAddSubDialogOpen(false)}>
                    Save Subcategory
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddSubDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input id="categoryName" placeholder="Enter category name" />
                </div>
                <div>
                  <Label htmlFor="categoryDescription">Description (Optional)</Label>
                  <Input id="categoryDescription" placeholder="Brief description" />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" onClick={() => setIsAddDialogOpen(false)}>
                    Save Category
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:bg-shop-card-hover transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Categories
            </CardTitle>
            <Tags className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
        
        <Card className="hover:bg-shop-card-hover transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Subcategories
            </CardTitle>
            <Folder className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:bg-shop-card-hover transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Items
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>

        <Card className="hover:bg-shop-card-hover transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Items/Category
            </CardTitle>
            <Tags className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totalItems / categories.length)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Tree */}
      <Card>
        <CardHeader>
          <CardTitle>Category Tree</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="border rounded-lg">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-shop-card-hover rounded-lg"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center space-x-3">
                    <button className="text-muted-foreground hover:text-foreground">
                      <ChevronRight 
                        className={`h-4 w-4 transition-transform ${
                          expandedCategories.includes(category.id) ? 'rotate-90' : ''
                        }`} 
                      />
                    </button>
                    <Folder className="h-5 w-5 text-primary" />
                    <span className="font-medium">{category.name}</span>
                    <Badge variant="secondary">
                      {category.itemCount} items
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                      <Trash2 className="h-3 w-3 text-status-danger" />
                    </Button>
                  </div>
                </div>
                
                {expandedCategories.includes(category.id) && (
                  <div className="pl-12 pr-4 pb-4 space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <div 
                        key={subcategory.id}
                        className="flex items-center justify-between p-3 bg-shop-bg rounded-lg hover:bg-shop-card-hover"
                      >
                        <div className="flex items-center space-x-3">
                          <Folder className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{subcategory.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {subcategory.itemCount}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-3 w-3 text-status-danger" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}