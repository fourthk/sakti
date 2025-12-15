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

interface PatchResultItem {
  id: string;
  job_id: string;
  patch_id: string;
  title: string;
  scope_asset: string;
  version_before: string;
  version_after: string;
  technician_name: string;
  start_date: string;
  end_date: string;
  status: string;
  dinas: string;
}

// Valid result statuses for Patch Results
const RESULT_STATUSES = ["Partially Failed", "Failed", "Succeeded"];

const getStatusBadgeVariant = (status: string) => {
  const variants: Record<string, "success" | "destructive" | "warning" | "info"> = {
    "Succeeded": "success",
    "Failed": "destructive",
    "Partially Failed": "warning",
  };
  return variants[status] || "secondary";
};

const PatchResults = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [patchResults, setPatchResults] = useState<PatchResultItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatchResults = async () => {
      console.log("[PatchResults] Fetching patch results...");
      try {
        const response = await api.getPatchJobs();
        console.log("[PatchResults] Data received:", response);
        const dataArray = response?.data || response || [];
        // Filter only records with Partially Failed, Failed, or Succeeded status
        const filteredResults = (Array.isArray(dataArray) ? dataArray : []).filter(
          (item: PatchResultItem) => RESULT_STATUSES.includes(item.status)
        );
        console.log("[PatchResults] Filtered results:", filteredResults);
        setPatchResults(filteredResults);
      } catch (error) {
        console.error("[PatchResults] Failed to fetch patch results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatchResults();
  }, []);

  const filteredData = patchResults.filter((item) => {
    const matchesSearch = 
      item.job_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patch_id?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.scope_asset?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatVersion = (before: string, after: string) => {
    if (before && after) return `${before} → ${after}`;
    return before || after || "-";
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <h1 className="page-title">Patch Results</h1>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search results..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Results" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Results</SelectItem>
              <SelectItem value="Succeeded">Succeeded</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
              <SelectItem value="Partially Failed">Partially Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job ID</TableHead>
              <TableHead>Patch ID</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Executed By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Dinas</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">No data found</TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.job_id || "-"}</TableCell>
                  <TableCell>{item.patch_id || "-"}</TableCell>
                  <TableCell>{item.scope_asset || item.title || "-"}</TableCell>
                  <TableCell>{formatVersion(item.version_before, item.version_after)}</TableCell>
                  <TableCell>{item.technician_name || "-"}</TableCell>
                  <TableCell>{formatDate(item.end_date || item.start_date)}</TableCell>
                  <TableCell><Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge></TableCell>
                  <TableCell>{item.dinas || "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/patch-results/${item.id}`)}>Detail</DropdownMenuItem>
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

export default PatchResults;
