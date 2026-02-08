"use client";

import React, { useEffect, useEffectEvent, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTasks } from "@/hooks/useTasks";
import { Task, TaskStatus } from "@/types/task";
import { useBoards } from "@/hooks/useBoards";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BOARD_ICONS_MAP } from "@/components/board/BoardIcons";
import { BoardOption } from "@/components/board/BoardOption";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useRouter } from "next/navigation";
import { EditBoardModal } from "@/components/board/EditBoardModal";
import { toast } from "sonner";

const TASK_STATUS: {
  title: string;
  id: TaskStatus;
}[] = [
  {
    title: "Todo",
    id: "todo",
  },
  {
    title: "In Progress",
    id: "in-progress",
  },
  {
    title: "Done",
    id: "done",
  },
];

const Page = () => {
  const params = useParams<{ boardId: string }>();
  const router = useRouter();

  const boardId = params.boardId;
  const {
    tasks,
    addTask,
    deleteTask,
    updateTaskContent,
    updateTaskStatus,
    updateTaskOrder,
  } = useTasks();
  const { boards, deleteBoard } = useBoards();

  const [modalState, setModalState] = useState({
    type: "",
    isOpen: false,
    variant: "",
  });

  const [mounted, setMounted] = useState(false);

  const handleUpdateMounted = useEffectEvent(() => {
    setMounted(true);
  });

  useEffect(() => {
    handleUpdateMounted();
  }, []);

  const handleAddTask = (status: TaskStatus, dueDate: number) => {
    addTask(boardId, status, status, dueDate);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  const handleUpdateTaskStatus = (id: string, status: TaskStatus) => {
    updateTaskStatus(id, "done");
  };

  const getNextBoardId = () => {
    const index = boards.findIndex((item) => item.id === boardId);
    if (index === -1) return null;
    if (boards[index + 1]) return boards[index + 1].id;
    if (boards[index - 1]) return boards[index - 1].id;

    return null;
  };

  const handleDeleteBoard = () => {
    const nextBoardId = getNextBoardId();
    deleteBoard(boardId);

    if (nextBoardId) {
      router.push(`/board/${nextBoardId}`);
    } else {
      router.push("/board");
    }
    toast.success("Board has been deleted");
  };

  const handleUpdateTaskOrder = (
    id: string,
    order: number,
    status: TaskStatus,
  ) => {
    updateTaskOrder(id, order + 1, status);
  };

  const handleUpdateTaskContent = (task: Task) => {
    updateTaskContent(task);
  };

  const currentBoard = useMemo(() => {
    if (!boardId) return null;

    return boards.find((item) => item.id === boardId) ?? null;
  }, [boardId, boards]);

  const { emoji, bg } = BOARD_ICONS_MAP[currentBoard?.icon ?? "briefcase"];

  if (!mounted) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <div className="flex justify-between align-top">
        <div className="flex flex-col gap-2">
          <Avatar
            className="h-10 w-10 flex items-center justify-center border transition-colors"
            style={{ backgroundColor: bg }}
          >
            <AvatarFallback className="bg-transparent text-lg">
              {emoji}
            </AvatarFallback>
          </Avatar>
          <h3 className="scroll-m-20 text-center text-xl font-extrabold tracking-tight text-balance">
            {currentBoard?.name ?? ""}
          </h3>
        </div>
        <div>
          <BoardOption
            open={modalState.variant === "delete" && modalState.isOpen}
            onOpenChange={() => {
              if (modalState.variant === "delete" && modalState.isOpen) {
                setModalState({
                  isOpen: false,
                  type: "",
                  variant: "",
                });
              } else {
                setModalState({
                  isOpen: true,
                  type: "board",
                  variant: "delete",
                });
              }
            }}
            onDelete={() => {
              setModalState({
                isOpen: true,
                type: "board",
                variant: "delete-confirmation",
              });
            }}
            onUpdate={() => {
              setModalState({
                isOpen: true,
                type: "board",
                variant: "edit",
              });
            }}
          />
        </div>
      </div>
      <br />
      <br />
      <div className="flex flex-row gap-4 justify-between">
        {TASK_STATUS.map((status) => {
          return (
            <div className="w-full" key={status.id}>
              <p>{status.title}</p>
              {tasks
                .filter(
                  (item) =>
                    item.status === status.id && boardId === item.boardId,
                )
                .sort((a, b) => a.order - b.order)
                .map((item) => {
                  return (
                    <li key={item.id}>
                      <p>{item.title}</p>
                      <p>{item.description}</p>
                      <button onClick={() => handleDeleteTask(item.id)}>
                        Delete task
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateTaskOrder(
                            item.id,
                            item.order,
                            item.status,
                          )
                        }
                      >
                        Update Task Order
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateTaskStatus(item.id, item.status)
                        }
                      >
                        Update Task Status
                      </button>
                    </li>
                  );
                })}
              <button onClick={() => handleAddTask(status.id, 0)}>
                Add New Task
              </button>
            </div>
          );
        })}
      </div>
      <ConfirmDialog
        open={modalState.variant === "delete-confirmation" && modalState.isOpen}
        onClose={() =>
          setModalState({
            isOpen: false,
            type: "",
            variant: "",
          })
        }
        title={`Delete ${modalState.type}?`}
        description={`This will permanently delete this ${modalState.type}. Are you sure want to delete?`}
        onDelete={() => {
          if (modalState.type === "board") return handleDeleteBoard();
          if (modalState.type === "task") return handleDeleteTask();
          return null;
        }}
      />
      <EditBoardModal
        open={
          modalState.variant === "edit" &&
          modalState.isOpen &&
          modalState.type === "board"
        }
        data={currentBoard}
        onClose={() => {
          setModalState({
            isOpen: false,
            type: "",
            variant: "",
          });
        }}
      />
    </div>
  );
};

export default Page;
