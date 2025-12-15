import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

interface AssetExecution {
  id: string;
  name: string;
  result: "Complete" | "Uncomplete";
  startTime: string;
  endTime: string;
  note: string;
}

const mockPatchData = {
  id: "PCH-001",
  scope: "DBMS Minor Update",
  subCategory: "Perangkat Lunak",
  typeCategory: "Database Management System",
  versionBefore: "v2.0.0",
  versionAfter: "v2.1.0",
};

const initialAssets: AssetExecution[] = [
  { id: "AST-037", name: "Sistem Informasi Internal - E-Office Pemda v3", result: "Uncomplete", startTime: "", endTime: "", note: "" },
  { id: "AST-038", name: "MySQL - MySQL Server 8.0", result: "Uncomplete", startTime: "", endTime: "", note: "" },
  { id: "AST-039", name: "PostgreSQL - PostgreSQL 15", result: "Uncomplete", startTime: "", endTime: "", note: "" },
];

const PatchFinish = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isReadOnly = searchParams.get("readonly") === "true";
  const [assets, setAssets] = useState<AssetExecution[]>(initialAssets);

  const updateAsset = (assetId: string, field: keyof AssetExecution, value: string) => {
    if (isReadOnly) return;
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === assetId ? { ...asset, [field]: value } : asset
      )
    );
  };

  const validateEndTime = (assetId: string, endTime: string) => {
    if (isReadOnly) return;
    const asset = assets.find((a) => a.id === assetId);
    if (asset && asset.startTime && endTime < asset.startTime) {
      toast({ title: "Error", description: "End time must be after start time", variant: "destructive" });
      return;
    }
    updateAsset(assetId, "endTime", endTime);
  };

  const getCompletionStatus = () => {
    const completed = assets.filter((a) => a.result === "Complete").length;
    const total = assets.length;
    if (completed === total) return "Success";
    if (completed === 0) return "Failed";
    return "Partial";
  };

  const handleSave = () => {
    if (isReadOnly) return;
    const incompleteAssets = assets.filter((a) => a.result === "Complete" && (!a.startTime || !a.endTime));
    if (incompleteAssets.length > 0) {
      toast({ title: "Error", description: "Please fill start and end time for all completed assets", variant: "destructive" });
      return;
    }
    const status = getCompletionStatus();
    toast({ title: "Patch Finalized", description: `Patch ${id} completed with status: ${status}. Moved to Patch Results.` });
    navigate("/patch-results");
  };

  const completionStatus = getCompletionStatus();
  const statusVariant = completionStatus === "Success" ? "success" : completionStatus === "Failed" ? "destructive" : "warning";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="page-title">
          {isReadOnly ? "View Patch Execution" : "Finish Patch Job"} - {id}
        </h1>
        {isReadOnly && (
          <Badge variant="secondary" className="ml-2">Read Only</Badge>
        )}
      </div>

      {/* Patch Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Patch Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Patch ID</p>
              <p className="font-medium text-foreground">{mockPatchData.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Scope</p>
              <p className="font-medium text-foreground">{mockPatchData.scope}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Version</p>
              <p className="font-medium text-foreground">{mockPatchData.versionBefore} → {mockPatchData.versionAfter}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={statusVariant}>{completionStatus}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Execution per Endpoint */}
      <Card>
        <CardHeader>
          <CardTitle>Execution per Endpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/10">
                  <TableHead className="text-primary font-semibold">Endpoint</TableHead>
                  <TableHead className="text-primary font-semibold">Result</TableHead>
                  <TableHead className="text-primary font-semibold">Start Time</TableHead>
                  <TableHead className="text-primary font-semibold">End Time</TableHead>
                  <TableHead className="text-primary font-semibold">Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">{asset.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={asset.result}
                        onValueChange={(value) => updateAsset(asset.id, "result", value as "Complete" | "Uncomplete")}
                        disabled={isReadOnly}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Complete">Complete</SelectItem>
                          <SelectItem value="Uncomplete">Uncomplete</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        value={asset.startTime}
                        onChange={(e) => updateAsset(asset.id, "startTime", e.target.value)}
                        className="w-[120px]"
                        disabled={isReadOnly}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        value={asset.endTime}
                        onChange={(e) => validateEndTime(asset.id, e.target.value)}
                        className="w-[120px]"
                        disabled={isReadOnly}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Optional..."
                        value={asset.note}
                        onChange={(e) => updateAsset(asset.id, "note", e.target.value)}
                        className="min-w-[150px]"
                        disabled={isReadOnly}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {!isReadOnly && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Finalize (Update status Diskominfo)
          </Button>
        </div>
      )}
    </div>
  );
};

export default PatchFinish;