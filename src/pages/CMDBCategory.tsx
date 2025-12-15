import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, MoreVertical, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockAssets = [
  {
    id: 1,
    category: "Infrastructure",
    parentId: "PAR001",
    assetId: "AST001",
    assetType: "Server",
    hostname: "srv-prod-01",
    ipAddress: "192.168.1.10",
    osName: "Ubuntu",
    osVersion: "22.04 LTS",
    vendor: "Dell",
    location: "Data Center A",
    ownerDepartment: "IT Operations",
    responsiblePerson: "John Doe",
    status: "Active",
    description: "Production server for web applications",
    created: "2024-01-15",
    lastUpdate: "2024-03-10",
  },
  {
    id: 2,
    category: "Infrastructure",
    parentId: "PAR001",
    assetId: "AST002",
    assetType: "Network Device",
    hostname: "sw-core-01",
    ipAddress: "192.168.1.1",
    osName: "Cisco IOS",
    osVersion: "15.2",
    vendor: "Cisco",
    location: "Data Center A",
    ownerDepartment: "Network Team",
    responsiblePerson: "Jane Smith",
    status: "Active",
    description: "Core switch for network backbone",
    created: "2024-01-20",
    lastUpdate: "2024-03-08",
  },
];

const CMDBCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<typeof mockAssets[0] | null>(null);
  const [newStatus, setNewStatus] = useState("");

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  const getCategoryColor = (cat: string) => {
    return "bg-blue-100 text-blue-800 border-blue-300";
  };

  const handleChangeStatus = (asset: typeof mockAssets[0]) => {
    setSelectedAsset(asset);
    setNewStatus(asset.status);
    setIsStatusModalOpen(true);
  };

  const handleStatusSubmit = () => {
    // Handle status update logic here
    setIsStatusModalOpen(false);
    setSelectedAsset(null);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/cmdb")}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Back to CMDB"
        >
          <ArrowLeft size={24} />
        </button>
        <h1
          className="text-5xl font-bold"
          style={{ color: "#253040" }}
        >
          {category}
        </h1>
      </div>

      {/* Search and Filter Section */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            style={{ color: "#384E66" }}
            size={20}
          />
          <Input
            placeholder="Search assets..."
            className="pl-10 bg-white font-medium"
            style={{ 
              borderRadius: "8px",
              borderColor: "#384E66",
              borderWidth: "2px"
            }}
          />
        </div>
        <Select defaultValue="All">
          <SelectTrigger 
            className="w-40" 
            style={{ backgroundColor: "#384E66", color: "white", borderColor: "#384E66" }}
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="Retired">Retired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div
        className="rounded-lg overflow-hidden shadow-sm mb-6"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
        }}
      >
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: "#384E66" }}>
              <TableHead className="text-white font-semibold">ID</TableHead>
              <TableHead className="text-white font-semibold">Category</TableHead>
              <TableHead className="text-white font-semibold">Parent ID</TableHead>
              <TableHead className="text-white font-semibold">Asset ID</TableHead>
              <TableHead className="text-white font-semibold">Asset Type</TableHead>
              <TableHead className="text-white font-semibold">Hostname</TableHead>
              <TableHead className="text-white font-semibold">IP Address</TableHead>
              <TableHead className="text-white font-semibold">OS Name</TableHead>
              <TableHead className="text-white font-semibold">OS Version</TableHead>
              <TableHead className="text-white font-semibold">Vendor</TableHead>
              <TableHead className="text-white font-semibold">Location</TableHead>
              <TableHead className="text-white font-semibold">Owner Department</TableHead>
              <TableHead className="text-white font-semibold">Responsible Person</TableHead>
              <TableHead className="text-white font-semibold">Status</TableHead>
              <TableHead className="text-white font-semibold">Description</TableHead>
              <TableHead className="text-white font-semibold">Created</TableHead>
              <TableHead className="text-white font-semibold">Last Update</TableHead>
              <TableHead className="text-white font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAssets.map((asset) => (
              <TableRow key={asset.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{asset.id}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getCategoryColor(asset.category)}
                  >
                    {asset.category}
                  </Badge>
                </TableCell>
                <TableCell>{asset.parentId}</TableCell>
                <TableCell>{asset.assetId}</TableCell>
                <TableCell>{asset.assetType}</TableCell>
                <TableCell>{asset.hostname}</TableCell>
                <TableCell>{asset.ipAddress}</TableCell>
                <TableCell>{asset.osName}</TableCell>
                <TableCell>{asset.osVersion}</TableCell>
                <TableCell>{asset.vendor}</TableCell>
                <TableCell>{asset.location}</TableCell>
                <TableCell>{asset.ownerDepartment}</TableCell>
                <TableCell>{asset.responsiblePerson}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStatusColor(asset.status)}
                  >
                    {asset.status}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{asset.description}</TableCell>
                <TableCell>{asset.created}</TableCell>
                <TableCell>{asset.lastUpdate}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white z-50">
                      <DropdownMenuItem
                        onClick={() => navigate(`/cmdb/detail/${asset.id}`)}
                      >
                        Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate(`/cmdb/history/${asset.id}`)}
                      >
                        History
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleChangeStatus(asset)}>
                        Change Status
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log("Edit asset:", asset.id)}>
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={currentPage === 1} onClick={() => setCurrentPage(1)}>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={currentPage === 2} onClick={() => setCurrentPage(2)}>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={currentPage === 3} onClick={() => setCurrentPage(3)}>
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
              className={currentPage === 3 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Change Status Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold" style={{ color: "#253040" }}>
              Change Status
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="w-full border-2" style={{ borderColor: "#384E66", borderRadius: "12px" }}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsStatusModalOpen(false)}
              variant="outline"
              className="flex-1"
              style={{ borderColor: "#384E66", borderRadius: "8px", borderWidth: "2px" }}
            >
              cancel
            </Button>
            <Button
              onClick={handleStatusSubmit}
              className="flex-1"
              style={{ backgroundColor: "#384E66", color: "white", borderRadius: "8px" }}
            >
              ok
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CMDBCategory;
