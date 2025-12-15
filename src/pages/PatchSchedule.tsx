import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";

interface ScheduleItem {
  id: string;
  patchId: string;
  title: string;
  date: string;
  time: string;
  assignee: string;
  status: string;
}

const PatchSchedule = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      console.log("[PatchSchedule] Fetching patch schedules...");
      try {
        const response = await api.getPatchSchedules();
        console.log("[PatchSchedule] Schedules received:", response);
        
        // Extract data array from response.data
        const dataArray = response?.data || response || [];
        console.log("[PatchSchedule] Extracted data:", dataArray);
        
        const formattedSchedules = (Array.isArray(dataArray) ? dataArray : []).map((item: any) => ({
          id: item.id || item.schedule_id || "",
          patchId: item.patch_id || item.job_id || item.patch_job_id || "",
          title: item.title || item.name || item.scope_asset || "",
          date: item.schedule_at || item.date || item.scheduled_date || "",
          time: item.time || item.scheduled_time || "",
          assignee: item.technician_name || item.assignee || item.technician || "",
          status: item.status || "Upcoming",
        }));
        
        setSchedules(formattedSchedules);
      } catch (error) {
        console.error("[PatchSchedule] Failed to fetch schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const getStatusStyle = (status: string) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "completed") return "text-green-600";
    if (statusLower === "in progress") return "text-blue-600";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <h1 className="page-title">Patch Schedule</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : schedules.length === 0 ? (
        <p className="text-muted-foreground">No schedules found</p>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <Card
              key={schedule.id}
              className="p-4 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => navigate(`/patch-schedule/${schedule.id}`)}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{schedule.id}</span>
                  <span>•</span>
                  <span>{schedule.patchId}</span>
                  <span className={`ml-auto ${getStatusStyle(schedule.status)}`}>{schedule.status}</span>
                </div>
                <h3 className="font-semibold text-foreground">{schedule.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{schedule.date ? new Date(schedule.date).toLocaleDateString('id-ID') : "-"}</span>
                    {schedule.time && (
                      <>
                        <span>•</span>
                        <span>{schedule.time}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>{schedule.assignee || "-"}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatchSchedule;
