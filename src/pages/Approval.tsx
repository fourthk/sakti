import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import { api } from "@/lib/api";

interface ApprovalItem {
  cr_id: string;
  tiket_id?: string;
  title: string;
  status: string;
  approval_status: string;
  type: string;
  risk_score?: number;
  created_at: string;
}

const Approval = () => {
  const navigate = useNavigate();
  const user = getUser();
  const userRole = user?.role;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovals = async () => {
      console.log("[Approval] Fetching approval data...");
      try {
        const response = await api.getChangeRequests();
        console.log("[Approval] Data received:", response);
        // Extract data array from response.data
        const dataArray = response?.data || response || [];
        console.log("[Approval] Extracted data:", dataArray);
        setApprovals(Array.isArray(dataArray) ? dataArray : []);
      } catch (error) {
        console.error("[Approval] Failed to fetch approvals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  // Filter data based on role access
  const getAccessibleTypes = (): string[] => {
    switch (userRole) {
      case "kasi":
        return ["minor", "standard", "major"]; // Access to all types
      case "kabid":
        return ["standard", "major"]; // Access to standard and major only
      case "diskominfo":
        return ["major"]; // Access to major only
      default:
        return [];
    }
  };

  const accessibleTypes = getAccessibleTypes();

  const filteredData = approvals.filter((item) => {
    // Role-based type filtering
    const itemType = item.type?.toLowerCase() || "";
    if (!accessibleTypes.includes(itemType)) return false;

    const matchesSearch =
      item.cr_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.approval_status === statusFilter;
    const matchesType = typeFilter === "all" || itemType === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium border";
    const statusUpper = status?.toUpperCase() || "";
    switch (statusUpper) {
      case "NEED APPROVAL":
      case "PENDING":
        return `${baseClasses} bg-orange-50 text-orange-600 border-orange-200`;
      case "APPROVED":
        return `${baseClasses} bg-green-50 text-green-600 border-green-200`;
      case "REJECTED":
        return `${baseClasses} bg-red-50 text-red-600 border-red-200`;
      case "REVISION":
      case "NEED_INFO":
        return `${baseClasses} bg-blue-50 text-blue-600 border-blue-200`;
      default:
        return baseClasses;
    }
  };

  const getTypeBadge = (type: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium border";
    const typeValue = type?.toLowerCase() || "";
    switch (typeValue) {
      case "minor":
        return `${baseClasses} bg-yellow-50 text-yellow-600 border-yellow-200`;
      case "standard":
        return `${baseClasses} bg-blue-50 text-blue-600 border-blue-200`;
      case "major":
        return `${baseClasses} bg-purple-50 text-purple-600 border-purple-200`;
      default:
        return baseClasses;
    }
  };

  // Get available type options based on role
  const getTypeFilterOptions = () => {
    const options = [{ value: "all", label: "Semua Jenis" }];
    if (accessibleTypes.includes("minor")) {
      options.push({ value: "minor", label: "Minor" });
    }
    if (accessibleTypes.includes("standard")) {
      options.push({ value: "standard", label: "Standard" });
    }
    if (accessibleTypes.includes("major")) {
      options.push({ value: "major", label: "Major" });
    }
    return options;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="hover:bg-muted p-1 rounded transition-colors"
        >
          <ArrowLeft size={24} style={{ color: "#384E66" }} />
        </button>
        <h1 className="text-2xl font-semibold" style={{ color: "#384E66" }}>
          Approval
        </h1>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari ticket ID atau judul..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]" style={{ borderColor: "#384E66" }}>
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="NEED_INFO">Need Info</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]" style={{ borderColor: "#384E66" }}>
              <SelectValue placeholder="Semua Jenis" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              {getTypeFilterOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: "#384E66" }}>
              <TableHead className="text-primary-foreground font-semibold">Ticket ID</TableHead>
              <TableHead className="text-primary-foreground font-semibold">Title</TableHead>
              <TableHead className="text-primary-foreground font-semibold">Status</TableHead>
              <TableHead className="text-primary-foreground font-semibold">Score</TableHead>
              <TableHead className="text-primary-foreground font-semibold">Type</TableHead>
              <TableHead className="text-primary-foreground font-semibold text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.cr_id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{item.tiket_id || item.cr_id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    <span className={getStatusBadge(item.approval_status)}>{item.approval_status}</span>
                  </TableCell>
                  <TableCell className="font-medium">{item.risk_score ?? "-"}</TableCell>
                  <TableCell>
                    <span className={getTypeBadge(item.type)}>{item.type}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card">
                        <DropdownMenuItem onClick={() => navigate(`/approval/${item.cr_id}`)}>
                          Detail
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Approval;
