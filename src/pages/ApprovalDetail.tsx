import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const ApprovalDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [assetsExpanded, setAssetsExpanded] = useState(true);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal state for notes
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"reject" | "revision" | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      console.log(`[ApprovalDetail] Fetching approval detail for CR ID: ${id}...`);
      try {
        const response = await api.getChangeRequestById(id || "");
        console.log("[ApprovalDetail] Data received:", response);
        const dataObj = response?.data || response;
        console.log("[ApprovalDetail] Extracted data:", dataObj);
        setData(dataObj);
      } catch (error) {
        console.error("[ApprovalDetail] Failed to fetch detail:", error);
        toast({
          title: "Error",
          description: "Failed to load approval detail",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    console.log(`[ApprovalDetail] Performing action: approve for CR ID: ${id}...`);

    try {
      await api.approveChangeRequest(id || "", "");
      console.log("[ApprovalDetail] Action approve successful");
      toast({
        title: "Success",
        description: `Change Request ${data?.cr_id || id} has been Approved`,
      });
      navigate("/approval");
    } catch (error) {
      console.error("[ApprovalDetail] Action approve failed:", error);
      toast({
        title: "Error",
        description: "Failed to approve change request",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openNoteModal = (action: "reject" | "revision") => {
    setPendingAction(action);
    setNote("");
    setNoteModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!note.trim()) {
      toast({
        title: "Error",
        description: "Catatan wajib diisi",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    console.log(`[ApprovalDetail] Performing action: ${pendingAction} for CR ID: ${id}...`);

    try {
      if (pendingAction === "reject") {
        await api.rejectChangeRequest(id || "", note);
      } else {
        await api.requestRevision(id || "", note);
      }

      const actionLabels = {
        reject: "Rejected",
        revision: "Revision Requested",
      };

      console.log(`[ApprovalDetail] Action ${pendingAction} successful`);
      toast({
        title: "Success",
        description: `Change Request ${data?.cr_id || id} has been ${actionLabels[pendingAction!]}`,
      });
      setNoteModalOpen(false);
      navigate("/approval");
    } catch (error) {
      console.error(`[ApprovalDetail] Action ${pendingAction} failed:`, error);
      toast({
        title: "Error",
        description: `Failed to ${pendingAction} change request`,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
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

  if (loading) {
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
            Approval Detail
          </h1>
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!data) {
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
            Approval Detail
          </h1>
        </div>
        <p className="text-muted-foreground">Data not found</p>
      </div>
    );
  }

  const affectedAssets = data.impacted_asset_id ? [{ bmdId: data.impacted_asset_id, assetName: data.ci_id || "N/A" }] : [];
  const isPending = data.approval_status === "PENDING" || data.approval_status === "NEED APPROVAL";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="page-title">Approval Detail</h1>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Basic Information</CardTitle>
            <span className={getTypeBadge(data.type)}>{data.type}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">CR ID</p>
              <p className="font-medium text-foreground">{data.cr_id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ticket ID</p>
              <p className="font-medium text-foreground">{data.tiket_id || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Katalog Permintaan</p>
              <p className="font-medium text-foreground">{data.katalog_permintaan || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Source</p>
              <p className="font-medium text-foreground">{data.source || "-"}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Title</p>
            <p className="font-medium text-foreground">{data.title}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="font-medium text-foreground">{data.description || "-"}</p>
          </div>

          <div>
            <button
              onClick={() => setAssetsExpanded(!assetsExpanded)}
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              Affected Assets ({affectedAssets.length})
              {assetsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {assetsExpanded && affectedAssets.length > 0 && (
              <div className="mt-3 border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>BMD ID</TableHead>
                      <TableHead>Asset Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affectedAssets.map((asset: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{asset.bmdId}</TableCell>
                        <TableCell>{asset.assetName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-5 pt-4 border-t">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Dinas</p>
              <p className="font-medium text-foreground">{data.dinas || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium text-foreground">{data.created_at ? new Date(data.created_at).toLocaleDateString() : "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium text-foreground">{data.status || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Alasan</p>
              <p className="font-medium text-foreground">{data.alasan || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tujuan</p>
              <p className="font-medium text-foreground">{data.tujuan || "-"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estimasi Biaya</p>
              <p className="font-medium text-foreground">{data.estimasi_biaya || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estimasi Waktu</p>
              <p className="font-medium text-foreground">{data.estimasi_waktu || "-"}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="border border-border rounded-lg p-4 text-center bg-card">
              <p className="text-sm text-muted-foreground">Skor Dampak</p>
              <p className="text-2xl font-bold text-foreground">{data.skor_dampak || 0}</p>
            </div>
            <div className="border border-border rounded-lg p-4 text-center bg-card">
              <p className="text-sm text-muted-foreground">Skor Kemungkinan</p>
              <p className="text-2xl font-bold text-foreground">{data.skor_kemungkinan || 0}</p>
            </div>
            <div className="border border-border rounded-lg p-4 text-center bg-card">
              <p className="text-sm text-muted-foreground">Skor Exposure</p>
              <p className="text-2xl font-bold text-foreground">{data.skor_exposure || 0}</p>
            </div>
            <div className="border border-destructive/30 rounded-lg p-4 text-center bg-red-50">
              <p className="text-sm text-destructive">Risk Score</p>
              <p className="text-2xl font-bold text-destructive">
                {data.risk_score || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Workflow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPending ? (
            <div className="flex gap-3">
              <Button
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700 text-white px-6"
                disabled={actionLoading}
              >
                {actionLoading ? "Processing..." : "Approve"}
              </Button>
              <Button
                onClick={() => openNoteModal("reject")}
                className="bg-red-600 hover:bg-red-700 text-white px-6"
                disabled={actionLoading}
              >
                Reject
              </Button>
              <Button
                onClick={() => openNoteModal("revision")}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6"
                disabled={actionLoading}
              >
                Need Info
              </Button>
              <Button
                variant="secondary"
                className="bg-slate-600 hover:bg-slate-700 text-white px-6"
                onClick={() => navigate("/approval")}
                disabled={actionLoading}
              >
                Close
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">
              This request has already been processed with status: <strong>{data.approval_status}</strong>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Note Modal for Reject/Revision */}
      <Dialog open={noteModalOpen} onOpenChange={setNoteModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {pendingAction === "reject" ? "Reject Change Request" : "Request Revision"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="note">Catatan <span className="text-destructive">*</span></Label>
              <Textarea
                id="note"
                placeholder={
                  pendingAction === "reject"
                    ? "Masukkan alasan penolakan..."
                    : "Masukkan informasi yang diperlukan..."
                }
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
              />
              <p className="text-sm text-muted-foreground">Catatan wajib diisi</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteModalOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={actionLoading || !note.trim()}
              className={
                pendingAction === "reject"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-yellow-600 hover:bg-yellow-700"
              }
            >
              {actionLoading ? "Processing..." : pendingAction === "reject" ? "Reject" : "Request Revision"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalDetail;
