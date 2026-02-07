"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTasks } from "@/hooks/useTasks";
import { Task, TaskStatus } from "@/types/task";
import { useBoards } from "@/hooks/useBoards";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { BOARD_ICONS_MAP } from "@/components/board/BoardIcons";
import { BoardOption } from "@/components/board/BoardOption";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useRouter } from "next/navigation";

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
    type: "delete",
    isOpen: false,
  });

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

    if (nextBoardId) router.push(`/board/${nextBoardId}`);
    else router.push("/board");
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

    const findBoard = boards.find((item) => item.id === boardId);
    if (!findBoard) return null;

    const { emoji, bg } = BOARD_ICONS_MAP[findBoard.icon];

    return { ...findBoard, emoji, bg };
  }, [boardId, boards]);

  return (
    <div>
      <div className="flex justify-between align-top">
        <div className="flex flex-col gap-2">
          <Avatar
            className={cn(
              "h-10 w-10 flex items-center justify-center border transition-colors  ",
            )}
            style={{ backgroundColor: currentBoard?.bg }}
          >
            <AvatarFallback className="bg-transparent text-lg">
              {currentBoard?.emoji}
            </AvatarFallback>
          </Avatar>
          <h1>{currentBoard?.name}</h1>
        </div>
        <div>
          <BoardOption
            open={modalState.type === "delete" && modalState.isOpen}
            onOpenChange={() => {
              if (modalState.type === "delete" && modalState.isOpen) {
                setModalState({
                  isOpen: false,
                  type: "",
                });
              } else {
                setModalState({
                  isOpen: true,
                  type: "delete",
                });
              }
            }}
            onDelete={() => {
              setModalState({
                isOpen: true,
                type: "delete-confirmation",
              });
            }}
            onUpdate={() => {}}
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
        open={modalState.type === "delete-confirmation" && modalState.isOpen}
        onClose={() =>
          setModalState({
            isOpen: false,
            type: "",
          })
        }
        title="Delete Board?"
        description="This will permanently delete this board. Are you sure want to delete?"
        onDelete={handleDeleteBoard}
      />
    </div>
  );
};

export default Page;
