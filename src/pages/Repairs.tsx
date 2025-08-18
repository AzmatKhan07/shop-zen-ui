import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
import { Search, Plus, Edit, Trash2, Eye, Wrench, Clock, CheckCircle, Package } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RepairJob {
  id: string;
  jobId: string;
  customerName: string;
  device: string;
  imei: string;
  issue: string;
  status: 'received' | 'in-progress' | 'completed' | 'delivered';
  technician: string;
  estimatedCost: number;
  finalCost?: number;
  createdAt: string;
  partsUsed?: string[];
}

// Mock data
const mockRepairJobs: RepairJob[] = [
  {
    id: "1",
    jobId: "REP001",
    customerName: "John Smith",
    device: "iPhone 14 Pro",
    imei: "123456789012345",
    issue: "Cracked screen replacement",
    status: "in-progress",
    technician: "Mike Johnson",
    estimatedCost: 299.99,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    jobId: "REP002",
    customerName: "Sarah Wilson",
    device: "Samsung Galaxy S23",
    imei: "987654321098765",
    issue: "Battery replacement",
    status: "completed",
    technician: "David Lee",
    estimatedCost: 89.99,
    finalCost: 89.99,
    createdAt: "2024-01-14",
    partsUsed: ["Battery", "Adhesive strips"],
  },
  {
    id: "3",
    jobId: "REP003",
    customerName: "Mike Brown",
    device: "iPhone 13",
    imei: "456789123456789",
    issue: "Water damage diagnosis and repair",
    status: "received",
    technician: "Alex Chen",
    estimatedCost: 150.00,
    createdAt: "2024-01-16",
  },
];

const technicians = ["Mike Johnson", "David Lee", "Alex Chen", "Emma Davis"];

export default function Repairs() {
  const [repairJobs, setRepairJobs] = useState<RepairJob[]>(mockRepairJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<RepairJob | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    device: "",
    imei: "",
    issue: "",
    estimatedCost: "",
    technician: "",
  });

  const filteredJobs = repairJobs.filter(job => {
    const matchesSearch = job.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.device.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return "bg-muted text-muted-foreground";
      case 'in-progress': return "bg-blue-500 text-white";
      case 'completed': return "bg-green-500 text-white";
      case 'delivered': return "bg-purple-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received': return <Package className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const totalJobs = repairJobs.length;
  const inProgressJobs = repairJobs.filter(job => job.status === 'in-progress').length;
  const completedJobs = repairJobs.filter(job => job.status === 'completed').length;
  const totalRevenue = repairJobs.reduce((sum, job) => sum + (job.finalCost || job.estimatedCost), 0);

  const handleAddJob = () => {
    if (!formData.customerName || !formData.device || !formData.issue) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }

    const newJob: RepairJob = {
      id: Date.now().toString(),
      jobId: `REP${String(repairJobs.length + 1).padStart(3, '0')}`,
      customerName: formData.customerName,
      device: formData.device,
      imei: formData.imei,
      issue: formData.issue,
      status: 'received',
      technician: formData.technician,
      estimatedCost: parseFloat(formData.estimatedCost) || 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setRepairJobs([...repairJobs, newJob]);
    setFormData({
      customerName: "",
      device: "",
      imei: "",
      issue: "",
      estimatedCost: "",
      technician: "",
    });
    setShowAddDialog(false);
    toast({
      title: "Success",
      description: "Repair job added successfully",
    });
  };

  const handleDeleteJob = (id: string) => {
    setRepairJobs(repairJobs.filter(job => job.id !== id));
    toast({
      title: "Success",
      description: "Repair job deleted successfully",
    });
  };

  const updateJobStatus = (jobId: string, newStatus: RepairJob['status']) => {
    setRepairJobs(repairJobs.map(job => 
      job.id === jobId ? { ...job, status: newStatus } : job
    ));
    toast({
      title: "Status Updated",
      description: "Job status updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mobile Repairs</h1>
          <p className="text-muted-foreground mt-2">Manage repair jobs and track progress</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Repair Job
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressJobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedJobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
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
                placeholder="Search by Job ID, customer, or device..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Repair Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Repair Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Estimated Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.jobId}</TableCell>
                  <TableCell>{job.customerName}</TableCell>
                  <TableCell>{job.device}</TableCell>
                  <TableCell className="max-w-xs truncate">{job.issue}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(job.status)} gap-1`}>
                      {getStatusIcon(job.status)}
                      {job.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.technician}</TableCell>
                  <TableCell>${job.estimatedCost.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedJob(job);
                          setShowDetailDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteJob(job.id)}
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

      {/* Add Job Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Repair Job</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="device">Device Model *</Label>
                <Input
                  id="device"
                  value={formData.device}
                  onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imei">IMEI/Serial Number</Label>
              <Input
                id="imei"
                value={formData.imei}
                onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue">Issue Description *</Label>
              <Textarea
                id="issue"
                value={formData.issue}
                onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedCost">Estimated Cost</Label>
                <Input
                  id="estimatedCost"
                  type="number"
                  step="0.01"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="technician">Assign Technician</Label>
                <Select value={formData.technician} onValueChange={(value) => setFormData({ ...formData, technician: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians.map((tech) => (
                      <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddJob}>Add Job</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Job Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Repair Job Details</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedJob.jobId}</h3>
                    <p className="text-muted-foreground">Created: {selectedJob.createdAt}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Customer</Label>
                    <p>{selectedJob.customerName}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Device</Label>
                    <p>{selectedJob.device}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">IMEI/Serial</Label>
                    <p>{selectedJob.imei || "Not provided"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="font-semibold">Status</Label>
                    <div className="mt-1">
                      <Badge className={`${getStatusColor(selectedJob.status)} gap-1`}>
                        {getStatusIcon(selectedJob.status)}
                        {selectedJob.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="font-semibold">Technician</Label>
                    <p>{selectedJob.technician}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Estimated Cost</Label>
                    <p>${selectedJob.estimatedCost.toFixed(2)}</p>
                  </div>
                  {selectedJob.finalCost && (
                    <div>
                      <Label className="font-semibold">Final Cost</Label>
                      <p>${selectedJob.finalCost.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label className="font-semibold">Issue Description</Label>
                <p className="mt-1 text-sm">{selectedJob.issue}</p>
              </div>

              {selectedJob.partsUsed && (
                <div>
                  <Label className="font-semibold">Parts Used</Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedJob.partsUsed.map((part, index) => (
                      <Badge key={index} variant="outline">{part}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Update Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button
                      variant={selectedJob.status === 'received' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateJobStatus(selectedJob.id, 'received')}
                    >
                      Received
                    </Button>
                    <Button
                      variant={selectedJob.status === 'in-progress' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateJobStatus(selectedJob.id, 'in-progress')}
                    >
                      In Progress
                    </Button>
                    <Button
                      variant={selectedJob.status === 'completed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateJobStatus(selectedJob.id, 'completed')}
                    >
                      Completed
                    </Button>
                    <Button
                      variant={selectedJob.status === 'delivered' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateJobStatus(selectedJob.id, 'delivered')}
                    >
                      Delivered
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}