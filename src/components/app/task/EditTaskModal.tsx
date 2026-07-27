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
import { TaskComments } from "./TaskComments";
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
    assigneeId,
  }: TaskFormValues) => {
    if (!data?.boardId) return;

    const updatedTask = {
      ...data,
      title,
      status,
      dueDate,
      description,
      cover,
      assigneeId,
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
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden flex flex-col max-h-[85vh]">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="text-xl">Task Details</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Form */}
          <div className="p-6 overflow-y-auto max-h-[60vh] md:max-h-full border-r border-border/50">
            <TaskForm
              boardId={data?.boardId || ""}
              onSubmit={handleSubmit}
              onValidityChange={setCanSubmit}
              defaultValues={{
                status: data?.status,
                title: data?.title,
                dueDate: data?.dueDate ? new Date(data.dueDate) : undefined,
                description: data?.description,
                cover: data?.cover,
                assigneeId: data?.assigneeId,
              }}
            />
          </div>

          {/* Right Column: Comments & Activity */}
          <div className="p-6 pt-0 md:pt-6 bg-muted/10 overflow-hidden flex flex-col h-full min-h-[400px]">
            <TaskComments taskId={data?.id || ""} />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/30 shrink-0">
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
