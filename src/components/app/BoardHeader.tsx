import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Board } from "@/types/board";
import { OptionDropdown } from "@/components/ui/option-dropdown";
import { ModalState } from "@/types/state";
import { Star } from "lucide-react";
import { BoardActivitySheet } from "@/components/app/board/BoardActivitySheet";
import { Task } from "@/types/task";

type Props = {
  derived: {
    emoji: string;
    currentBoard: Board | null;
    recentTasks: Task[];
  };
  mounted: boolean;
  modalState: ModalState;
  setModalState: (data: ModalState) => void;
  closeModal: () => void;
  onToggleFavorite: (boardId: string) => void;
  isFavorite: boolean;
};

const BoardHeader = ({
  derived,
  setModalState,
  modalState,
  closeModal,
  onToggleFavorite,
  isFavorite,
}: Props) => {
  return (
    <div className="pt-6 pb-4">
      <div className="flex justify-between align-top">
        <div className="flex flex-row gap-3 items-center align-middle">
          <Avatar className="flex items-center justify-center transition-colors bg-secondary rounded-md w-8.5 h-8.5">
            <AvatarFallback className="bg-secondary text-md">
              {derived.emoji}
            </AvatarFallback>
          </Avatar>
          <h3 className="scroll-m-20 text-xl font-bold tracking-tight text-balance align-middle">
            {derived.currentBoard?.name ?? ""}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <BoardActivitySheet recentTasks={derived.recentTasks} />
          <button
            onClick={() => {
              if (derived.currentBoard?.id) {
                onToggleFavorite(derived.currentBoard.id);
              }
            }}
            className="rounded-md transition-colors cursor-pointer"
          >
            <Star
              className={`h-4 w-4 transition-colors ${
                isFavorite
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
          <OptionDropdown
            open={modalState.type === "option-board"}
            onOpenChange={() => {
              if (modalState.type === "option-board") {
                closeModal();
              } else {
                setModalState({
                  type: "option-board",
                });
              }
            }}
            onDelete={() => {
              setModalState({
                type: "delete-board",
              });
            }}
            onUpdate={() => {
              setModalState({
                type: "edit-board",
              });
            }}
            btnClassName="
              shadow-none 
              hover:bg-transparent
              dark:hover:bg-transparent!
              focus:outline-none 
              focus:ring-0 
              focus-visible:outline-none 
              focus-visible:ring-0 
              data-[state=open]:bg-transparent
              dark:data-[state=open]:bg-transparent!
              bg-transparent!
              dark:bg-transparent!
              border-0
              "
          />
        </div>
      </div>
    </div>
  );
};

export default BoardHeader;
