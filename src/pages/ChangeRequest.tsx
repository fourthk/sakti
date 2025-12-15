import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";

interface ChangeRequestItem {
  cr_id: string;
  id: string;
  title: string;
  status: string;
  asset_id: string;
  risk_score: number;
  type: string;
  created_at: string;
  description: string;
}

const getStatusBadgeVariant = (status: string) => {
  const variants: Record<string, "purple" | "success" | "warning" | "info" | "secondary" | "destructive"> = {
    Submitted: "purple",
    Approved: "success",
    Scheduled: "warning",
    Implementing: "info",
    Completed: "secondary",
    Rejected: "destructive",
  };
  return variants[status] || "secondary";
};

const getTypeBadgeVariant = (type: string) => {
  const variants: Record<string, "secondary" | "info" | "destructive"> = {
    standard: "secondary",
    minor: "info",
    major: "destructive",
  };
  return variants[type?.toLowerCase()] || "secondary";
};

const ChangeRequest = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [changeRequests, setChangeRequests] = useState<ChangeRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChangeRequests = async () => {
      console.log("[ChangeRequest] Fetching change requests...");
      try {
        const response = await api.getChangeRequests();
        console.log("[ChangeRequest] Data received:", response);
        // Extract data array from response.data
        const dataArray = response?.data || response || [];
        console.log("[ChangeRequest] Formatted data:", dataArray);
        setChangeRequests(Array.isArray(dataArray) ? dataArray : []);
      } catch (error) {
        console.error("[ChangeRequest] Failed to fetch change requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChangeRequests();
  }, []);

  const filteredData = changeRequests.filter((item) => {
    const matchesSearch = 
      item.cr_id?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id?.toString().toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <h1 className="page-title">Change Request</h1>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search change request..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Implementing">Implementing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Received Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">No data found</TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.cr_id || item.id}>
                  <TableCell className="font-medium">{item.cr_id || item.id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell><Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge></TableCell>
                  <TableCell>{item.asset_id || "-"}</TableCell>
                  <TableCell>{item.risk_score || "-"}</TableCell>
                  <TableCell><Badge variant={getTypeBadgeVariant(item.type)}>{item.type || "-"}</Badge></TableCell>
                  <TableCell>{item.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/change-request/${item.cr_id || item.id}`)}>Detail</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ChangeRequest;
