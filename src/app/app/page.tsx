"use client";

import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
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
import { ProductivityTrendCard } from "@/components/app/ProductivityTrendCard";
import { Board } from "@/types/board";
import { DashboardSkeleton } from "@/components/app/skeletons/DashboardSkeleton";
import { TaskCompletionChart } from "@/components/app/TaskCompletionChart";
import { TodayFocusCard } from "@/components/app/TodayFocusCard";
import { BentoProjectsCard } from "@/components/app/BentoProjectsCard";
import { TodayProgressCard } from "@/components/app/TodayProgressCard";
import { DashboardHeader } from "@/components/app/DashboardHeader";
import { supabase } from "@/lib/supabase";

export default function HomeDashboard() {
  const router = useRouter();
  const { state } = useAppState();
  const { signalEvent } = useOnboardingContext();

  const [userName, setUserName] = React.useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserName(data.user.user_metadata?.full_name ?? null);
        setCurrentUserId(data.user.id ?? null);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUserName(session.user.user_metadata?.full_name ?? null);
          setCurrentUserId(session.user.id ?? null);
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
    mappedTasks,
    showFavoritesModal,
    setShowFavoritesModal,
    isOpenAddBoardModal,
    setIsOpenAddBoardModal,
    hasBoards,
    favoriteBoards,
    recentTasks,
    getBoardMetrics,
    totalTasks,
    completedTasks,
    inProgressTasks,
    overdueTasks,
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
      <div className="h-full flex flex-col gap-3 overflow-hidden px-4 pt-4 pb-3">

        <DashboardHeader
          userName={userName}
          tasks={mappedTasks}
          onNewBoard={() => {
            setIsOpenAddBoardModal(true);
            signalEvent("create-board-clicked");
          }}
        />

        <div className="flex-1 min-h-0 bg-secondary rounded-2xl overflow-hidden p-2">

          <motion.div
            className="flex flex-col gap-2 xl:hidden h-full overflow-y-auto pb-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="h-72 shrink-0">
              <TodayFocusCard tasks={mappedTasks} boards={boards} currentUserId={currentUserId} />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="h-64 shrink-0">
              <TaskCompletionChart
                tasks={mappedTasks}
                totalTasks={totalTasks}
                completedTasks={completedTasks}
                inProgressTasks={inProgressTasks}
                overdueTasks={overdueTasks}
              />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="h-40 shrink-0">
              <TodayProgressCard tasks={mappedTasks} />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="h-60 shrink-0">
              <BentoProjectsCard boards={boards} getBoardMetrics={getBoardMetrics} />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="h-64 shrink-0">
              <ProductivityTrendCard tasks={mappedTasks} />
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="h-72 shrink-0">
              <RecentActivitiesCard recentTasks={recentTasks} />
            </motion.div>
          </motion.div>

          <motion.div
            className="hidden xl:grid h-full gap-2"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.08 } }
            }}
            style={{
              gridTemplateAreas: `
                "focus chart  chart   chart ring"
                "focus proj   cal     act   act"
                "focus proj   cal     act   act"
              `,
              gridTemplateColumns: "2fr 2fr 2.5fr 1.5fr 2fr",
              gridTemplateRows: "2.5fr 1fr 1.5fr",
            }}
          >
            <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} style={{ gridArea: "focus" }} className="min-h-0">
              <TodayFocusCard
                tasks={mappedTasks}
                boards={boards}
                currentUserId={currentUserId}
              />
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} style={{ gridArea: "chart" }} className="min-h-0">
              <TaskCompletionChart
                tasks={mappedTasks}
                totalTasks={totalTasks}
                completedTasks={completedTasks}
                inProgressTasks={inProgressTasks}
                overdueTasks={overdueTasks}
              />
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} style={{ gridArea: "ring" }} className="min-h-0">
              <TodayProgressCard tasks={mappedTasks} />
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} style={{ gridArea: "proj" }} className="min-h-0">
              <BentoProjectsCard boards={boards} getBoardMetrics={getBoardMetrics} />
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} style={{ gridArea: "cal" }} className="min-h-0">
              <ProductivityTrendCard tasks={mappedTasks} />
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }} style={{ gridArea: "act" }} className="min-h-0">
              <RecentActivitiesCard recentTasks={recentTasks} />
            </motion.div>
          </motion.div>
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
                const emoji = BOARD_ICONS_MAP[board.icon as BoardIconId]?.emoji || "📋";
                return (
                  <div
                    key={`modal-${board.id}`}
                    onClick={() => {
                      setShowFavoritesModal(false);
                      if (board.key) {
                        router.push(`/app/board/${board.key}`);
                      }
                    }}
                    className="p-3 md:p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{emoji}</span>
                        <div>
                          <h3 className="font-medium text-sm leading-none mb-1">{board.name}</h3>
                          <p className="text-[10px] text-muted-foreground">{board.key}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-sm text-foreground">{metrics.progress}%</span>
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
