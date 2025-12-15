import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ScheduleItem {
  id: string;
  changeId: string;
  title: string;
  date: string;
  time: string;
  assignee: string;
  status: "Upcoming" | "In Progress" | "Completed";
}

const mockSchedules: ScheduleItem[] = [
  { id: "SCH-001", changeId: "CR-001", title: "Update Server Configuration", date: "20/1/2024", time: "14:00 - 16:00", assignee: "John Doe", status: "Upcoming" },
  { id: "SCH-002", changeId: "CR-002", title: "Deploy New Application", date: "22/1/2024", time: "10:00 - 12:00", assignee: "Jane Smith", status: "Upcoming" },
  { id: "SCH-003", changeId: "CR-003", title: "Database Migration", date: "25/1/2024", time: "20:00 - 23:00", assignee: "Mike Johnson", status: "Upcoming" },
  { id: "SCH-004", changeId: "CR-004", title: "Network Switch Upgrade", date: "18/1/2024", time: "08:00 - 10:00", assignee: "Sarah Wilson", status: "Completed" },
  { id: "SCH-005", changeId: "CR-005", title: "Security Patch Installation", date: "19/1/2024", time: "22:00 - 23:30", assignee: "Tom Brown", status: "In Progress" },
];

const ChangeSchedule = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="page-title">Change Schedule</h1>

      <div className="space-y-4">
        {mockSchedules.map((schedule) => (
          <Card
            key={schedule.id}
            className="p-4 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => navigate(`/change-schedule/${schedule.id}`)}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{schedule.id}</span>
                <span>•</span>
                <span>{schedule.changeId}</span>
              </div>
              <h3 className="font-semibold text-foreground">{schedule.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{schedule.date}</span>
                  <span>•</span>
                  <span>{schedule.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  <span>{schedule.assignee}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChangeSchedule;
