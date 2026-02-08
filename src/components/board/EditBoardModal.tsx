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
import { BoardForm } from "./BoardForm";
import { useBoards } from "@/hooks/useBoards";
import { useState } from "react";
import { BoardIconId } from "./BoardIcons";
import { Board } from "@/types/board";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  data: Board | null;
};

export function EditBoardModal({ open, onClose, data }: Props) {
  const { updateBoard } = useBoards();

  const [canSubmit, setCanSubmit] = useState(false);

  const handleSubmit = ({
    name,
    icon,
  }: {
    name: string;
    icon: BoardIconId;
  }) => {
    if (!data?.id) return;

    const board: Board = { ...data, name, icon };
    updateBoard(board);
    onClose();
    toast.success("Board has been updated");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Board</DialogTitle>
        </DialogHeader>
        <BoardForm
          onSubmit={handleSubmit}
          onValidityChange={setCanSubmit}
          defaultValues={{
            name: data?.name ?? "",
            icon: data?.icon ?? "briefcase",
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
