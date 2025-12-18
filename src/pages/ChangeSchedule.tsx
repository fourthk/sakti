import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ScheduleItem {
  changeId: string;
  title: string;
  date: string;
  time: string;
  status: "Upcoming" | "In Progress" | "Completed";
}

const mockSchedules: ScheduleItem[] = [
  { changeId: "CR-001", title: "Update Server Configuration", date: "20/1/2024", time: "14:00 - 16:00", status: "Upcoming" },
  { changeId: "CR-002", title: "Deploy New Application", date: "22/1/2024", time: "10:00 - 12:00", status: "Upcoming" },
  { changeId: "CR-003", title: "Database Migration", date: "25/1/2024", time: "20:00 - 23:00", status: "Upcoming" },
  { changeId: "CR-004", title: "Network Switch Upgrade", date: "18/1/2024", time: "08:00 - 10:00", status: "Completed" },
  { changeId: "CR-005", title: "Security Patch Installation", date: "19/1/2024", time: "22:00 - 23:30", status: "In Progress" },
];

const ChangeSchedule = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="page-title">Change Schedule</h1>

      <div className="space-y-4">
        {mockSchedules.map((schedule) => (
          <Card
            key={schedule.changeId}
            className="p-4 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => navigate(`/change-schedule/${schedule.changeId}`)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {schedule.changeId}
                </div>

              <h3 className="font-semibold text-foreground">
                {schedule.title}
              </h3>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{schedule.date}</span>
                  <span>•</span>
                  <span>{schedule.time}</span>
                </div>
              </div>

              <div className="text-sm font-medium rounded px-2 py-1 bg-muted">
                {schedule.status}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChangeSchedule;
