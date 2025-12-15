import { ReactNode, useState } from "react";
import { Calendar } from "lucide-react";

interface ChartCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

const ChartCard = ({ title, description, children }: ChartCardProps) => {
  const [dateFilter, setDateFilter] = useState("allTime");

  return (
    <div 
      className="rounded-lg p-6 shadow-sm"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #384E66",
      }}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold" style={{ color: "#384E66" }}>
              {title}
            </h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="allTime">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
