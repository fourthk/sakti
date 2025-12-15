import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CMDBDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const activityData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Updates",
        data: [2, 4, 3, 5, 4, 6],
        borderColor: "#384E66",
        backgroundColor: "rgba(56, 78, 102, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

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
          Asset Detail
        </h1>
      </div>

      {/* Asset Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card
          className="shadow-sm"
          style={{
            backgroundColor: "#FDFDFD",
            border: "1px solid #384E66",
          }}
        >
          <CardHeader>
            <CardTitle style={{ color: "#384E66" }}>Asset Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Asset ID:</span>
                <span className="text-gray-900">AST{id?.padStart(3, "0")}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Hostname:</span>
                <span className="text-gray-900">srv-prod-01</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-semibold text-gray-700">IP Address:</span>
                <span className="text-gray-900">192.168.1.10</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Operating System:</span>
                <span className="text-gray-900">Ubuntu 22.04 LTS</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Owner:</span>
                <span className="text-gray-900">John Doe</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold text-gray-700">Status:</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="shadow-sm"
          style={{
            backgroundColor: "#FDFDFD",
            border: "1px solid #384E66",
          }}
        >
          <CardHeader>
            <CardTitle style={{ color: "#384E66" }}>Technical Specification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Vendor:</span>
                <span className="text-gray-900">Dell</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Model:</span>
                <span className="text-gray-900">PowerEdge R740</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Version:</span>
                <span className="text-gray-900">Gen 14</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Location:</span>
                <span className="text-gray-900">Data Center A - Rack 12</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Department:</span>
                <span className="text-gray-900">IT Operations</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold text-gray-700">Serial Number:</span>
                <span className="text-gray-900">SN123456789</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline Chart */}
      <Card
        className="shadow-sm"
        style={{
          backgroundColor: "#FDFDFD",
          border: "1px solid #384E66",
        }}
      >
        <CardHeader>
          <CardTitle style={{ color: "#384E66" }}>Recent Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: "250px" }}>
            <Line data={activityData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CMDBDetail;
