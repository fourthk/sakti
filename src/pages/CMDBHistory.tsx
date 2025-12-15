import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

interface HistoryItem {
  id: string;
  changeType: string;
  beforeValue: string;
  afterValue: string;
  changedBy: string;
  changeDate: string;
}

const CMDBHistory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [changeTypeFilter, setChangeTypeFilter] = useState("all");
  const [changedByFilter, setChangedByFilter] = useState("all");
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      console.log(`[CMDBHistory] Fetching asset history for ID: ${id}...`);
      try {
        const response = await api.getAssetHistory(id || "");
        console.log("[CMDBHistory] History data received:", response);
        
        // Extract data from response.data
        const dataArray = response?.data || response || [];
        console.log("[CMDBHistory] Extracted data:", dataArray);
        
        const formattedHistory = (Array.isArray(dataArray) ? dataArray : []).map((item: any) => ({
          id: item.id || item.history_id || "",
          changeType: item.change_type || item.field_changed || "",
          beforeValue: item.before_value || item.old_value || "",
          afterValue: item.after_value || item.new_value || "",
          changedBy: item.changed_by || item.user || "",
          changeDate: item.change_date || item.created_at || "",
        }));
        
        setHistoryData(formattedHistory);
      } catch (error) {
        console.error("[CMDBHistory] Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHistory();
    }
  }, [id]);

  const uniqueChangeTypes = [...new Set(historyData.map(item => item.changeType).filter(Boolean))];
  const uniqueChangedBy = [...new Set(historyData.map(item => item.changedBy).filter(Boolean))];

  const filteredData = historyData.filter((item) => {
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.beforeValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.afterValue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChangeType = changeTypeFilter === "all" || item.changeType === changeTypeFilter;
    const matchesChangedBy = changedByFilter === "all" || item.changedBy === changedByFilter;
    return matchesSearch && matchesChangeType && matchesChangedBy;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="page-title">Asset History - {id}</h1>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search history..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={changeTypeFilter} onValueChange={setChangeTypeFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Change Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueChangeTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={changedByFilter} onValueChange={setChangedByFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Changed By" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {uniqueChangedBy.map((user) => <SelectItem key={user} value={user}>{user}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>History ID</TableHead>
              <TableHead>Change Type</TableHead>
              <TableHead>Before Value</TableHead>
              <TableHead>After Value</TableHead>
              <TableHead>Changed By</TableHead>
              <TableHead>Change Date/Time</TableHead>
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
                  No history found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.changeType}</TableCell>
                  <TableCell className="text-muted-foreground">{item.beforeValue}</TableCell>
                  <TableCell className="font-medium">{item.afterValue}</TableCell>
                  <TableCell>{item.changedBy}</TableCell>
                  <TableCell>{item.changeDate ? new Date(item.changeDate).toLocaleString('id-ID') : "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default CMDBHistory;
