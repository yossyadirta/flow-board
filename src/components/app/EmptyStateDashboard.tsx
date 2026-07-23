import {
  Plus,
  Layout,
  BarChart3,
  ClipboardList,
  Clock,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOnboardingContext } from "@/context/OnboardingContext";

interface EmptyStateProps {
  setIsOpenAddBoardModal: (isOpen: boolean) => void;
  userName?: string | null;
}

export function EmptyState({ setIsOpenAddBoardModal, userName }: EmptyStateProps) {
  const { signalEvent } = useOnboardingContext();

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen xl:h-screen xl:overflow-hidden bg-slate-50/50 dark:bg-background/95 p-5 pl-0 xs:pl-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Welcome back{userName ? <span>, {userName}</span> : ""}! 👋
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Track and manage all your personal projects in one place.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1 xl:min-h-0 pb-10 xl:pb-4 overflow-y-auto xl:overflow-hidden overflow-x-hidden">
        <div className="xl:col-span-2 flex flex-col gap-8 xl:h-full xl:min-h-0">
          <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-transparent p-8 md:p-10 flex flex-col items-center justify-center text-center shrink-0">
            <div className="h-10 w-10 md:h-14 md:w-14 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-5">
              <Layout className="h-6 w-6 md:h-6 md:w-6 text-slate-400 dark:text-slate-500" />
            </div>
            <h2 className="text-xl md:text-xl font-bold mb-3 text-foreground">
              Create Your First Board
            </h2>
            <p className="text-muted-foreground max-w-sm mb-8 text-sm md:text-base">
              Create your first board to start organizing your projects and
              tracking your progress.
            </p>
            <Button
              data-onboarding="create-board-btn"
              className="shadow-md hover:shadow-lg transition-all rounded-full px-6 w-full sm:w-auto shrink-0 cursor-pointer"
              onClick={() => {
                setIsOpenAddBoardModal(true);
                signalEvent("create-board-clicked");
              }}
            >
              <Plus className="h-5 w-5" />
              New Board
            </Button>
          </div>

          <section className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <BarChart3 className="h-5 w-5 text-slate-400" />
              <h2 className="text-lg md:text-xl font-semibold text-slate-400">
                Project Status
              </h2>
            </div>
            <div className="flex-1 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-transparent flex flex-col items-center justify-center p-8 text-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-3">
                <ClipboardList className="h-6 w-6 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-sm text-muted-foreground">
                Your project metrics will appear here once you start working.
              </p>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6 xl:h-full xl:min-h-0">
          <Card className="flex flex-col shadow-none border-dashed border-2 border-slate-200 dark:border-slate-800 bg-transparent xl:flex-1 xl:min-h-0 py-2">
            <CardHeader className="p-4 pl-8">
              <CardTitle className="text-base md:text-lg flex items-center gap-2 text-slate-400">
                <Clock className="h-4 w-4 text-slate-400" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-3">
                <Clock className="h-5 w-5 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-xs text-muted-foreground">
                No upcoming deadlines yet.
              </p>
            </CardContent>
          </Card>

          <Card className="flex flex-col shadow-none border-dashed border-2 border-slate-200 dark:border-slate-800 bg-transparent xl:flex-1 xl:min-h-0 py-2">
            <CardHeader className="p-4 pl-8">
              <CardTitle className="text-base md:text-lg flex items-center gap-2 text-slate-400">
                <Activity className="h-4 w-4 text-slate-400" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-3">
                <Activity className="h-5 w-5 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-xs text-muted-foreground">
                Your activity log is currently empty.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
