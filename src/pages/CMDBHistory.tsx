import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const mockHistory = [
  {
    historyId: "HIS001",
    assetId: "AST001",
    changeType: "Status Update",
    oldValue: "Maintenance",
    newValue: "Active",
    changedBy: "John Doe",
    changedAt: "2024-03-10 14:35:22",
  },
  {
    historyId: "HIS002",
    assetId: "AST001",
    changeType: "IP Address",
    oldValue: "192.168.1.9",
    newValue: "192.168.1.10",
    changedBy: "Jane Smith",
    changedAt: "2024-03-05 09:20:15",
  },
  {
    historyId: "HIS003",
    assetId: "AST001",
    changeType: "OS Version",
    oldValue: "Ubuntu 20.04 LTS",
    newValue: "Ubuntu 22.04 LTS",
    changedBy: "John Doe",
    changedAt: "2024-02-28 16:45:00",
  },
  {
    historyId: "HIS004",
    assetId: "AST001",
    changeType: "Location",
    oldValue: "Data Center B - Rack 5",
    newValue: "Data Center A - Rack 12",
    changedBy: "IT Admin",
    changedAt: "2024-02-15 11:10:30",
  },
];

const CMDBHistory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-5xl font-bold" style={{ color: "#253040" }}>
          Change History
        </h1>
      </div>

      {/* History Table */}
      <div
        className="rounded-lg overflow-hidden shadow-sm mb-6"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
        }}
      >
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: "#384E66" }}>
              <TableHead className="text-white font-semibold">History ID</TableHead>
              <TableHead className="text-white font-semibold">Asset ID</TableHead>
              <TableHead className="text-white font-semibold">Change Type</TableHead>
              <TableHead className="text-white font-semibold">Old Value</TableHead>
              <TableHead className="text-white font-semibold">New Value</TableHead>
              <TableHead className="text-white font-semibold">Changed By</TableHead>
              <TableHead className="text-white font-semibold">Changed At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockHistory.map((record) => (
              <TableRow key={record.historyId} className="hover:bg-gray-50">
                <TableCell className="font-medium">{record.historyId}</TableCell>
                <TableCell>{record.assetId}</TableCell>
                <TableCell>{record.changeType}</TableCell>
                <TableCell className="text-gray-600">{record.oldValue}</TableCell>
                <TableCell className="text-green-700 font-medium">{record.newValue}</TableCell>
                <TableCell>{record.changedBy}</TableCell>
                <TableCell>{record.changedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={currentPage === 1} onClick={() => setCurrentPage(1)}>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={currentPage === 2} onClick={() => setCurrentPage(2)}>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={currentPage === 3} onClick={() => setCurrentPage(3)}>
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
              className={currentPage === 3 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CMDBHistory;
