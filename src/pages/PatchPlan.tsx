import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Save, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { getUser } from "@/lib/auth";

interface Asset {
  id: string;
  name: string;
  subCategory: string;
  typeCategory: string;
}

const mockAssets: Asset[] = [
  { id: "AST-037", name: "Sistem Informasi Internal - E-Office Pemda v3", subCategory: "Perangkat Lunak", typeCategory: "Database Management System" },
  { id: "AST-038", name: "MySQL - MySQL Server 8.0", subCategory: "Perangkat Lunak", typeCategory: "Database Management System" },
  { id: "AST-039", name: "PostgreSQL - PostgreSQL 15", subCategory: "Perangkat Lunak", typeCategory: "Database Management System" },
  { id: "AST-040", name: "Oracle Database - Oracle Database 19c", subCategory: "Perangkat Lunak", typeCategory: "Database Management System" },
  { id: "AST-041", name: "MongoDB - MongoDB 7.0", subCategory: "Perangkat Lunak", typeCategory: "Database Management System" },
];

const mockPatchData = {
  id: "PCH-001",
  scope: "DBMS Minor Update",
  subCategory: "Perangkat Lunak",
  typeCategory: "Database Management System",
  versionBefore: "v2.0.0",
  versionAfter: "v2.1.0",
};

const PatchPlan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isReadOnly = searchParams.get("readonly") === "true";
  const user = getUser();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [implementationDate, setImplementationDate] = useState("");
  const [notes, setNotes] = useState("");

  const filteredAssets = mockAssets.filter((asset) =>
    asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleAsset = (assetId: string) => {
    if (isReadOnly) return;
    setSelectedAssets((prev) =>
      prev.includes(assetId)
        ? prev.filter((id) => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleSelectAll = () => {
    if (isReadOnly) return;
    setSelectedAssets(filteredAssets.map((a) => a.id));
  };

  const handleClearAll = () => {
    if (isReadOnly) return;
    setSelectedAssets([]);
  };

  const handleAddSelected = () => {
    if (isReadOnly) return;
    toast({ title: "Assets Added", description: `${selectedAssets.length} assets added to patch plan` });
  };

  const handleSave = () => {
    if (isReadOnly) return;
    if (selectedAssets.length === 0) {
      toast({ title: "Error", description: "Please select at least one asset", variant: "destructive" });
      return;
    }
    if (!implementationDate) {
      toast({ title: "Error", description: "Please select implementation date", variant: "destructive" });
      return;
    }
    toast({ title: "Plan Saved", description: `Patch ${id} plan saved. Status changed to Staged.` });
    navigate("/patch-job");
  };

  const selectedAssetDetails = mockAssets.filter((a) => selectedAssets.includes(a.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="page-title">
          {isReadOnly ? "View Patch Plan" : "Plan Patch Job"} - {id}
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
              <p className="text-sm text-muted-foreground">Sub Kategori</p>
              <p className="font-medium text-foreground">{mockPatchData.subCategory}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Jenis Kategori</p>
              <p className="font-medium text-foreground">{mockPatchData.typeCategory}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Version Before</p>
              <p className="font-medium text-foreground">{mockPatchData.versionBefore}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Version After</p>
              <p className="font-medium text-foreground">{mockPatchData.versionAfter}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patch Asset Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Choose Endpoints (by category)</CardTitle>
            {!isReadOnly && (
              <Button variant="outline" size="sm" onClick={() => setSelectedAssets([])}>Reset to scope</Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Sub Kategori</Label>
              <Select defaultValue="perangkat-lunak" disabled={isReadOnly}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="perangkat-lunak">Perangkat Lunak</SelectItem>
                  <SelectItem value="perangkat-keras">Perangkat Keras</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Jenis Kategori</Label>
              <Select defaultValue="dbms" disabled={isReadOnly}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dbms">Database Management System</SelectItem>
                  <SelectItem value="os">Operating System</SelectItem>
                  <SelectItem value="web">Web Server</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search (optional)</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari nama / ID..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="pl-10" 
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <p className="text-sm text-muted-foreground">Showing {filteredAssets.length} assets • checked {selectedAssets.length}</p>
            {!isReadOnly && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>Select all visible</Button>
                <Button variant="outline" size="sm" onClick={handleClearAll}>Clear checks</Button>
                <Button size="sm" onClick={handleAddSelected}>Add selected endpoints</Button>
              </div>
            )}
          </div>

          <div className="border border-border rounded-lg divide-y divide-border">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="flex items-center gap-3 p-3 hover:bg-muted/50">
                <Checkbox
                  checked={selectedAssets.includes(asset.id)}
                  onCheckedChange={() => handleToggleAsset(asset.id)}
                  disabled={isReadOnly}
                />
                <div className="flex-1">
                  <p className="font-medium">{asset.name} <span className="text-muted-foreground">({asset.id})</span></p>
                  <p className="text-sm text-muted-foreground">{asset.subCategory} • {asset.typeCategory}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle>Selected Endpoints ({selectedAssets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedAssets.length === 0 ? (
            <p className="text-muted-foreground">Belum ada endpoint.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedAssetDetails.map((asset) => (
                <Badge key={asset.id} variant="secondary" className="gap-1">
                  {asset.name}
                  {!isReadOnly && (
                    <button onClick={() => handleToggleAsset(asset.id)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Jadwal Implementasi *</Label>
              <Input 
                type="datetime-local" 
                value={implementationDate} 
                onChange={(e) => setImplementationDate(e.target.value)} 
                disabled={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label>Nama Teknisi</Label>
              <Input value={user?.name || "-"} disabled className="bg-muted" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Catatan</Label>
            <Textarea 
              placeholder="Catatan tambahan..." 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              rows={3} 
              disabled={isReadOnly}
            />
          </div>
        </CardContent>
      </Card>

      {!isReadOnly && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={handleSave} className="gap-2"><Save className="h-4 w-4" />Save Plan</Button>
        </div>
      )}
    </div>
  );
};

export default PatchPlan;