import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

type Status = "Succeeded" | "Failed" | "Partially Failed";
type ResultState = "Complete" | "Uncomplete";

interface PatchExecutionResult {
  asset_id: string;
  state: ResultState;
}

interface PatchJobData {
  id: string;
  job_id: string;
  patch_id: string;
  title: string;
  description: string;
  scope_asset: string;
  status: Status;
  patch_version: string;
  version_before: string;
  version_after: string;
  target_group: string;
  asset_ids: string[];
  category_type: string;
  subcategory: string;
  dinas: string;
  technician_name: string;
  schedule_at: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  results?: PatchExecutionResult[];
}

function StatusBadge({ value }: { value: Status }) {
  const styles: Record<Status, string> = {
    Succeeded: "bg-green-100 text-green-800 border border-green-300",
    Failed: "bg-red-100 text-red-700 border border-red-300",
    "Partially Failed": "bg-orange-100 text-orange-800 border border-orange-300",
  };
  return <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[value] || "bg-gray-100 text-gray-800"}`}>{value}</span>;
}

function ResultBadge({ value }: { value: ResultState }) {
  const styles: Record<ResultState, string> = {
    Complete: "bg-green-100 text-green-800 border border-green-300",
    Uncomplete: "bg-red-100 text-red-800 border border-red-300",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[value]}`}>{value}</span>;
}

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

const PatchResultsDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [patchJob, setPatchJob] = useState<PatchJobData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatchJobDetail = async () => {
      if (!id) return;
      console.log("[PatchResultsDetail] Fetching patch job detail for:", id);
      try {
        const response = await api.getPatchJobById(id);
        console.log("[PatchResultsDetail] Data received:", response);
        const data = response?.data || response;
        setPatchJob(data);
      } catch (error) {
        console.error("[PatchResultsDetail] Failed to fetch patch job detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatchJobDetail();
  }, [id]);

  const results: PatchExecutionResult[] = patchJob?.results ?? [];

  const counts = useMemo(() => {
    return results.reduce(
      (acc, item) => {
        if (item.state === "Complete") acc.Complete++;
        else acc.Uncomplete++;
        return acc;
      },
      { Complete: 0, Uncomplete: 0 }
    );
  }, [results]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="page-title">Patch Result Detail</h1>
        </div>
        <Card className="p-8 text-center">Loading...</Card>
      </div>
    );
  }

  if (!patchJob) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="page-title">Patch Result Detail</h1>
        </div>
        <Card className="p-8 text-center text-muted-foreground">Patch result not found</Card>
      </div>
    );
  }

  const jobStatus = (patchJob.status || "Succeeded") as Status;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="page-title">Patch Result Detail</h1>
      </div>

      {/* Title Card */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              {patchJob.job_id || patchJob.patch_id} - {patchJob.scope_asset || patchJob.title}
            </h2>
            <StatusBadge value={jobStatus} />
          </div>
        </CardContent>
      </Card>

      {/* Information Patch */}
      <Card>
        <CardHeader>
          <CardTitle>Information Patch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Job ID</p>
              <p className="font-medium text-foreground">{patchJob.job_id || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Patch ID</p>
              <p className="font-medium text-foreground">{patchJob.patch_id || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Patch Version</p>
              <p className="font-medium text-foreground">{patchJob.patch_version || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Target Group</p>
              <p className="font-medium text-foreground">{patchJob.target_group || "-"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Version Before</p>
              <p className="font-medium text-foreground">{patchJob.version_before || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Version After</p>
              <p className="font-medium text-foreground">{patchJob.version_after || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium text-foreground">{patchJob.category_type?.trim() || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Sub Category</p>
              <p className="font-medium text-foreground">{patchJob.subcategory?.trim() || "-"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Dinas</p>
              <p className="font-medium text-foreground">{patchJob.dinas || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Technician</p>
              <p className="font-medium text-foreground">{patchJob.technician_name || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p className="font-medium text-foreground">{formatDateTime(patchJob.start_date)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium text-foreground">{formatDateTime(patchJob.end_date)}</p>
            </div>
          </div>
          {patchJob.description && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium text-foreground">{patchJob.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Result Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Asset ID</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.length > 0 ? (
                  results.map((result, index) => (
                    <TableRow key={result.asset_id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{result.asset_id}</TableCell>
                      <TableCell className="text-center">
                        <ResultBadge value={result.state} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : patchJob.asset_ids && patchJob.asset_ids.length > 0 ? (
                  patchJob.asset_ids.map((assetId, index) => (
                    <TableRow key={assetId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{assetId}</TableCell>
                      <TableCell className="text-center">
                        <StatusBadge value={jobStatus} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      No assets found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatchResultsDetail;
