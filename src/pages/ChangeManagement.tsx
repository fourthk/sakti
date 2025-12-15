import { useState } from "react";
import { Search, MoreVertical } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

// Mock data
const mockChanges = [
  {
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
  },
  {
    id: "CHG-002",
    type: "Network Configuration",
    department: "Network Team",
    affectedAssets: "Switch-Core-01",
    pic: "Alice Johnson",
    scheduleDate: "2025-01-22",
    status: "Approved",
    riskScore: 4.2,
    updatedAt: "2025-01-14 14:20",
    reason: "Configure VLAN for new department",
    purpose: "Improve network segmentation",
    impact: "No downtime expected",
    implementation: "Configuration change during maintenance window",
    technician: "Bob Wilson"
  },
  {
    id: "CHG-003",
    type: "Software Deployment",
    department: "Development",
    affectedAssets: "App-Server-05",
    pic: "Mike Brown",
    scheduleDate: "2025-01-18",
    status: "Completed",
    riskScore: 3.8,
    updatedAt: "2025-01-13 09:15",
    reason: "Deploy new application version",
    purpose: "Add new features requested by users",
    impact: "Brief service interruption",
    implementation: "Blue-green deployment strategy",
    technician: "Sarah Lee"
  },
  {
    id: "CHG-004",
    type: "Security Patch",
    department: "Security Team",
    affectedAssets: "All Workstations",
    pic: "Tom Wilson",
    scheduleDate: "2025-01-25",
    status: "Submitted",
    riskScore: 6.5,
    updatedAt: "2025-01-16 11:45",
    reason: "Critical security vulnerability patch",
    purpose: "Address CVE-2025-0001",
    impact: "Requires system restart",
    implementation: "Staged rollout across departments",
    technician: ""
  },
];

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

const getRiskColor = (score: number) => {
  if (score >= 7) return "text-red-600 font-bold";
  if (score >= 5) return "text-orange-600 font-semibold";
  return "text-green-600 font-medium";
};

const ChangeManagement = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");

  const itemsPerPage = 5;
  const filteredChanges = statusFilter === "All" 
    ? mockChanges 
    : mockChanges.filter(c => c.status === statusFilter);
  
  const totalPages = Math.ceil(filteredChanges.length / itemsPerPage);
  const currentChanges = filteredChanges.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const summaryData = [
    { label: "Laporan Masuk", count: mockChanges.length },
    { label: "Changes in Review", count: mockChanges.filter(c => c.status === "In Review").length },
    { label: "Approved", count: mockChanges.filter(c => c.status === "Approved").length },
    { label: "Completed", count: mockChanges.filter(c => c.status === "Completed").length }
  ];

  const recentActivities = mockChanges
    .filter(c => c.status === "Approved")
    .slice(0, 3);

  const handleFormClick = (change: any) => {
    navigate(`/change-management/form/${change.id}`, { state: { change } });
  };

  const handleDetailClick = (change: any) => {
    navigate(`/change-management/detail/${change.id}`, { state: { change } });
  };

  return (
    <div>
      <h1 
        className="text-5xl font-bold mb-8"
        style={{ color: "#253040" }}
      >
        Change Management
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {summaryData.map((item, index) => (
          <Card key={index} style={{ backgroundColor: "#FDFDFD", borderColor: "#384E66" }}>
            <CardContent className="p-6">
              <p className="text-sm text-gray-600 mb-2">{item.label}</p>
              <p className="text-3xl font-bold" style={{ color: "#253040" }}>{item.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Change Calendar and Recent Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card 
          style={{ backgroundColor: "#FDFDFD", borderColor: "#384E66" }}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/change-management/calendar")}
        >
          <CardHeader>
            <CardTitle style={{ color: "#253040" }}>Change Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              className="rounded-md border-0"
            />
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: "#FDFDFD", borderColor: "#384E66" }}>
          <CardHeader>
            <CardTitle style={{ color: "#253040" }}>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: "#FAFAFA" }}>
                  <div>
                    <p className="font-semibold" style={{ color: "#253040" }}>{activity.id}</p>
                    <p className="text-sm text-gray-600">{activity.type}</p>
                  </div>
                  <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card style={{ backgroundColor: "#FDFDFD", borderColor: "#384E66" }}>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle style={{ color: "#253040" }}>Change Requests</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input 
                  placeholder="Search" 
                  className="pl-10 w-full"
                  style={{ borderColor: "#E5E7EB", backgroundColor: "white" }}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40" style={{ backgroundColor: "#384E66", color: "white", borderColor: "#384E66" }}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Denied">Denied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: "#384E66" }}>
                <TableHead className="text-white w-32">Request ID</TableHead>
                <TableHead className="text-white w-48">Jenis Perubahan</TableHead>
                <TableHead className="text-white w-40">Dinas / Pengaju</TableHead>
                <TableHead className="text-white w-48">Aset Terdampak</TableHead>
                <TableHead className="text-white w-32">PIC</TableHead>
                <TableHead className="text-white w-44">Jadwal Implementasi</TableHead>
                <TableHead className="text-white w-32">Status</TableHead>
                <TableHead className="text-white w-28">Skor Risiko</TableHead>
                <TableHead className="text-white w-40">Updated At</TableHead>
                <TableHead className="text-white w-20">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentChanges.map((change) => (
                <TableRow key={change.id}>
                  <TableCell className="font-medium">{change.id}</TableCell>
                  <TableCell>{change.type}</TableCell>
                  <TableCell>{change.department}</TableCell>
                  <TableCell>{change.affectedAssets}</TableCell>
                  <TableCell>{change.pic}</TableCell>
                  <TableCell>{change.scheduleDate}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(change.status)}>{change.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={getRiskColor(change.riskScore)}>{change.riskScore}</span>
                  </TableCell>
                  <TableCell>{change.updatedAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleFormClick(change)}>
                          Form
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDetailClick(change)}>
                          Detail
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeManagement;
