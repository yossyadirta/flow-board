"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from "./TaskForm";
import { useTasks } from "@/hooks/useTasks";
import { useState } from "react";
import { TaskCover, TaskStatus } from "@/types/task";
import { toast } from "sonner";
import { formatDueDate } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  status?: TaskStatus | undefined;
  boardId: string;
};

export function AddTaskModal({ open, onClose, status, boardId }: Props) {
  const { addTask } = useTasks();

  const [canSubmit, setCanSubmit] = useState(false);

  const handleSubmit = ({
    title,
    status,
    dueDate,
    description,
    cover,
    assigneeId,
  }: {
    title: string;
    status: TaskStatus;
    dueDate?: Date;
    description?: string;
    cover?: { type: "none" | "color" | "image"; value?: string };
    assigneeId?: string | null;
  }) => {
    const newTask = {
      boardId,
      title,
      status,
      dueDate,
      description,
      cover: cover as TaskCover | undefined,
      assigneeId,
    };
    addTask(newTask);
    onClose();
    toast.success("Task has been created", {
      description: formatDueDate(new Date(), true),
      position: "top-center",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="sr-only">Add Task</DialogTitle>
        </DialogHeader>
        <TaskForm
          boardId={boardId}
          onSubmit={handleSubmit}
          onValidityChange={setCanSubmit}
          defaultValues={{
            status,
          }}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="board-form" disabled={!canSubmit}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
