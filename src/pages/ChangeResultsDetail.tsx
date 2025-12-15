import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface ChangeResultDetail {
  cr_id: string;
  id: string;
  tiket_id: string;
  title: string;
  description: string;
  status: string;
  type: string;
  risk_score: number;
  risk_level: string;
  ci_id: string;
  dinas: string;
  requestor_name: string;
  requestor_instansi: string;
  implemented_by: string;
  implemented_at: string;
  implementation_note: string;
  implement_start_at: string;
  implement_end_at: string;
  created_at: string;
  updated_at: string;
}

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

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ChangeResultsDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [changeResult, setChangeResult] = useState<ChangeResultDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChangeResultDetail = async () => {
      if (!id) return;
      console.log("[ChangeResultsDetail] Fetching change result detail for:", id);
      try {
        const response = await api.getChangeRequestById(id);
        console.log("[ChangeResultsDetail] Data received:", response);
        const data = response?.data || response;
        setChangeResult(data);
      } catch (error) {
        console.error("[ChangeResultsDetail] Failed to fetch change result detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChangeResultDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="page-title">Change Result Detail</h1>
        </div>
        <Card className="p-8 text-center">Loading...</Card>
      </div>
    );
  }

  if (!changeResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="page-title">Change Result Detail</h1>
        </div>
        <Card className="p-8 text-center text-muted-foreground">Change result not found</Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="page-title">Change Result Detail</h1>
        </div>
        {changeResult.ci_id && (
          <Button onClick={() => navigate(`/cmdb/${changeResult.ci_id}`)}>
            Change Asset
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Result Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ticket ID</p>
              <p className="font-medium text-foreground">{changeResult.tiket_id || changeResult.cr_id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={getStatusBadgeVariant(changeResult.status)}>{changeResult.status}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Type</p>
              <Badge variant={getTypeBadgeVariant(changeResult.type)}>{changeResult.type || "-"}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Risk Score</p>
              <p className="font-medium text-foreground">{changeResult.risk_score || "-"}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Title</p>
            <p className="font-medium text-foreground">{changeResult.title}</p>
          </div>
          {changeResult.description && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium text-foreground">{changeResult.description}</p>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Requestor</p>
              <p className="font-medium text-foreground">{changeResult.requestor_name || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Requestor Instansi</p>
              <p className="font-medium text-foreground">{changeResult.requestor_instansi || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Dinas</p>
              <p className="font-medium text-foreground">{changeResult.dinas || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Asset ID</p>
              <p className="font-medium text-foreground">{changeResult.ci_id || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Implementation Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Implemented By</p>
              <p className="font-medium text-foreground">{changeResult.implemented_by || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Implemented At</p>
              <p className="font-medium text-foreground">{formatDateTime(changeResult.implemented_at)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Start Time</p>
              <p className="font-medium text-foreground">{formatDateTime(changeResult.implement_start_at)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">End Time</p>
              <p className="font-medium text-foreground">{formatDateTime(changeResult.implement_end_at)}</p>
            </div>
          </div>
          {changeResult.implementation_note && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Implementation Note</p>
              <p className="font-medium text-foreground whitespace-pre-wrap">{changeResult.implementation_note}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeResultsDetail;
