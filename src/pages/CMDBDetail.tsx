import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, MoreVertical, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUser, UserRole } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

// API Response Interfaces
interface AssetFromAPI {
  id: string;
  simara_id?: number | null;
  kode_bmd?: string;
  nomor_seri?: string | null;
  nama_aset?: string;
  kategori?: string | null;
  sub_kategori?: string | null;
  kondisi?: string | null;
  status?: string | null;
  nilai_perolehan?: number | null;
  tanggal_perolehan?: string | null;
  merk?: string | null;
  model?: string | null;
  lokasi?: string | null;
  ruangan?: string | null;
  penanggung_jawab?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  category_type?: string | null;
}

interface AssetSpecAPI {
  id: string;
  asset_id: string;
  [key: string]: unknown;
}

interface AssetRelation {
  asset_id?: string;
  bmd_id: string;
  nama: string;
  kategori?: string;
  sub_kategori?: string;
  relasi?: string;
  keterangan?: string;
}

interface RawRelationRecord {
  [key: string]: unknown;
}

// Helper functions
const isString = (v: unknown): v is string => typeof v === "string";
const isRecord = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === "object";

const canEdit = (role: UserRole): boolean => role === "teknisi";

const getRelationBadgeColor = (relasi?: string) => {
  switch (relasi) {
    case "1":
    case "CONNECTED_TO":
      return { background: "#dbeafe", color: "#1d4ed8" };
    case "2":
    case "DEPENDS_ON":
      return { background: "#dcfce7", color: "#16a34a" };
    case "3":
    case "PART_OF":
      return { background: "#f3e8ff", color: "#7c3aed" };
    default:
      return { background: "#E6EEF8", color: "#184E8A" };
  }
};

