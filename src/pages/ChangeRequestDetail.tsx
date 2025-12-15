import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";

interface ChangeRequestData {
  cr_id: string;
  rollback_plan: string;
  title: string;
  description: string;
  impact_desc: string;
  status: string;
  dinas: string;
  risk_score: number;
  created_at: string;
  updated_at: string;
  asset_id: string;
  risk_level: string;
  control_existing: string;
  control_effectiveness: string;
  mitigation_plan: string;
  pic_implementation: string;
  target_completion: string;
  admin_schedule: string;
  schedule_implementation: string;
  post_likelihood: number;
  post_impact: number;
  post_residual_score: number;
  post_risk_level: string;
  implementation_result: string;
  approval_status: string;
  type: string;
  schedule_start: string;
  schedule_end: string;
  implement_start_at: string;
  implement_end_at: string;
  cmdb_updated_at: string;
  id: string;
  tiket_id: string;
  katalog_permintaan: string;
  source: string;
  alasan: string;
  tujuan: string;
  ci_id: string;
  impacted_asset_id: string;
  rencana_implementasi: string;
  usulan_jadwal: string;
  rencana_rollback: string;
  estimasi_biaya: string;
  estimasi_waktu: string;
  skor_dampak: number;
  skor_kemungkinan: number;
  skor_exposure: number;
  approval_path: any[];
}

const getApprovalBadgeVariant = (status: string) => {
  const variants: Record<string, "success" | "warning" | "info" | "purple" | "destructive" | "secondary"> = {
    Approved: "success",
    Scheduled: "warning",
    Implementing: "info",
    Submitted: "purple",
    Rejected: "destructive",
  };
  return variants[status] || "secondary";
};

const ChangeRequestDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [assetsExpanded, setAssetsExpanded] = useState(true);
  const [data, setData] = useState<ChangeRequestData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChangeRequestDetail = async () => {
      if (!id) return;
      console.log(`[ChangeRequestDetail] Fetching change request detail for ID: ${id}`);
      try {
        const response = await api.getChangeRequestById(id);
        console.log("[ChangeRequestDetail] Data received:", response);
        // Extract data from response.data
        const dataObj = response?.data || response;
        console.log("[ChangeRequestDetail] Extracted data:", dataObj);
        setData(dataObj);
      } catch (error) {
        console.error("[ChangeRequestDetail] Failed to fetch change request detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChangeRequestDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="page-title">Change Request Detail</h1>
        </div>
        <Card><CardContent className="p-8 text-center">Loading...</CardContent></Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="page-title">Change Request Detail</h1>
        </div>
        <Card><CardContent className="p-8 text-center">Change request not found</CardContent></Card>
      </div>
    );
  }

  // Build affected assets from impacted_asset_id if available
  const affectedAssets = data.impacted_asset_id 
    ? [{ bmdId: data.impacted_asset_id, assetName: data.asset_id || data.impacted_asset_id }]
    : [];

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
        <h1 className="page-title">Change Request Detail</h1>
      </div>

      {/* Asset Summary - First Column from API */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tiket ID</p>
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
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">CI ID</p>
              <p className="font-medium text-foreground">{data.ci_id || "-"}</p>
            </div>
          </div>
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
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Rencana Implementasi</p>
            <p className="font-medium text-foreground">{data.rencana_implementasi || "-"}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Usulan Jadwal</p>
              <p className="font-medium text-foreground">{data.usulan_jadwal || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estimasi Biaya</p>
              <p className="font-medium text-foreground">{data.estimasi_biaya || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estimasi Waktu</p>
              <p className="font-medium text-foreground">{data.estimasi_waktu || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Rencana Rollback</p>
              <p className="font-medium text-foreground">{data.rencana_rollback || "-"}</p>
            </div>
          </div>

          {affectedAssets.length > 0 && (
            <div>
              <button
                onClick={() => setAssetsExpanded(!assetsExpanded)}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
              >
                Affected Assets ({affectedAssets.length})
                {assetsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {assetsExpanded && (
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
          )}
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">CR ID</p>
              <p className="font-medium text-foreground">{data.cr_id || data.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Dinas</p>
              <p className="font-medium text-foreground">{data.dinas || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium text-foreground">{data.type || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Asset ID</p>
              <p className="font-medium text-foreground">{data.asset_id || "-"}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Title</p>
            <p className="font-medium text-foreground">{data.title}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="text-foreground">{data.description || "-"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Impact Description</p>
            <p className="text-foreground">{data.impact_desc || "-"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-4 gap-4">
            <div className="border border-border rounded-lg p-4 text-center bg-card">
              <p className="text-sm text-muted-foreground">Skor Dampak</p>
              <p className="text-2xl font-bold text-foreground">{data.skor_dampak || "-"}</p>
            </div>
            <div className="border border-border rounded-lg p-4 text-center bg-card">
              <p className="text-sm text-muted-foreground">Skor Kemungkinan</p>
              <p className="text-2xl font-bold text-foreground">{data.skor_kemungkinan || "-"}</p>
            </div>
            <div className="border border-border rounded-lg p-4 text-center bg-card">
              <p className="text-sm text-muted-foreground">Skor Exposure</p>
              <p className="text-2xl font-bold text-foreground">{data.skor_exposure || "-"}</p>
            </div>
            <div className="border border-destructive/30 rounded-lg p-4 text-center bg-red-50">
              <p className="text-sm text-destructive">Risk Score</p>
              <p className="text-2xl font-bold text-destructive">{data.risk_score || "-"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Risk Level</p>
              <p className="font-medium text-foreground">{data.risk_level || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Control Existing</p>
              <p className="font-medium text-foreground">{data.control_existing || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Control Effectiveness</p>
              <p className="font-medium text-foreground">{data.control_effectiveness || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Mitigation Plan</p>
              <p className="font-medium text-foreground">{data.mitigation_plan || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Status */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={getApprovalBadgeVariant(data.approval_status || data.status)} className="text-sm px-3 py-1">
            {data.approval_status || data.status}
          </Badge>
        </CardContent>
      </Card>

      {/* Implementation Schedule */}
      {(data.schedule_start || data.schedule_end || data.pic_implementation) && (
        <Card>
          <CardHeader>
            <CardTitle>Implementation Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Schedule Start</p>
                <p className="font-medium text-foreground">{data.schedule_start ? new Date(data.schedule_start).toLocaleString() : "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Schedule End</p>
                <p className="font-medium text-foreground">{data.schedule_end ? new Date(data.schedule_end).toLocaleString() : "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">PIC Implementation</p>
                <p className="font-medium text-foreground">{data.pic_implementation || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Rollback Plan</p>
                <p className="font-medium text-foreground">{data.rollback_plan || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Status Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {["Submitted", "Reviewed", "Revision", "Approved", "Scheduled", "Implementing", "Completed", "End"].map((status, index, arr) => {
              const isCompleted = data.status === status || 
                (arr.indexOf(data.status) >= 0 && index <= arr.indexOf(data.status));
              const isLast = index === arr.length - 1;

              return (
                <div key={status} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${isCompleted ? "bg-primary border-primary" : "bg-background border-muted-foreground/30"}`} />
                    {!isLast && <div className={`w-0.5 h-8 ${isCompleted ? "bg-primary" : "bg-muted-foreground/30"}`} />}
                  </div>
                  <div className={`pb-6 ${isLast ? "pb-0" : ""}`}>
                    <p className={`font-medium text-sm -mt-0.5 ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>{status}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeRequestDetail;
