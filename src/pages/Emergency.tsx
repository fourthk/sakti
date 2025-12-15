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

interface EmergencyItem {
  id: string;
  emergency_code: string;
  title: string;
  description: string;
  impacted_asset_id: string;
  reporter_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  photo_url: string;
  note: string;
  emergency_impacted_assets: any[];
}

const getStatusBadgeVariant = (status: string) => {
  const variants: Record<string, "destructive" | "warning" | "success" | "secondary"> = {
    Open: "destructive",
    "In Progress": "warning",
    Resolved: "success",
    Closed: "secondary",
  };
  return variants[status] || "secondary";
};

const Emergency = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [emergencies, setEmergencies] = useState<EmergencyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmergencies = async () => {
      console.log("[Emergency] Fetching emergency list...");
      try {
        const response = await api.getEmergencies();
        console.log("[Emergency] Data received:", response);
        // Extract data array from response.data
        const dataArray = response?.data || response || [];
        console.log("[Emergency] Extracted data:", dataArray);
        setEmergencies(Array.isArray(dataArray) ? dataArray : []);
      } catch (error) {
        console.error("[Emergency] Failed to fetch emergencies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencies();
  }, []);

  const filteredData = emergencies.filter((item) => {
    const matchesSearch = 
      item.id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.emergency_code?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <h1 className="page-title">Emergency</h1>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search emergency..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
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
              <TableHead>Description</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">No data found</TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.emergency_code || item.id}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{item.description}</TableCell>
                  <TableCell>{item.reporter_id}</TableCell>
                  <TableCell><Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/emergency/${item.id}`)}>Detail</DropdownMenuItem>
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

export default Emergency;
