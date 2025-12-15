import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface EmergencyData {
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

const EmergencyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState<EmergencyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmergencyDetail = async () => {
      if (!id) return;
      console.log(`[EmergencyDetail] Fetching emergency detail for ID: ${id}`);
      try {
        const response = await api.getEmergencyById(id);
        console.log("[EmergencyDetail] Data received:", response);
        // Extract data from response.data
        const dataObj = response?.data || response;
        console.log("[EmergencyDetail] Extracted data:", dataObj);
        setData(dataObj);
      } catch (error) {
        console.error("[EmergencyDetail] Failed to fetch emergency detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="page-title">Emergency Detail</h1>
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
          <h1 className="page-title">Emergency Detail</h1>
        </div>
        <Card><CardContent className="p-8 text-center">Emergency not found</CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="page-title">Emergency Detail</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Emergency ID</p>
              <p className="font-medium text-foreground">{data.emergency_code || data.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={getStatusBadgeVariant(data.status)}>{data.status}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium text-foreground">{new Date(data.created_at).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Updated At</p>
              <p className="font-medium text-foreground">{new Date(data.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Title</p>
            <p className="font-medium text-foreground">{data.title}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Reporter ID</p>
              <p className="font-medium text-foreground">{data.reporter_id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Impacted Asset ID</p>
              <p className="font-medium text-foreground">{data.impacted_asset_id || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">{data.description || "No description provided"}</p>
        </CardContent>
      </Card>

      {data.emergency_impacted_assets && data.emergency_impacted_assets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Impacted Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.emergency_impacted_assets.map((asset: any, index: number) => (
                <Badge key={index} variant="outline">{asset.asset_name || asset.id}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.photo_url && (
        <Card>
          <CardHeader>
            <CardTitle>Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <img src={data.photo_url} alt="Emergency" className="max-w-full h-auto rounded-lg" />
          </CardContent>
        </Card>
      )}

      {data.note && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{data.note}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmergencyDetail;
