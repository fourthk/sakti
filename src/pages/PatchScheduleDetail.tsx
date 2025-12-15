import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PatchScheduleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - in real app would fetch based on id
  const schedule = {
    id: id,
    patchId: "PCH-001",
    title: "DBMS Minor Update",
    date: "20/1/2024",
    time: "14:00 - 16:00",
    assignee: "John Doe",
    status: "Upcoming",
    location: "Data Center A",
    description: "Apply minor database update to improve stability and performance.",
    prerequisites: "Full backup completed, maintenance window approved",
    impact: "Database will be unavailable for approximately 15 minutes",
    version: "v2.0.0 → v2.1.0",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
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
          <div className="pt-2">
            <span className="text-sm text-muted-foreground">Version: </span>
            <span className="font-medium">{schedule.version}</span>
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
          <div>
            <h4 className="font-medium text-foreground mb-1">Prerequisites</h4>
            <p className="text-muted-foreground">{schedule.prerequisites}</p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-1">Expected Impact</h4>
            <p className="text-muted-foreground">{schedule.impact}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
      </div>
    </div>
  );
};

export default PatchScheduleDetail;
