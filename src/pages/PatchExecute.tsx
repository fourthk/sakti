import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Play, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const PatchExecute = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [executeData, setExecuteData] = useState({
    backupCompleted: false,
    notificationSent: false,
    servicesStoppedIfNeeded: false,
    executionLog: "",
    issues: "",
  });

  const handleExecute = () => {
    if (!executeData.backupCompleted) {
      toast({ title: "Error", description: "Please confirm backup is completed", variant: "destructive" });
      return;
    }
    toast({ title: "Execution Started", description: `Patch ${id} execution initiated. Status changed to Deploy.` });
    navigate("/patch-job");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="page-title">Execute Patch Job - {id}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pre-Execution Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox id="backup" checked={executeData.backupCompleted} onCheckedChange={(checked) => setExecuteData({ ...executeData, backupCompleted: checked as boolean })} />
            <Label htmlFor="backup" className="cursor-pointer">Backup completed *</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="notification" checked={executeData.notificationSent} onCheckedChange={(checked) => setExecuteData({ ...executeData, notificationSent: checked as boolean })} />
            <Label htmlFor="notification" className="cursor-pointer">Stakeholders notified</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox id="services" checked={executeData.servicesStoppedIfNeeded} onCheckedChange={(checked) => setExecuteData({ ...executeData, servicesStoppedIfNeeded: checked as boolean })} />
            <Label htmlFor="services" className="cursor-pointer">Services stopped (if needed)</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Execution Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Execution Log</Label>
            <Textarea placeholder="Log execution steps and progress..." value={executeData.executionLog} onChange={(e) => setExecuteData({ ...executeData, executionLog: e.target.value })} rows={5} />
          </div>
          <div className="space-y-2">
            <Label>Issues Encountered</Label>
            <Textarea placeholder="Document any issues encountered during execution..." value={executeData.issues} onChange={(e) => setExecuteData({ ...executeData, issues: e.target.value })} rows={3} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={handleExecute} className="gap-2"><Play className="h-4 w-4" />Start Execution</Button>
      </div>
    </div>
  );
};

export default PatchExecute;
