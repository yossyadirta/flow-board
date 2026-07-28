"use client";

import React from "react";
import { Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BOARD_ICONS_MAP,
  BoardIconId,
} from "@/components/app/board/BoardIcons";
import { useRouter } from "next/navigation";
import { AddBoardModal } from "@/components/app/board/AddBoardModal";
import { useBoardDashboardData } from "@/hooks/app/useBoardDashboardData";
import { useAppState } from "@/hooks/useAppState";
import { useOnboardingContext } from "@/context/OnboardingContext";
import { EmptyState } from "@/components/app/EmptyStateDashboard";
import { RecentActivitiesCard } from "@/components/app/RecentActivityCard";
import { ProjectStatusList } from "@/components/app/ProjectStatusList";
import { UpcomingDeadlinesCard } from "@/components/app/UpcomingDeadlinesCard";
import { Board } from "@/types/board";
import { DashboardSkeleton } from "@/components/app/skeletons/DashboardSkeleton";
import { supabase } from "@/lib/supabase";

export default function HomeDashboard() {
  const router = useRouter();
  const { state } = useAppState();
  const { signalEvent } = useOnboardingContext();

  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [userName, setUserName] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserEmail(data.user.email ?? null);
        setUserName(data.user.user_metadata?.full_name ?? null);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUserEmail(session.user.email ?? null);
          setUserName(session.user.user_metadata?.full_name ?? null);
        }
      }
    );

    window.addEventListener("profile-updated", fetchUser);
    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener("profile-updated", fetchUser);
    };
  }, []);

  const {
    boards,
    showFavoritesModal,
    setShowFavoritesModal,
    isOpenAddBoardModal,
    setIsOpenAddBoardModal,
    hasBoards,
    favoriteBoards,
    hasFavorites,
    displayFavorites,
    remainingFavoritesCount,
    upcomingTasks,
    hasUpcomingTasks,
    recentTasks,
    getBoardMetrics,
    getBoardName,
  } = useBoardDashboardData();

  if (state.isFetching || state.isMutating) {
    return <DashboardSkeleton />;
  }

  if (!hasBoards) {
    return (
      <>
        <EmptyState setIsOpenAddBoardModal={setIsOpenAddBoardModal} userName={userName} />
        <AddBoardModal
          open={isOpenAddBoardModal}
          onClose={() => setIsOpenAddBoardModal(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 w-full h-full overflow-y-auto xl:overflow-hidden bg-slate-50/50 dark:bg-background/95 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Welcome back{userName ? <span>, {userName}</span> : ""}!
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Track and manage all your personal projects in one place.
            </p>
          </div>
          <Button
            data-onboarding="create-board-btn"
            className="shadow-md hover:shadow-lg transition-all rounded-full px-6 w-full sm:w-auto shrink-0 cursor-pointer"
            onClick={() => {
              setIsOpenAddBoardModal(true);
              signalEvent("create-board-clicked");
            }}
          >
            <Plus className="h-4 w-4 md:h-5 md:w-5" />
            Create New Board
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1 xl:min-h-0 pb-10 xl:pb-4">
          <div className="xl:col-span-2 flex flex-col gap-6 xl:h-full xl:min-h-0">
            <section className="shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <h2 className="text-lg md:text-xl font-semibold">
                    Favorite Boards
                  </h2>
                </div>
                {remainingFavoritesCount > 0 && (
                  <button
                    onClick={() => setShowFavoritesModal(true)}
                    className="text-xs font-medium text-muted-foreground bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2 py-1 rounded-md transition-colors"
                  >
                    + {remainingFavoritesCount} others hidden
                  </button>
                )}
              </div>

              {!hasFavorites ? (
                <div className="p-6 rounded-xl bg-slate-100/50 dark:bg-slate-800/30 text-center flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    No favorite boards yet. Click the{" "}
                    <Star className="inline h-3 w-3 mx-1" /> icon on a board to
                    pin it here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {displayFavorites.map((board: Board) => {
                    const metrics = getBoardMetrics(board.id);
                    const emoji =
                      BOARD_ICONS_MAP[board.icon as BoardIconId]?.emoji || "📋";
                    return (
                      <Card
                        key={board.id}
                        onClick={() => router.push(`/app/${board.key}`)}
                        className="group cursor-pointer hover:shadow-md hover:border-primary/50 transition-all border-t-4 border-t-primary"
                      >
                        <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                          <div>
                            <CardTitle className="text-base md:text-lg flex items-center gap-2">
                              <span>{emoji}</span>{" "}
                              <span className="truncate max-w-30">
                                {board.name}
                              </span>
                            </CardTitle>
                            <CardDescription className="mt-1 text-xs md:text-sm">
                              {board.key}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground mb-2">
                            <span>Progress</span>
                            <span className="font-medium text-foreground">
                              {metrics.progress}%
                            </span>
                          </div>
                          <Progress value={metrics.progress} className="h-2" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>

            <ProjectStatusList
              boards={boards}
              getBoardMetrics={getBoardMetrics}
            />
          </div>

          <div className="flex flex-col gap-6 xl:h-full xl:min-h-0">
            <UpcomingDeadlinesCard
              hasUpcomingTasks={hasUpcomingTasks}
              upcomingTasks={upcomingTasks}
              boards={boards}
              getBoardName={getBoardName}
            />

            <RecentActivitiesCard recentTasks={recentTasks} />
          </div>
        </div>
      </div>
      <Dialog open={showFavoritesModal} onOpenChange={setShowFavoritesModal}>
        <DialogContent className="sm:max-w-150 w-[95%] max-h-[90vh] flex flex-col p-4 md:p-6 rounded-xl">
          <DialogHeader className="shrink-0">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              All Favorite Boards
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-3 mt-4 -mr-3">
            <div className="flex flex-col gap-3 pb-4">
              {favoriteBoards.map((board) => {
                const metrics = getBoardMetrics(board.id);
                const emoji =
                  BOARD_ICONS_MAP[board.icon as BoardIconId]?.emoji || "📋";
                return (
                  <div
                    key={`modal-${board.id}`}
                    onClick={() => {
                      setShowFavoritesModal(false);
                      router.push(`/app/${board.key}`);
                    }}
                    className="p-3 md:p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-card hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{emoji}</span>
                        <div>
                          <h3 className="font-medium text-sm md:text-base leading-none mb-1">
                            {board.name}
                          </h3>
                          <p className="text-[10px] md:text-xs text-muted-foreground">
                            {board.key}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-xs md:text-sm text-foreground">
                          {metrics.progress}%
                        </span>
                      </div>
                    </div>
                    <Progress value={metrics.progress} className="h-1.5 mt-1" />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <AddBoardModal
        open={isOpenAddBoardModal}
        onClose={() => setIsOpenAddBoardModal(false)}
      />
    </>
  );
}
