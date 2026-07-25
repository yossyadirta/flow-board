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
import { Task } from "@/types/task";
import { toast } from "sonner";
import { formatDueDate } from "@/lib/utils";
import { TaskFormValues } from "@/schemas/task.schemas";

type Props = {
  open: boolean;
  onClose: () => void;
  data: Task | null;
};

export function EditTaskModal({ open, onClose, data }: Props) {
  const { updateTaskContent } = useTasks();

  const [canSubmit, setCanSubmit] = useState(false);

  const handleSubmit = ({
    title,
    status,
    dueDate,
    description,
    cover,
  }: TaskFormValues) => {
    if (!data?.boardId) return;

    const updatedTask = {
      ...data,
      title,
      status,
      dueDate,
      description,
      cover,
    };
    updateTaskContent(updatedTask as Task);
    onClose();
    toast.success("Task has been updated", {
      description: formatDueDate(new Date(), true),
      position: "top-center",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="sr-only">Edit Task</DialogTitle>
        </DialogHeader>
        <TaskForm
          onSubmit={handleSubmit}
          onValidityChange={setCanSubmit}
          defaultValues={{
            status: data?.status,
            title: data?.title,
            dueDate: data?.dueDate ? new Date(data.dueDate) : undefined,
            description: data?.description,
            cover: data?.cover,
          }}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="board-form" disabled={!canSubmit}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
