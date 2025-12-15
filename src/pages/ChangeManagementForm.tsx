import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const ChangeManagementForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const change = location.state?.change;
  
  const [showDeniedModal, setShowDeniedModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [denialReason, setDenialReason] = useState("");
  const [approvalForm, setApprovalForm] = useState({
    impact: "",
    implementation: "",
    schedule: "",
    technician: ""
  });

  const handleDenySubmit = () => {
    console.log("Denied:", denialReason);
    setShowDeniedModal(false);
    navigate("/change-management");
  };

  const handleApproveSubmit = () => {
    console.log("Approved:", approvalForm);
    setShowApproveModal(false);
    navigate("/change-management");
  };

  if (!change) {
    return <div>No change request found</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate("/change-management")}
          style={{ borderColor: "#384E66" }}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 
          className="text-5xl font-bold"
          style={{ color: "#253040" }}
        >
          Change Request Form - {change.id}
        </h1>
      </div>

      <Card style={{ backgroundColor: "#FDFDFD", borderColor: "#384E66" }}>
        <CardHeader>
          <CardTitle style={{ color: "#253040" }}>Request Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Jenis Perubahan</Label>
              <Input value={change.type} readOnly className="mt-2" />
            </div>
            <div>
              <Label>Alasan</Label>
              <Textarea value={change.reason} readOnly rows={3} className="mt-2" />
            </div>
            <div>
              <Label>Tujuan</Label>
              <Textarea value={change.purpose} readOnly rows={2} className="mt-2" />
            </div>
            <div>
              <Label>Aset Terdampak</Label>
              <Input value={change.affectedAssets} readOnly className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4 mt-8">
        <Button 
          variant="destructive" 
          onClick={() => setShowDeniedModal(true)}
          size="lg"
        >
          Denied
        </Button>
        <Button 
          onClick={() => setShowApproveModal(true)}
          style={{ backgroundColor: "#384E66" }}
          size="lg"
        >
          Approve
        </Button>
      </div>

      {/* Denied Modal */}
      <Dialog open={showDeniedModal} onOpenChange={setShowDeniedModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alasan Penolakan</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Reason for Denial</Label>
            <Textarea 
              value={denialReason} 
              onChange={(e) => setDenialReason(e.target.value)}
              placeholder="Enter reason for denying this change request..."
              rows={4}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeniedModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDenySubmit}>Submit Denial</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Modal */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Approval Form - {change.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Dampak & Risiko</Label>
              <Textarea 
                value={approvalForm.impact}
                onChange={(e) => setApprovalForm({...approvalForm, impact: e.target.value})}
                placeholder="Describe impact and risks..."
                rows={3}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Rencana Implementasi</Label>
              <Textarea 
                value={approvalForm.implementation}
                onChange={(e) => setApprovalForm({...approvalForm, implementation: e.target.value})}
                placeholder="Implementation plan..."
                rows={3}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Jadwal Pelaksanaan</Label>
              <Input 
                type="datetime-local"
                value={approvalForm.schedule}
                onChange={(e) => setApprovalForm({...approvalForm, schedule: e.target.value})}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Assign to Technician</Label>
              <Input 
                value={approvalForm.technician}
                onChange={(e) => setApprovalForm({...approvalForm, technician: e.target.value})}
                placeholder="Technician name..."
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveModal(false)}>Cancel</Button>
            <Button onClick={handleApproveSubmit} style={{ backgroundColor: "#384E66" }}>
              Submit Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChangeManagementForm;