const CMDBDetail = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const user = getUser();
  const userRole = user?.role || "teknisi";
  const isEditable = canEdit(userRole);

  const [asset, setAsset] = useState<AssetFromAPI | null>(null);
  const [spec, setSpec] = useState<AssetSpecAPI | null>(null);
  const [relations, setRelations] = useState<AssetRelation[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editedAsset, setEditedAsset] = useState<AssetFromAPI | null>(null);
  const [saving, setSaving] = useState(false);

  // Specification modal
  const [specModalOpen, setSpecModalOpen] = useState(false);
  const [editingSpecKey, setEditingSpecKey] = useState<string | null>(null);
  const [specForm, setSpecForm] = useState({ name: "", value: "" });

  // Relation modal
  const [relationModalOpen, setRelationModalOpen] = useState(false);
  const [relationForm, setRelationForm] = useState({ bmd_id: "", nama: "", relasi: "1", keterangan: "" });

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      const response = await api.getAssetById(id);
      const json = response;
      const assetCandidate = (json?.data?.asset ?? json?.data) as unknown;

      if (isRecord(assetCandidate)) {
        const rec = assetCandidate as Record<string, unknown>;

        const mapped: AssetFromAPI = {
          id: isString(rec.id) ? rec.id : id,
          simara_id: typeof rec.simara_id === "number" ? rec.simara_id : null,
          kode_bmd: isString(rec.kode_bmd) ? rec.kode_bmd : undefined,
          nomor_seri: isString(rec.nomor_seri) ? rec.nomor_seri : undefined,
          nama_aset: isString(rec.nama_aset) ? rec.nama_aset : undefined,
          kategori: isString(rec.kategori) ? rec.kategori : undefined,
          sub_kategori: isString(rec.sub_kategori) ? rec.sub_kategori : undefined,
          kondisi: isString(rec.kondisi) ? rec.kondisi : undefined,
          status: isString(rec.status) ? rec.status : undefined,
          nilai_perolehan: typeof rec.nilai_perolehan === "number" ? rec.nilai_perolehan : null,
          tanggal_perolehan: isString(rec.tanggal_perolehan) ? rec.tanggal_perolehan : null,
          merk: isString(rec.merk) ? rec.merk : null,
          model: isString(rec.model) ? rec.model : null,
          lokasi: isString(rec.lokasi) ? rec.lokasi : null,
          ruangan: isString(rec.ruangan) ? rec.ruangan : null,
          penanggung_jawab: isString(rec.penanggung_jawab) ? rec.penanggung_jawab : null,
          created_at: isString(rec.created_at) ? rec.created_at : "",
          updated_at: isString(rec.updated_at) ? rec.updated_at : "",
          category_type: isString(rec.category_type) ? rec.category_type : null,
        };

        setAsset(mapped);
        setEditedAsset(mapped);
      }

      // Get specifications
      const specCandidate = json?.data?.spec ?? json?.spec;
      if (isRecord(specCandidate)) {
        const s = specCandidate as Record<string, unknown>;
        if (isString(s.id) && isString(s.asset_id)) {
          setSpec(s as AssetSpecAPI);
        }
      }
    } catch (err) {
      console.error("[CMDBDetail] fetchDetail error:", err);
    }
  }, [id]);

  const fetchSpecifications = useCallback(async () => {
    if (!id) return;
    try {
      const response = await api.getAssetSpecifications(id);
      const specData = response?.data;
      
      if (isRecord(specData)) {
        setSpec(specData as AssetSpecAPI);
      } else if (Array.isArray(specData) && specData.length > 0) {
        // If array, take first item
        setSpec(specData[0] as AssetSpecAPI);
      }
    } catch (err) {
      console.error("[CMDBDetail] fetchSpecifications error:", err);
    }
  }, [id]);

  const fetchRelations = useCallback(async () => {
    if (!id) return;

    try {
      const response = await api.getAssetRelations(id);
      const raw = response?.data;

      if (!Array.isArray(raw)) {
        setRelations([]);
        return;
      }

      const parsed = raw
        .map((it) => {
          if (!isRecord(it)) return null;
          const r = it as RawRelationRecord;

          if (!isString(r.bmd_id) || !isString(r.nama)) return null;

          const rel: AssetRelation = {
            asset_id: isString(r.asset_id) ? r.asset_id : undefined,
            bmd_id: r.bmd_id,
            nama: r.nama,
            kategori: isString(r.kategori) ? r.kategori : undefined,
            sub_kategori: isString(r.sub_kategori) ? r.sub_kategori : undefined,
            relasi: isString(r.relasi) ? r.relasi : undefined,
            keterangan: isString(r.keterangan) ? r.keterangan : undefined,
          };

          return rel;
        })
        .filter((x): x is AssetRelation => x !== null);

      setRelations(parsed);
    } catch (err) {
      console.error("[CMDBDetail] fetchRelations error:", err);
      setRelations([]);
    }
  }, [id]);

  // Build ReactFlow nodes and edges
  useEffect(() => {
    if (!asset) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const mainNode: Node = {
      id: "asset_main",
      position: { x: 0, y: 0 },
      data: {
        label: `${asset.kode_bmd ?? asset.id}\n${asset.nama_aset ?? ""}`,
      },
      style: {
        background: "hsl(var(--primary))",
        color: "#fff",
        padding: 10,
        borderRadius: 10,
        width: 260,
        textAlign: "center" as const,
        fontSize: 13,
        fontWeight: 700,
      },
    };

    const leftX = -300;
    const rightX = 300;
    const gapY = 120;

    const relationNodes: Node[] = relations.map((r, idx) => {
      const nodeId = r.asset_id ?? `bmd:${r.bmd_id}`;
      const isLeft = idx % 2 === 0;
      const x = isLeft ? leftX : rightX;
      const y = (Math.floor(idx / 2) + 1) * gapY;

      return {
        id: nodeId,
        position: { x, y },
        data: { label: `${r.bmd_id}\n${r.nama}` },
        style: {
          background: "hsl(var(--card))",
          color: "hsl(var(--foreground))",
          padding: 8,
          borderRadius: 8,
          border: "1px solid hsl(var(--border))",
          width: 220,
          textAlign: "center" as const,
          fontSize: 12,
        },
      };
    });

    const relationEdges: Edge[] = relations.map((r) => {
      const targetId = r.asset_id ?? `bmd:${r.bmd_id}`;

      const color =
        r.relasi === "1"
          ? "#3b82f6"
          : r.relasi === "2"
          ? "#16a34a"
          : r.relasi === "3"
          ? "#7c3aed"
          : "#f97316";

      return {
        id: `e-${targetId}`,
        source: "asset_main",
        target: targetId,
        animated: true,
        style: { stroke: color, strokeWidth: 2.1 },
        label: r.keterangan,
        labelStyle: { fontSize: 11 },
      };
    });

    setNodes([mainNode, ...relationNodes]);
    setEdges(relationEdges);
  }, [asset, relations]);

  // Initial fetch
  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchDetail(), fetchRelations(), fetchSpecifications()]);
      setLoading(false);
    })();
  }, [fetchDetail, fetchRelations, fetchSpecifications]);

  const hasRelations = useMemo(() => relations.length > 0, [relations]);

  // Save asset
  const handleSaveAsset = async () => {
    if (!editedAsset || !id) return;

    setSaving(true);
    try {
      await api.updateAsset(id, {
        nama_aset: editedAsset.nama_aset,
        nomor_seri: editedAsset.nomor_seri,
        kategori: editedAsset.kategori,
        sub_kategori: editedAsset.sub_kategori,
        lokasi: editedAsset.lokasi,
        ruangan: editedAsset.ruangan,
        penanggung_jawab: editedAsset.penanggung_jawab,
        kondisi: editedAsset.kondisi,
        status: editedAsset.status,
        nilai_perolehan: editedAsset.nilai_perolehan,
        merk: editedAsset.merk,
        model: editedAsset.model,
      });

      setAsset(editedAsset);
      setIsEditing(false);
      toast({ title: "Success", description: "Asset information updated successfully" });
    } catch (error) {
      console.error("[CMDBDetail] Failed to update asset:", error);
      toast({ title: "Error", description: "Failed to update asset", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedAsset(asset);
    setIsEditing(false);
  };

  // Specification handlers
  const openAddSpec = () => {
    setEditingSpecKey(null);
    setSpecForm({ name: "", value: "" });
    setSpecModalOpen(true);
  };

  const openEditSpec = (key: string, value: string) => {
    setEditingSpecKey(key);
    setSpecForm({ name: key, value });
    setSpecModalOpen(true);
  };

  const handleSaveSpec = () => {
    if (!spec) {
      // Create new spec object
      const newSpec: AssetSpecAPI = {
        id: Date.now().toString(),
        asset_id: id || "",
        [specForm.name]: specForm.value,
      };
      setSpec(newSpec);
    } else if (editingSpecKey) {
      // Update existing spec
      const newSpec = { ...spec };
      delete newSpec[editingSpecKey];
      newSpec[specForm.name] = specForm.value;
      setSpec(newSpec);
    } else {
      // Add new spec field
      setSpec({ ...spec, [specForm.name]: specForm.value });
    }
    toast({ title: "Success", description: editingSpecKey ? "Specification updated" : "Specification added" });
    setSpecModalOpen(false);
  };

  const handleDeleteSpec = (key: string) => {
    if (!spec) return;
    const newSpec = { ...spec };
    delete newSpec[key];
    setSpec(newSpec);
    toast({ title: "Success", description: "Specification deleted" });
  };

  // Relation handlers
  const openAddRelation = () => {
    setRelationForm({ bmd_id: "", nama: "", relasi: "1", keterangan: "" });
    setRelationModalOpen(true);
  };

  const handleSaveRelation = () => {
    const newRelation: AssetRelation = {
      asset_id: `rel-${Date.now()}`,
      bmd_id: relationForm.bmd_id,
      nama: relationForm.nama,
      relasi: relationForm.relasi,
      keterangan: relationForm.keterangan,
    };
    setRelations([...relations, newRelation]);
    setRelationModalOpen(false);
    toast({ title: "Success", description: "Relation added" });
  };

  const handleDeleteRelation = (bmdId: string) => {
    setRelations(relations.filter((r) => r.bmd_id !== bmdId));
    toast({ title: "Success", description: "Relation deleted" });
  };

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="p-6">
        <p className="text-destructive">Data aset tidak ditemukan.</p>
        <Button className="mt-4" onClick={() => navigate("/cmdb")}>
          Kembali ke CMDB
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/cmdb")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Detail Aset</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1 ml-12">
            {asset.kode_bmd ?? asset.id} — {asset.nama_aset}
          </p>
        </div>
      </div>

      <Tabs defaultValue="detail" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="detail">Asset Detail</TabsTrigger>
          <TabsTrigger value="history">Asset History</TabsTrigger>
        </TabsList>

        <TabsContent value="detail" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Asset Information */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Asset Information</h2>
                    {isEditable && !isEditing && (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                  </div>

                  {isEditing && editedAsset ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>BMD ID</Label>
                          <Input value={editedAsset.kode_bmd || ""} disabled className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                          <Label>Serial Number</Label>
                          <Input
                            value={editedAsset.nomor_seri || ""}
                            onChange={(e) => setEditedAsset({ ...editedAsset, nomor_seri: e.target.value })}
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label>Nama Aset</Label>
                          <Input
                            value={editedAsset.nama_aset || ""}
                            onChange={(e) => setEditedAsset({ ...editedAsset, nama_aset: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Kategori</Label>
                          <Select
                            value={editedAsset.kategori || ""}
                            onValueChange={(v) => setEditedAsset({ ...editedAsset, kategori: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Server">Server</SelectItem>
                              <SelectItem value="Network">Network</SelectItem>
                              <SelectItem value="Storage">Storage</SelectItem>
                              <SelectItem value="Software">Software</SelectItem>
                              <SelectItem value="Hardware">Hardware</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Sub Kategori</Label>
                          <Input
                            value={editedAsset.sub_kategori || ""}
                            onChange={(e) => setEditedAsset({ ...editedAsset, sub_kategori: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Kondisi</Label>
                          <Select
                            value={editedAsset.kondisi || ""}
                            onValueChange={(v) => setEditedAsset({ ...editedAsset, kondisi: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Baik">Baik</SelectItem>
                              <SelectItem value="Cukup">Cukup</SelectItem>
                              <SelectItem value="Rusak">Rusak</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select
                            value={editedAsset.status || ""}
                            onValueChange={(v) => setEditedAsset({ ...editedAsset, status: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Aktif">Aktif</SelectItem>
                              <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                              <SelectItem value="Maintenance">Maintenance</SelectItem>
                              <SelectItem value="Retired">Retired</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Lokasi</Label>
                          <Input
                            value={editedAsset.lokasi || ""}
                            onChange={(e) => setEditedAsset({ ...editedAsset, lokasi: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Ruangan</Label>
                          <Input
                            value={editedAsset.ruangan || ""}
                            onChange={(e) => setEditedAsset({ ...editedAsset, ruangan: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>PIC</Label>
                          <Input
                            value={editedAsset.penanggung_jawab || ""}
                            onChange={(e) => setEditedAsset({ ...editedAsset, penanggung_jawab: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Nilai Perolehan</Label>
                          <Input
                            type="number"
                            value={editedAsset.nilai_perolehan || ""}
                            onChange={(e) =>
                              setEditedAsset({ ...editedAsset, nilai_perolehan: Number(e.target.value) || null })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveAsset} disabled={saving}>
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">BMD ID</Label>
                        <div className="text-sm bg-muted p-2 rounded text-primary font-semibold">
                          {asset.kode_bmd ?? "-"}
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Serial Number</Label>
                        <div className="text-sm bg-muted p-2 rounded">{asset.nomor_seri ?? "-"}</div>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-muted-foreground">Nama Aset</Label>
                        <div className="text-sm bg-muted p-2 rounded break-words">{asset.nama_aset ?? "-"}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Kategori</Label>
                        <div className="text-sm bg-muted p-2 rounded">{asset.kategori ?? "-"}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Sub Kategori</Label>
                        <div className="text-sm bg-muted p-2 rounded">{asset.sub_kategori ?? "-"}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Kondisi</Label>
                        <div className="text-sm bg-muted p-2 rounded">{asset.kondisi ?? "-"}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Status</Label>
                        <div className="text-sm bg-muted p-2 rounded">{asset.status ?? "-"}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Lokasi</Label>
                        <div className="text-sm bg-muted p-2 rounded">{asset.lokasi ?? "-"}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Ruangan</Label>
                        <div className="text-sm bg-muted p-2 rounded">{asset.ruangan ?? "-"}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">PIC</Label>
                        <div className="text-sm bg-muted p-2 rounded">{asset.penanggung_jawab ?? "-"}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Nilai Perolehan</Label>
                        <div className="text-sm bg-muted p-2 rounded">
                          {typeof asset.nilai_perolehan === "number"
                            ? `Rp ${asset.nilai_perolehan.toLocaleString("id-ID")}`
                            : "-"}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Specification Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Spesifikasi</h3>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-3 py-3 text-left text-xs">Field</th>
                      <th className="px-3 py-3 text-left text-xs">Value</th>
                      {isEditable && <th className="px-3 py-3 text-left text-xs w-[50px]"></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {!spec || Object.keys(spec).filter((k) => k !== "id" && k !== "asset_id").length === 0 ? (
                      <tr>
                        <td
                          colSpan={isEditable ? 3 : 2}
                          className="px-3 py-6 text-center text-muted-foreground"
                        >
                          Tidak ada spesifikasi
                        </td>
                      </tr>
                    ) : (
                      Object.entries(spec)
                        .filter(([k]) => k !== "id" && k !== "asset_id")
                        .map(([k, v]) => (
                          <tr key={k} className="border-b border-border">
                            <td className="px-3 py-3 text-xs font-medium">{k}</td>
                            <td className="px-3 py-3 text-xs">{String(v ?? "-")}</td>
                            {isEditable && (
                              <td className="px-3 py-3">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => openEditSpec(k, String(v))}>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteSpec(k)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            )}
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
              {isEditable && (
                <Button variant="outline" className="w-full mt-4" onClick={openAddSpec}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Spesifikasi
                </Button>
              )}
            </div>
          </div>

          {/* Relation Table */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Relasi Aset</h2>
              {isEditable && (
                <Button variant="outline" size="sm" onClick={openAddRelation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Relasi
                </Button>
              )}
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-4 py-3 text-left text-sm">BMD ID</th>
                    <th className="px-4 py-3 text-left text-sm">Nama</th>
                    <th className="px-4 py-3 text-left text-sm">Kategori</th>
                    <th className="px-4 py-3 text-left text-sm">Sub Kategori</th>
                    <th className="px-4 py-3 text-left text-sm">Relasi</th>
                    {isEditable && <th className="px-4 py-3 text-left text-sm w-[60px]">Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {relations.length === 0 ? (
                    <tr>
                      <td
                        colSpan={isEditable ? 6 : 5}
                        className="px-4 py-6 text-center text-muted-foreground"
                      >
                        Tidak ada relasi
                      </td>
                    </tr>
                  ) : (
                    relations.map((r) => {
                      const badgeStyle = getRelationBadgeColor(r.relasi);
                      return (
                        <tr key={r.bmd_id} className="border-b border-border">
                          <td className="px-4 py-3 text-sm font-medium">{r.bmd_id}</td>
                          <td className="px-4 py-3 text-sm">{r.nama}</td>
                          <td className="px-4 py-3 text-sm">{r.kategori ?? "-"}</td>
                          <td className="px-4 py-3 text-sm">{r.sub_kategori ?? "-"}</td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={badgeStyle}
                            >
                              {r.relasi ?? "-"}
                            </span>
                          </td>
                          {isEditable && (
                            <td className="px-4 py-3">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteRelation(r.bmd_id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Relation Diagram */}
          <div>
            <h2 className="text-xl font-bold mb-3">Diagram Relasi Aset</h2>
            {!hasRelations ? (
              <p className="text-muted-foreground text-sm">Tidak ada relasi untuk ditampilkan.</p>
            ) : (
              <div className="h-[520px] border border-border rounded-lg">
                <ReactFlowProvider>
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    fitView
                    onNodeClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Background gap={12} size={1} />
                    <MiniMap />
                    <Controls />
                  </ReactFlow>
                </ReactFlowProvider>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <AssetHistory assetId={id || ""} />
        </TabsContent>
      </Tabs>

      {/* Specification Modal */}
      <Dialog open={specModalOpen} onOpenChange={setSpecModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSpecKey ? "Edit Spesifikasi" : "Tambah Spesifikasi"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama Spesifikasi</Label>
              <Input
                value={specForm.name}
                onChange={(e) => setSpecForm({ ...specForm, name: e.target.value })}
                placeholder="e.g., CPU, RAM, Storage"
                disabled={!!editingSpecKey}
              />
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input
                value={specForm.value}
                onChange={(e) => setSpecForm({ ...specForm, value: e.target.value })}
                placeholder="e.g., Intel Xeon, 64GB"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSpecModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSpec} disabled={!specForm.name || !specForm.value}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Relation Modal */}
      <Dialog open={relationModalOpen} onOpenChange={setRelationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Relasi</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>BMD ID</Label>
              <Input
                value={relationForm.bmd_id}
                onChange={(e) => setRelationForm({ ...relationForm, bmd_id: e.target.value })}
                placeholder="e.g., BMD-002"
              />
            </div>
            <div className="space-y-2">
              <Label>Nama Aset</Label>
              <Input
                value={relationForm.nama}
                onChange={(e) => setRelationForm({ ...relationForm, nama: e.target.value })}
                placeholder="e.g., Switch Cisco Catalyst"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipe Relasi</Label>
              <Select
                value={relationForm.relasi}
                onValueChange={(v) => setRelationForm({ ...relationForm, relasi: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">CONNECTED_TO</SelectItem>
                  <SelectItem value="2">DEPENDS_ON</SelectItem>
                  <SelectItem value="3">PART_OF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Keterangan</Label>
              <Input
                value={relationForm.keterangan}
                onChange={(e) => setRelationForm({ ...relationForm, keterangan: e.target.value })}
                placeholder="Optional description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRelationModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRelation} disabled={!relationForm.bmd_id || !relationForm.nama}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Asset History Component
interface HistoryRecord {
  id: string;
  changeType: string;
  beforeValue: string;
  afterValue: string;
  changedBy: string;
  changedAt: string;
}

const AssetHistory = ({ assetId }: { assetId: string }) => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [changeTypeFilter, setChangeTypeFilter] = useState("all");
  const [changedByFilter, setChangedByFilter] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.getAssetHistory(assetId);
        const historyData = response?.data || response || [];

        const mappedHistory: HistoryRecord[] = (Array.isArray(historyData) ? historyData : []).map(
          (item: any, index: number) => ({
            id: item.id || `HST-${String(index + 1).padStart(3, "0")}`,
            changeType: item.change_type || item.changeType || item.field || "Unknown",
            beforeValue: item.before_value || item.beforeValue || item.old_value || "-",
            afterValue: item.after_value || item.afterValue || item.new_value || "-",
            changedBy: item.changed_by || item.changedBy || item.user || "System",
            changedAt: item.changed_at || item.changedAt || item.created_at || "-",
          })
        );

        setHistory(mappedHistory);
      } catch (error) {
        console.error("[AssetHistory] Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (assetId) {
      fetchHistory();
    }
  }, [assetId]);

  const changeTypes = [...new Set(history.map((h) => h.changeType))];
  const changers = [...new Set(history.map((h) => h.changedBy))];

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.beforeValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.afterValue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = changeTypeFilter === "all" || item.changeType === changeTypeFilter;
    const matchesChanger = changedByFilter === "all" || item.changedBy === changedByFilter;
    return matchesSearch && matchesType && matchesChanger;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Input
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4"
            />
          </div>
          <Select value={changeTypeFilter} onValueChange={setChangeTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Change Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Change Types</SelectItem>
              {changeTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={changedByFilter} onValueChange={setChangedByFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Changed By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {changers.map((user) => (
                <SelectItem key={user} value={user}>
                  {user}
                </SelectItem>
              ))}
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
            {filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No history records found
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.id}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{record.changeType}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{record.beforeValue}</TableCell>
                  <TableCell>{record.afterValue}</TableCell>
                  <TableCell>{record.changedBy}</TableCell>
                  <TableCell className="text-muted-foreground">{record.changedAt}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default CMDBDetail;
