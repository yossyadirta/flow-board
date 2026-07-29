import { Plus, Layout, BarChart3, ClipboardList, Clock, Activity, Target, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnboardingContext } from "@/context/OnboardingContext";
import { DashboardHeader } from "@/components/app/DashboardHeader";

interface EmptyStateProps {
  setIsOpenAddBoardModal: (isOpen: boolean) => void;
  userName?: string | null;
}

export function EmptyState({ setIsOpenAddBoardModal, userName }: EmptyStateProps) {
  const { signalEvent } = useOnboardingContext();

  const handleCreate = () => {
    setIsOpenAddBoardModal(true);
    signalEvent("create-board-clicked");
  };

  return (
    <div className="h-full flex flex-col gap-3 overflow-hidden px-4 pt-4 pb-3">
      <DashboardHeader
        userName={userName || null}
        tasks={[]}
        onNewBoard={handleCreate}
      />

      <div className="flex-1 min-h-0 bg-secondary rounded-2xl overflow-hidden p-2">
        <div className="flex flex-col gap-2 xl:hidden h-full overflow-y-auto pb-4">
          <div className="h-[300px] shrink-0">
            <EmptyBentoCard title="Welcome to Flowboard" desc="Create your first board to start tracking your work." icon={Layout} isPrimary onClick={handleCreate} />
          </div>
          <div className="h-48 shrink-0">
            <EmptyBentoCard title="Task Activity" icon={BarChart3} />
          </div>
          <div className="h-40 shrink-0">
            <EmptyBentoCard title="Today's Goal" icon={Target} />
          </div>
        </div>

        <div
          className="hidden xl:grid h-full gap-2"
          style={{
            gridTemplateColumns: "2fr 2fr 2.5fr 1.5fr 2fr",
            gridTemplateRows: "2.5fr 1fr 1.5fr",
            gridTemplateAreas: `
              "focus chart chart chart ring"
              "focus proj  proj  act   act"
              "focus proj  proj  cal   cal"
            `,
          }}
        >
          <div style={{ gridArea: "focus" }} className="min-h-0">
            <EmptyBentoCard
              title="Today's Focus"
              desc="Your daily priorities will appear here."
              icon={Target}
            />
          </div>

          <div style={{ gridArea: "chart" }} className="min-h-0">
            <EmptyBentoCard title="Task Activity" icon={BarChart3} />
          </div>

          <div style={{ gridArea: "ring" }} className="min-h-0">
            <EmptyBentoCard title="Today's Goal" icon={ClipboardList} />
          </div>

          <div style={{ gridArea: "proj" }} className="min-h-0">
            <EmptyBentoCard
              title="Projects & Boards"
              desc="Create your first board to start tracking your work."
              icon={Layout}
              isPrimary
              onClick={handleCreate}
            />
          </div>

          <div style={{ gridArea: "act" }} className="min-h-0">
            <EmptyBentoCard title="Recent Activity" icon={Activity} />
          </div>

          <div style={{ gridArea: "cal" }} className="min-h-0">
            <EmptyBentoCard title="Productivity Trend" icon={CalendarDays} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyBentoCard({ title, desc, icon: Icon, isPrimary, onClick }: any) {
  return (
    <div className="h-full w-full rounded-2xl border-2 border-dashed border-border/50 bg-card/40 flex flex-col items-center justify-center p-6 text-center">
      <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-[200px] mb-4">
        {desc || "Data will populate here once you start working."}
      </p>
      {isPrimary && (
        <Button size="sm" className="rounded-full px-5 shadow-sm" onClick={onClick}>
          <Plus className="h-4 w-4 mr-1.5" />
          Create Board
        </Button>
      )}
    </div>
  );
}
