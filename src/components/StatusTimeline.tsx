import { cn } from "@/lib/utils";

interface StatusStep {
  status: string;
  date?: string;
  by?: string;
}

interface StatusTimelineProps {
  steps: StatusStep[];
  allStatuses: string[];
}

const StatusTimeline = ({ steps, allStatuses }: StatusTimelineProps) => {
  const completedStatuses = steps.map((s) => s.status);
  const currentIndex = completedStatuses.length - 1;

  return (
    <div className="space-y-0">
      {allStatuses.map((status, index) => {
        const stepData = steps.find((s) => s.status === status);
        const isCompleted = completedStatuses.includes(status);
        const isCurrent = completedStatuses[currentIndex] === status;
        const isLast = index === allStatuses.length - 1;

        return (
          <div key={status} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-3 h-3 rounded-full border-2 flex-shrink-0",
                  isCompleted
                    ? "bg-primary border-primary"
                    : "bg-background border-muted-foreground/30"
                )}
              />
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 h-8",
                    isCompleted && !isCurrent ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              )}
            </div>
            <div className={cn("pb-6", isLast && "pb-0")}>
              <p
                className={cn(
                  "font-medium text-sm -mt-0.5",
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {status}
              </p>
              {stepData && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stepData.date} {stepData.by && `• ${stepData.by}`}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;
