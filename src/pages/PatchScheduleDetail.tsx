import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PatchScheduleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // added to prevent ReferenceError
  const data: any = {};

  // Mock data - in real app would fetch based on id
  const schedule = {
    id: id,
    patchId: "PCH-001",
    title: "Update Server Configuration",
    date: "20/1/2024",
    time: "14:00 - 16:00",
    assignee: "John Doe",
    status: "Upcoming",
    location: "Data Center A",
    description: "Update server configuration to improve performance and security.",
    prerequisites: "Backup completed, stakeholders notified",
    impact: "Minimal downtime expected (5-10 minutes)",
  };

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
        <h1 className="page-title">Schedule Detail - {id}</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{schedule.title}</CardTitle>
            <Badge variant="info">{schedule.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{schedule.date}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{schedule.time}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{schedule.assignee}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{schedule.location}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-1">Description</h4>
            <p className="text-muted-foreground">{schedule.description}</p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="border border-border rounded-lg p-4 text-center bg-card">
              <p className="text-sm text-muted-foreground">Skor Dampak</p>
              <p className="text-2xl font-bold text-foreground">
                {data.skor_dampak || "-"}
              </p>
            </div>
            <div className="border border-border rounded-lg p-4 text-center bg-card">
              <p className="text-sm text-muted-foreground">Skor Kemungkinan</p>
              <p className="text-2xl font-bold text-foreground">
                {data.skor_kemungkinan || "-"}
              </p>
            </div>
            <div className="border border-border rounded-lg p-4 text-center bg-card">
              <p className="text-sm text-muted-foreground">Skor Exposure</p>
              <p className="text-2xl font-bold text-foreground">
                {data.skor_exposure || "-"}
              </p>
            </div>
            <div className="border border-destructive/30 rounded-lg p-4 text-center bg-red-50">
              <p className="text-sm text-destructive">Risk Score</p>
              <p className="text-2xl font-bold text-destructive">
                {data.risk_score || "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default PatchScheduleDetail;
