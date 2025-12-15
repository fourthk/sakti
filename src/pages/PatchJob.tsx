import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getUser } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

type PatchStatus = "Assigned" | "Staged" | "Deploy" | "Finished";

interface PatchJob {
  id: string;
  scope: string;
  assetCode: string;
  subCategory: string;
  typeCategory: string;
  versionBefore: string;
  versionAfter: string;
  estimatedTime: string;
  dinas: string;
  status: PatchStatus;
}

const getStatusBadgeVariant = (status: string) => {
  const statusLower = status?.toLowerCase() || "";
  if (statusLower === "assigned") return "warning";
  if (statusLower === "staged") return "info";
  if (statusLower === "deploy") return "purple";
  if (statusLower === "finished" || statusLower === "completed") return "success";
  return "secondary";
};

const PatchJob = () => {
  const navigate = useNavigate();
  const user = getUser();
  const isDiskominfo = user?.role === "diskominfo";
  const isTeknisi = user?.role === "teknisi";

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dinasFilter, setDinasFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [patchJobs, setPatchJobs] = useState<PatchJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<any>({ assets: [], dinas: [] });

  // Form states
  const [selectedAsset, setSelectedAsset] = useState("");
  const [versionBefore, setVersionBefore] = useState("");
  const [versionAfter, setVersionAfter] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [selectedDinas, setSelectedDinas] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      console.log("[PatchJob] Fetching patch jobs...");
      try {
        const [jobsResponse, optionsResponse] = await Promise.all([
          api.getPatchJobs(),
          api.getPatchJobOptions().catch(() => ({ data: { agencies: [] } })),
        ]);
        
        console.log("[PatchJob] Patch jobs received:", jobsResponse);
        console.log("[PatchJob] Options received:", optionsResponse);
        
        // Extract data array from response.data
        const jobsArray = jobsResponse?.data || jobsResponse || [];
        const optionsDataRaw = optionsResponse?.data || optionsResponse || {};
        
        console.log("[PatchJob] Extracted jobs:", jobsArray);
        
        const formattedJobs = (Array.isArray(jobsArray) ? jobsArray : []).map((job: any) => ({
          id: job.job_id || job.patch_id || job.id || "",
          scope: job.scope_asset || job.scope || job.name || job.title || "",
          assetCode: job.asset_code || job.asset_id || "",
          subCategory: job.subcategory || job.sub_category || "",
          typeCategory: job.category_type || job.type_category || "",
          versionBefore: job.version_before || "",
          versionAfter: job.version_after || "",
          estimatedTime: job.schedule_at || job.estimated_time || job.deadline || "",
          dinas: job.dinas || "",
          status: job.status || "Assigned",
        }));
        
        setPatchJobs(formattedJobs);
        // Extract agencies from options
        setOptions({ 
          agencies: optionsDataRaw.agencies || [], 
          assets: optionsDataRaw.assets || [] 
        });
      } catch (error) {
        console.error("[PatchJob] Failed to fetch patch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredJobs = patchJobs.filter((job) => {
    const matchesSearch = job.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.scope.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDinas = dinasFilter === "all" || job.dinas === dinasFilter;
    return matchesSearch && matchesStatus && matchesDinas;
  });

  const handleCreatePatchJob = async () => {
    if (!selectedAsset || !versionBefore || !versionAfter || !estimatedTime || !selectedDinas) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    
    console.log("[PatchJob] Creating new patch job...");
    try {
      const newJobData = {
        asset_id: selectedAsset,
        version_before: versionBefore,
        version_after: versionAfter,
        deadline: estimatedTime,
        dinas: selectedDinas,
      };
      
      await api.createPatchJob(newJobData);
      console.log("[PatchJob] Patch job created successfully");
      
      toast({ title: "Success", description: "Patch job created successfully" });
      setIsCreateModalOpen(false);
      setSelectedAsset(""); setVersionBefore(""); setVersionAfter(""); setEstimatedTime(""); setSelectedDinas("");
      
      // Refresh data
      const jobsResponse = await api.getPatchJobs();
      const jobsArray = jobsResponse?.data || jobsResponse || [];
      const formattedJobs = (Array.isArray(jobsArray) ? jobsArray : []).map((job: any) => ({
        id: job.job_id || job.patch_id || job.id || "",
        scope: job.scope_asset || job.scope || job.name || job.title || "",
        assetCode: job.asset_code || job.asset_id || "",
        subCategory: job.subcategory || job.sub_category || "",
        typeCategory: job.category_type || job.type_category || "",
        versionBefore: job.version_before || "",
        versionAfter: job.version_after || "",
        estimatedTime: job.schedule_at || job.estimated_time || job.deadline || "",
        dinas: job.dinas || "",
        status: job.status || "Assigned",
      }));
      setPatchJobs(formattedJobs);
    } catch (error) {
      console.error("[PatchJob] Failed to create patch job:", error);
      toast({ title: "Error", description: "Failed to create patch job", variant: "destructive" });
    }
  };

  const handleSendPatchJob = async (jobId: string) => {
    console.log(`[PatchJob] Sending patch job ${jobId} to Teknisi...`);
    try {
      await api.assignPatchJob(jobId);
      toast({ title: "Success", description: "Patch job assigned to Teknisi" });
      
      // Refresh data
      const jobsResponse = await api.getPatchJobs();
      const jobsArray = jobsResponse?.data || jobsResponse || [];
      const formattedJobs = (Array.isArray(jobsArray) ? jobsArray : []).map((job: any) => ({
        id: job.job_id || job.patch_id || job.id || "",
        scope: job.scope_asset || job.scope || job.name || job.title || "",
        assetCode: job.asset_code || job.asset_id || "",
        subCategory: job.subcategory || job.sub_category || "",
        typeCategory: job.category_type || job.type_category || "",
        versionBefore: job.version_before || "",
        versionAfter: job.version_after || "",
        estimatedTime: job.schedule_at || job.estimated_time || job.deadline || "",
        dinas: job.dinas || "",
        status: job.status || "Assigned",
      }));
      setPatchJobs(formattedJobs);
    } catch (error) {
      console.error("[PatchJob] Failed to send patch job:", error);
      toast({ title: "Error", description: "Failed to assign patch job", variant: "destructive" });
    }
  };

  const renderActionButton = (job: PatchJob) => {
    // Diskominfo role: show Detail button and Send button (when status = created)
    if (isDiskominfo) {
      const statusLower = job.status.toLowerCase();
      
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/patch-job/${job.id}/detail?readonly=true`)}
          >
            Detail
          </Button>
          {statusLower === "created" && (
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90"
              onClick={() => handleSendPatchJob(job.id)}
            >
              Send
            </Button>
          )}
        </div>
      );
    }

    // Teknisi role: show action buttons
    if (isTeknisi) {
      const statusLower = job.status.toLowerCase();
      switch (statusLower) {
        case "assigned": 
          return (
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate(`/patch-plan/${job.id}`)}
            >
              Plan (Entry)
            </Button>
          );
        case "staged": 
          return (
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate(`/patch-execute/${job.id}`)}
            >
              Execute
            </Button>
          );
        case "deploy": 
          return (
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate(`/patch-finish/${job.id}`)}
            >
              Finish
            </Button>
          );
        case "finished":
        case "completed":
          return <span className="text-muted-foreground">Completed</span>;
        default: 
          return null;
      }
    }

    return <span className="text-muted-foreground">-</span>;
  };

  const uniqueDinas = [...new Set(patchJobs.map(job => job.dinas).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">{isDiskominfo ? "Patch Management" : "Patch Job"}</h1>
        {isDiskominfo && (
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />New Patch Job
          </Button>
        )}
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search patch job..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="staged">Staged</SelectItem>
              <SelectItem value="deploy">Deploy</SelectItem>
              <SelectItem value="finished">Finished</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dinasFilter} onValueChange={setDinasFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="All Dinas" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dinas</SelectItem>
              {uniqueDinas.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job ID</TableHead>
              <TableHead>Scope Asset</TableHead>
              <TableHead>Subcategory</TableHead>
              <TableHead>Category Type</TableHead>
              <TableHead>Versions</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Dinas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No patch jobs found
                </TableCell>
              </TableRow>
            ) : (
              filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.id}</TableCell>
                  <TableCell>
                    <div>
                      {job.scope}
                      <br />
                      <span className="text-xs text-muted-foreground">{job.assetCode}</span>
                    </div>
                  </TableCell>
                  <TableCell>{job.subCategory}</TableCell>
                  <TableCell>{job.typeCategory}</TableCell>
                  <TableCell>{job.versionBefore} → {job.versionAfter}</TableCell>
                  <TableCell>{job.estimatedTime}</TableCell>
                  <TableCell>{job.dinas}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(job.status) as any}>{job.status}</Badge>
                  </TableCell>
                  <TableCell>{renderActionButton(job)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Create Patch Job</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Asset</Label>
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger><SelectValue placeholder="Select asset..." /></SelectTrigger>
                <SelectContent>
                  {(options.assets || []).map((a: any) => (
                    <SelectItem key={a.id} value={a.id}>{a.name || a.nama_aset}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Version Before</Label>
                <Input value={versionBefore} onChange={(e) => setVersionBefore(e.target.value)} placeholder="v1.0.0" />
              </div>
              <div className="space-y-2">
                <Label>Version After</Label>
                <Input value={versionAfter} onChange={(e) => setVersionAfter(e.target.value)} placeholder="v1.1.0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input type="date" value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Dinas</Label>
              <Select value={selectedDinas} onValueChange={setSelectedDinas}>
                <SelectTrigger><SelectValue placeholder="Select dinas..." /></SelectTrigger>
                <SelectContent>
                  {(options.dinas || uniqueDinas).map((d: string) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePatchJob}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatchJob;
