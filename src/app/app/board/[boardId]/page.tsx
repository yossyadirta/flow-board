"use client";

import React, { useEffect, useEffectEvent, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTasks } from "@/hooks/useTasks";
import { useBoards } from "@/hooks/useBoards";

import { ModalState } from "@/types/state";
import { useBoardActions } from "@/hooks/app/useBoardActions";
import { useBoardDnd } from "@/hooks/app/useBoardDnd";
import { useBoardDerived } from "@/hooks/app/useBoardDerived";
import BoardHeader from "@/components/app/BoardHeader";
import BoardView from "@/components/app/BoardView";
import BoardModals from "@/components/app/BoardModals";
import { useOnboardingContext } from "@/context/OnboardingContext";
import { BoardPageSkeleton } from "@/components/app/skeletons/BoardSkeletons";
import { motion } from "framer-motion";

const Page = () => {
  const params = useParams<{ boardId: string }>();
  const boardKey = params.boardId;

  const router = useRouter();
  const { boards, isLoading: isBoardsLoading, isFetching: isBoardsFetching } = useBoards();

  const currentBoard = useMemo(() => {
    if (!boardKey) return null;

    return boards.find((item) => item.key === boardKey) ?? null;
  }, [boardKey, boards]);

  const boardId = currentBoard?.id as string;

  const { tasks, isLoading } = useTasks();
  const { signalEvent } = useOnboardingContext();
  const actions = useBoardActions({ boardId });
  const dnd = useBoardDnd({ boardId, onboardingSignal: signalEvent });
  const derived = useBoardDerived({ boardId });

  const [modalState, setModalState] = useState<ModalState>({
    type: null,
  });
  const [mounted, setMounted] = useState(false);

  const handleUpdateMounted = useEffectEvent(() => {
    setMounted(true);
  });

  const closeModal = () => setModalState({ type: null });

  useEffect(() => {
    handleUpdateMounted();
  }, []);

  useEffect(() => {
    if (!isBoardsLoading && !isBoardsFetching && !currentBoard && mounted) {
      router.push("/app");
    }
  }, [isBoardsLoading, isBoardsFetching, currentBoard, mounted, router]);

  if (!mounted || isBoardsLoading) {
    return <BoardPageSkeleton />;
  }

  if (!currentBoard) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full flex flex-col overflow-hidden p-4 md:p-6"
    >
      <BoardHeader
        derived={derived}
        mounted={mounted}
        modalState={modalState}
        setModalState={setModalState}
        closeModal={closeModal}
        onToggleFavorite={actions.onToggleFavorite}
        isFavorite={derived.currentBoard?.isFavorite ?? false}
      />
      <BoardView
        dnd={dnd}
        derived={derived}
        tasks={tasks}
        mounted={mounted}
        modalState={modalState}
        setModalState={setModalState}
        boardId={boardId}
        actions={actions}
        isLoading={isLoading}
      />
      <BoardModals
        modalState={modalState}
        closeModal={closeModal}
        actions={actions}
        dnd={dnd}
        derived={derived}
      />
    </motion.div>
  );
};

export default Page;
