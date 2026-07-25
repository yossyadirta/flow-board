import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Board } from "@/types/board";
import { OptionDropdown } from "@/components/ui/option-dropdown";
import { ModalState } from "@/types/state";
import { Star, UserPlus } from "lucide-react";
import { BoardActivitySheet } from "@/components/app/board/BoardActivitySheet";
import { ShareBoardModal } from "@/components/app/board/ShareBoardModal";
import { useBoardMembers } from "@/hooks/useBoardMembers";
import { supabase } from "@/lib/supabase";
import { Task } from "@/types/task";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
  const [isGuest, setIsGuest] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null);
      setIsGuest(data.user?.is_anonymous || !data.user?.email);
    });
  }, []);

  const { members } = useBoardMembers(derived.currentBoard?.id || "");
  const maxDisplay = 4;
  const displayMembers = members.slice(0, maxDisplay);
  const extraMembers = Math.max(0, members.length - maxDisplay);

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
          
          <div className="h-4 w-px bg-slate-200 dark:bg-zinc-800 mx-1"></div>

          <TooltipProvider delayDuration={100}>
            <div className="flex items-center -space-x-2 mr-1">
              {displayMembers.map((member, i) => {
                const isMe = currentUserId === member.user_id;
                const displayName = member.profiles?.name || "";
                const displayEmail = member.profiles?.email || "";
                const avatarInitial = displayName ? displayName.charAt(0).toUpperCase() : displayEmail.charAt(0).toUpperCase() || "?";
                
                return (
                  <Tooltip key={member.user_id}>
                    <TooltipTrigger asChild>
                      <Avatar 
                        className="w-7 h-7 border-2 border-background shadow-sm relative cursor-pointer"
                        style={{ zIndex: 10 - i }}
                      >
                        <AvatarFallback 
                          className="text-white text-[10px]"
                          style={{ backgroundColor: member.profiles?.bg_color || "#9CA3AF" }}
                        >
                          {avatarInitial}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent className="flex flex-col gap-0.5">
                      <span className="font-semibold">{displayName || displayEmail} {isMe && "(You)"}</span>
                      {displayEmail && <span className="text-xs text-muted-foreground">{displayEmail}</span>}
                      <span className="text-[10px] text-muted-foreground uppercase mt-0.5">{member.role}</span>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
              {extraMembers > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className="w-7 h-7 rounded-full bg-slate-100 dark:bg-zinc-800 border-2 border-background flex items-center justify-center text-[10px] font-medium text-muted-foreground relative cursor-pointer"
                      style={{ zIndex: 0 }}
                    >
                      +{extraMembers}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>{extraMembers} more member{extraMembers > 1 ? "s" : ""}</span>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>

          {!isGuest && (
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer text-xs font-medium mr-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Share
            </button>
          )}

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
      
      {derived.currentBoard && (
        <ShareBoardModal
          open={showShareModal}
          onOpenChange={setShowShareModal}
          boardId={derived.currentBoard.id}
          currentUserId={currentUserId}
          boardOwnerId={derived.currentBoard.owner_id || null}
        />
      )}
    </div>
  );
};

export default BoardHeader;
