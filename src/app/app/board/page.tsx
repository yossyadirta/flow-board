"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBoards } from "@/hooks/useBoards";
import { LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";


const BoardIndexPage = () => {
  const router = useRouter();
  const { boards, isLoading } = useBoards();

  useEffect(() => {
    if (!isLoading && boards && boards.length > 0) {
      const firstBoard = boards[0];
      if (firstBoard?.key) {
        router.replace(`/app/board/${firstBoard.key}`);
      }
    }
  }, [boards, isLoading, router]);

  if (isLoading) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="max-w-md flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-2 shadow-sm">
          <LayoutDashboard size={32} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">No Boards Yet</h1>
        <p className="text-muted-foreground">
          You don't have any boards. Create your first board from the sidebar to get started!
        </p>
      </div>
    </motion.div>
  );
};

export default BoardIndexPage;
