import { useEffect, useState } from "react";
import { FileText, Clock, CheckCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { api } from "@/lib/api";

interface DashboardSummary {
  total_today: number;
  pending_inspection: number;
  approved_waiting_schedule: number;
  today_schedules: number;
}

interface WeeklyTrendItem {
  date: string;
  day: string;
  submitted: number;
  inspected: number;
  implemented: number;
}

const Dashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyTrendItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log("[Dashboard] Fetching dashboard data...");
      try {
        const [summaryResponse, trendResponse] = await Promise.all([
          api.getDashboardSummary(),
          api.getDashboardWeeklyTrend(),
        ]);

        console.log("[Dashboard] Summary data received:", summaryResponse);
        console.log("[Dashboard] Weekly trend data received:", trendResponse);

        // Extract summary
        const summaryData = summaryResponse?.data || summaryResponse;

        // Extract trend from nested data
        const trendData = trendResponse?.data?.trend || [];

        console.log("[Dashboard] Extracted summary:", summaryData);
        console.log("[Dashboard] Extracted trend:", trendData);

        setSummary(summaryData);
        setWeeklyData(trendData);
      } catch (error) {
        console.error("[Dashboard] Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statsCards = [
    {
      title: "Total Today",
      value: summary?.total_today ?? 0,
      icon: FileText,
    },
    {
      title: "Pending Inspection",
      value: summary?.pending_inspection ?? 0,
      icon: Clock,
    },
    {
      title: "Approved Waiting Schedule",
      value: summary?.approved_waiting_schedule ?? 0,
      icon: CheckCircle,
    },
    {
      title: "Today Schedules",
      value: summary?.today_schedules ?? 0,
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="page-title">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">
                    {loading ? "..." : stat.value}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-muted">
                  <stat.icon size={22} className="text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Trend</CardTitle>
          <CardDescription>Reports Submitted / Inspected / Implemented</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barCategoryGap="20%">
                <XAxis
                  dataKey="day"
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar dataKey="submitted" name="Submitted" fill="hsl(210 26% 31%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="inspected" name="Inspected" fill="hsl(210 26% 50%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="implemented" name="Implemented" fill="hsl(210 26% 70%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
