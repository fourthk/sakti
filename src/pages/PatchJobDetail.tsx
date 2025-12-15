import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getUser } from "@/lib/auth";
import { api } from "@/lib/api";

type Status = "Created" | "Assigned" | "Staged" | "Deploying" | "Succeeded" | "Failed" | "Partially Failed";
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

const STATUS_META: Record<Status, { title: string; desc: string }> = {
  Created: {
    title: "New request created",
    desc: "Patch job has been created by Diskominfo.",
  },
  Assigned: {
    title: "Sent to technician",
    desc: "Technician will review the request.",
  },
  Staged: {
    title: "Validated & scheduled",
    desc: "Technician confirmed schedule & scope.",
  },
  Deploying: {
    title: "Deployment in progress",
    desc: "Technician is executing the patch.",
  },
  Succeeded: {
    title: "Deployment succeeded",
    desc: "All targeted assets completed.",
  },
  Failed: {
    title: "Deployment failed",
    desc: "Deployment did not complete successfully.",
  },
  "Partially Failed": {
    title: "Partially failed",
    desc: "Some assets succeeded, some failed.",
  },
};

function StatusBadge({ value }: { value: Status }) {
  const styles: Record<Status, string> = {
    Created: "bg-slate-200 text-slate-800",
    Assigned: "bg-indigo-100 text-indigo-800",
    Staged: "bg-blue-100 text-blue-800",
    Deploying: "bg-amber-100 text-amber-800",
    Succeeded: "bg-green-100 text-green-800",
    Failed: "bg-red-100 text-red-700",
    "Partially Failed": "bg-orange-100 text-orange-800",
  };
  return <span className={`px-2 py-0.5 rounded text-sm font-medium ${styles[value] || "bg-gray-100 text-gray-800"}`}>{value}</span>;
}

function ResultBadge({ value }: { value: ResultState }) {
  const styles: Record<ResultState, string> = {
    Complete: "bg-green-100 text-green-800",
    Uncomplete: "bg-red-100 text-red-800",
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[value]}`}>{value}</span>;
}

const PatchJobDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isReadOnly = searchParams.get("readonly") === "true";
  const user = getUser();
  const isTeknisi = user?.role === "teknisi";

  const [job, setJob] = useState<PatchJobData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetail = async () => {
      console.log(`[PatchJobDetail] Fetching patch job detail for ID: ${id}...`);
      try {
        const response = await api.getPatchJobById(id || "");
        console.log("[PatchJobDetail] Job detail received:", response);
        const dataObj = response?.data || response;
        console.log("[PatchJobDetail] Extracted data:", dataObj);
        setJob(dataObj);
      } catch (error) {
        console.error("[PatchJobDetail] Failed to fetch job detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetail();
    }
  }, [id]);

  const results: PatchExecutionResult[] = job?.results ?? [];

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
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="hover:bg-muted p-1 rounded transition-colors"
          >
            <ArrowLeft size={24} className="text-primary" />
          </button>
          <h1 className="text-2xl font-semibold text-primary">Patch Job Detail</h1>
        </div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="hover:bg-muted p-1 rounded transition-colors"
          >
            <ArrowLeft size={24} className="text-primary" />
          </button>
          <h1 className="text-2xl font-semibold text-primary">Patch Job Detail</h1>
        </div>
        <p className="text-muted-foreground">Job not found</p>
      </div>
    );
  }

  const jobStatus = (job.status || "Assigned") as Status;
  const patchJobId = job.job_id || job.patch_id || id;
  const statusMeta = STATUS_META[jobStatus] || STATUS_META.Created;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="hover:bg-muted p-1 rounded transition-colors"
        >
          <ArrowLeft size={24} className="text-primary" />
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">{patchJobId}</h1>
          <StatusBadge value={jobStatus} />
        </div>
      </div>

      {/* Status Info Card */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="py-4">
          <h3 className="font-semibold text-foreground">{statusMeta.title}</h3>
          <p className="text-sm text-muted-foreground">{statusMeta.desc}</p>
        </CardContent>
      </Card>

      {/* Information Patch */}
      <Card>
        <CardContent className="py-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Scope Asset</p>
              <p className="font-medium text-foreground">{job.scope_asset || job.title || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dinas</p>
              <p className="font-medium text-foreground">{job.dinas || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Schedule (schedule_at)</p>
              <p className="font-medium text-foreground">
                {job.schedule_at ? new Date(job.schedule_at).toLocaleString('id-ID') : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subcategory</p>
              <p className="font-medium text-foreground">{job.subcategory || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category Type</p>
              <p className="font-medium text-foreground">{job.category_type || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Versions</p>
              <p className="font-medium text-foreground">
                {job.version_before || "-"} → {job.version_after || "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Result Summary */}
      <Card className="border-l-4 border-l-muted">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground mb-2">
            Result summary: <span className="font-medium text-foreground">{counts.Complete} complete</span>, <span className="font-medium text-foreground">{counts.Uncomplete} uncomplete</span>
          </p>
          {results.length === 0 ? (
            <p className="text-muted-foreground font-medium">No execution results yet.</p>
          ) : (
            <div className="mt-4 border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Asset ID</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={result.asset_id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{result.asset_id}</TableCell>
                      <TableCell>
                        <ResultBadge value={result.state} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons for Teknisi - hidden in read-only mode */}
      {isTeknisi && !isReadOnly && jobStatus !== "Succeeded" && jobStatus !== "Failed" && jobStatus !== "Partially Failed" && (
        <div className="flex justify-end gap-4">
          {jobStatus === "Assigned" && (
            <Button onClick={() => navigate(`/patch-plan/${id}`)}>Plan Patch Job</Button>
          )}
          {jobStatus === "Staged" && (
            <Button onClick={() => navigate(`/patch-execute/${id}`)}>Execute Patch Job</Button>
          )}
          {jobStatus === "Deploying" && (
            <Button onClick={() => navigate(`/patch-finish/${id}`)}>Mark as Finished</Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PatchJobDetail;
