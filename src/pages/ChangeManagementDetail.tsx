import { ArrowLeft, CheckCircle2, Circle, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const ChangeManagementDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const change = location.state?.change || {
    id: "CHG-001",
    type: "Infrastructure Update",
    department: "IT Operations",
    affectedAssets: "Server-DB-01, Server-DB-02",
    pic: "John Doe",
    scheduleDate: "2025-01-20",
    status: "In Review",
    riskScore: 7.5,
    updatedAt: "2025-01-15 10:30",
    reason: "Upgrade database version for security patches",
    purpose: "Improve system security and performance",
    impact: "Minimal downtime expected during upgrade",
    implementation: "Rolling upgrade with backup procedures",
    technician: "Jane Smith"
  };

  const getStatusColor = (status: string) => {
    const colors = {
      "Submitted": "bg-blue-100 text-blue-800 border-blue-300",
      "In Review": "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Approved": "bg-green-100 text-green-800 border-green-300",
      "Scheduled": "bg-purple-100 text-purple-800 border-purple-300",
      "Implementing": "bg-orange-100 text-orange-800 border-orange-300",
      "Completed": "bg-gray-100 text-gray-800 border-gray-300",
      "Denied": "bg-red-100 text-red-800 border-red-300"
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getRiskProgress = (score: number) => {
    return (score / 10) * 100;
  };

  const getRiskColor = (score: number) => {
    if (score >= 7) return "bg-red-500";
    if (score >= 5) return "bg-orange-500";
    return "bg-green-500";
  };

  const timeline = [
    { status: "Submitted", date: "2025-01-10 09:00", completed: true },
    { status: "Reviewed", date: "2025-01-12 14:30", completed: true },
    { status: "Approved", date: "2025-01-15 10:30", completed: change.status !== "Submitted" && change.status !== "In Review" },
    { status: "Scheduled", date: "2025-01-20 08:00", completed: change.status === "Scheduled" || change.status === "Implementing" || change.status === "Completed" },
    { status: "Implementing", date: "Pending", completed: change.status === "Implementing" || change.status === "Completed" },
    { status: "Completed", date: "Pending", completed: change.status === "Completed" }
  ];

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
          Request Detail
        </h1>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card style={{ backgroundColor: "#FDFDFD", borderColor: "#384E66" }}>
          <CardHeader>
            <CardTitle style={{ color: "#253040" }}>Asset Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Change Type</p>
              <p className="font-semibold" style={{ color: "#253040" }}>{change.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-semibold" style={{ color: "#253040" }}>{change.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Affected Assets</p>
              <p className="font-semibold" style={{ color: "#253040" }}>{change.affectedAssets}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">PIC</p>
              <p className="font-semibold" style={{ color: "#253040" }}>{change.pic}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge className={getStatusColor(change.status)}>{change.status}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: "#FDFDFD", borderColor: "#384E66" }}>
          <CardHeader>
            <CardTitle style={{ color: "#253040" }}>Technical Specification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Scheduled Date</p>
              <p className="font-semibold" style={{ color: "#253040" }}>{change.scheduleDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Assigned Technician</p>
              <p className="font-semibold" style={{ color: "#253040" }}>{change.technician || "Not assigned yet"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-semibold" style={{ color: "#253040" }}>{change.updatedAt}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Risk Score</p>
              <div className="flex items-center gap-3">
                <Progress 
                  value={getRiskProgress(change.riskScore)} 
                  className="h-2"
                  style={{ backgroundColor: "#E5E7EB" }}
                />
                <span className="font-bold" style={{ color: "#253040" }}>{change.riskScore}/10</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request Details */}
      <Card style={{ backgroundColor: "#FDFDFD", borderColor: "#384E66" }} className="mb-8">
        <CardHeader>
          <CardTitle style={{ color: "#253040" }}>Request Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Reason</p>
            <p style={{ color: "#253040" }}>{change.reason}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Purpose</p>
            <p style={{ color: "#253040" }}>{change.purpose}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Impact & Risk</p>
            <p style={{ color: "#253040" }}>{change.impact}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Implementation Plan</p>
            <p style={{ color: "#253040" }}>{change.implementation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Risk Score Visualization */}
      <Card style={{ backgroundColor: "#FDFDFD", borderColor: "#384E66" }} className="mb-8">
        <CardHeader>
          <CardTitle style={{ color: "#253040" }}>Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div 
                className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ 
                  backgroundColor: change.riskScore >= 7 ? "#fee2e2" : change.riskScore >= 5 ? "#fed7aa" : "#d1fae5",
                  border: `4px solid ${change.riskScore >= 7 ? "#dc2626" : change.riskScore >= 5 ? "#ea580c" : "#10b981"}`
                }}
              >
                <span className="text-4xl font-bold" style={{ 
                  color: change.riskScore >= 7 ? "#dc2626" : change.riskScore >= 5 ? "#ea580c" : "#10b981"
                }}>
                  {change.riskScore}
                </span>
              </div>
              <p className="text-lg font-semibold mb-2" style={{ color: "#253040" }}>
                {change.riskScore >= 7 ? "High Risk" : change.riskScore >= 5 ? "Medium Risk" : "Low Risk"}
              </p>
              <p className="text-sm text-gray-600">
                Risk assessment based on impact and complexity
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card style={{ backgroundColor: "#FDFDFD", borderColor: "#384E66" }}>
        <CardHeader>
          <CardTitle style={{ color: "#253040" }}>Change Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  {item.completed ? (
                    <CheckCircle2 size={24} className="text-green-500" />
                  ) : (
                    <Circle size={24} className="text-gray-300" />
                  )}
                  {index < timeline.length - 1 && (
                    <div 
                      className={`w-0.5 h-12 ${item.completed ? "bg-green-500" : "bg-gray-300"}`}
                    />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <p className="font-semibold" style={{ color: "#253040" }}>{item.status}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock size={14} />
                    {item.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeManagementDetail;
