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

interface CMDBItem {
  id: string;
  kode_bmd: string;
  name: string;
  category: string;
  subCategory: string;
  serialNumber: string;
  condition: string;
  status: string;
  dinas: string;
  location: string;
}

const getStatusBadgeVariant = (status: string) => {
  const statusLower = status?.toLowerCase() || "";
  if (statusLower === "active" || statusLower === "aktif") return "success";
  if (statusLower === "inactive" || statusLower === "tidak aktif") return "secondary";
  if (statusLower === "maintenance") return "warning";
  if (statusLower === "retired") return "destructive";
  return "secondary";
};

const getConditionBadgeVariant = (condition: string) => {
  const conditionLower = condition?.toLowerCase() || "";
  if (conditionLower === "good" || conditionLower === "baik") return "success";
  if (conditionLower === "fair" || conditionLower === "cukup") return "warning";
  if (conditionLower === "poor" || conditionLower === "rusak") return "destructive";
  return "secondary";
};

const CMDB = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assets, setAssets] = useState<CMDBItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      console.log("[CMDB] Fetching assets...");
      try {
        const response = await api.getAssets();
        console.log("[CMDB] Assets received:", response);
        
        const dataArray = response?.data || response || [];
        const formattedAssets = (Array.isArray(dataArray) ? dataArray : []).map((item: any) => ({
          id: item.id || "",
          kode_bmd: item.kode_bmd || "",
          name: item.nama_aset || item.name || "",
          category: item.kategori || item.category || "",
          subCategory: item.sub_kategori || item.sub_category || "",
          serialNumber: item.nomor_seri || item.serial_number || "",
          condition: item.kondisi || item.condition || "",
          status: item.status || "",
          dinas: item.penanggung_jawab || item.dinas || "",
          location: item.lokasi || item.location || "",
        }));
        
        console.log("[CMDB] Formatted assets:", formattedAssets);
        setAssets(formattedAssets);
      } catch (error) {
        console.error("[CMDB] Failed to fetch assets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const filteredData = assets.filter((item) => {
    const matchesSearch =
      item.kode_bmd.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <h1 className="page-title">CMDB</h1>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search asset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="aktif">Aktif</SelectItem>
              <SelectItem value="tidak aktif">Tidak Aktif</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>BMD ID & No. Seri</TableHead>
              <TableHead>Nama Aset</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Sub Kategori</TableHead>
              <TableHead>Kondisi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No assets found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-blue-700">{item.kode_bmd || "-"}</span>
                      <span className="text-gray-500 text-sm">{item.serialNumber || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.subCategory}</TableCell>
                  <TableCell>
                    <Badge variant={getConditionBadgeVariant(item.condition) as any}>{item.condition}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(item.status) as any}>{item.status}</Badge>
                  </TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card">
                        <DropdownMenuItem onClick={() => navigate(`/cmdb/${item.id}`)}>Detail</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/cmdb/${item.id}/history`)}>History</DropdownMenuItem>
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

export default CMDB;
