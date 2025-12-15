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

interface ChangeResultItem {
  cr_id: string;
  id: string;
  tiket_id: string;
  title: string;
  status: string;
  ci_id: string;
  risk_score: number;
  type: string;
  created_at: string;
  implemented_by: string;
  implemented_at: string;
  dinas: string;
}

// Valid result statuses for Change Results
const RESULT_STATUSES = ["COMPLETED", "FAILED", "ENDED"];

const getStatusBadgeVariant = (status: string) => {
  const variants: Record<string, "success" | "destructive" | "warning" | "info" | "secondary" | "purple"> = {
    COMPLETED: "success",
    FAILED: "destructive",
    ENDED: "info",
  };
  return variants[status?.toUpperCase()] || "secondary";
};

const getTypeBadgeVariant = (type: string) => {
  const variants: Record<string, "secondary" | "info" | "destructive"> = {
    standard: "secondary",
    minor: "info",
    major: "destructive",
  };
  return variants[type?.toLowerCase()] || "secondary";
};

const ChangeResults = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [changeResults, setChangeResults] = useState<ChangeResultItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChangeResults = async () => {
      console.log("[ChangeResults] Fetching change results...");
      try {
        const response = await api.getChangeRequests();
        console.log("[ChangeResults] Data received:", response);
        const dataArray = response?.data || response || [];
        // Filter only records with COMPLETED, FAILED, or ENDED status
        const filteredResults = (Array.isArray(dataArray) ? dataArray : []).filter(
          (item: ChangeResultItem) => RESULT_STATUSES.includes(item.status?.toUpperCase())
        );
        console.log("[ChangeResults] Filtered results:", filteredResults);
        setChangeResults(filteredResults);
      } catch (error) {
        console.error("[ChangeResults] Failed to fetch change results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChangeResults();
  }, []);

  const filteredData = changeResults.filter((item) => {
    const matchesSearch = 
      item.tiket_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cr_id?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status?.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <h1 className="page-title">Change Results</h1>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search results..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="All Results" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Results</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="ENDED">Ended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dinas</TableHead>
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
                  <TableCell className="font-medium">{item.tiket_id || item.cr_id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell><Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge></TableCell>
                  <TableCell>{item.ci_id || "-"}</TableCell>
                  <TableCell>{item.risk_score || "-"}</TableCell>
                  <TableCell><Badge variant={getTypeBadgeVariant(item.type)}>{item.type || "-"}</Badge></TableCell>
                  <TableCell>{item.dinas || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/change-results/${item.cr_id || item.id}`)}>Detail</DropdownMenuItem>
                        {item.ci_id && (
                          <DropdownMenuItem onClick={() => navigate(`/cmdb/${item.ci_id}`)}>Change Asset</DropdownMenuItem>
                        )}
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

export default ChangeResults;
