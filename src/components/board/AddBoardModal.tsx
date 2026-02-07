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
import { generateId } from "@/lib/id";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BoardIconId } from "./BoardIcons";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AddBoardModal({ open, onClose }: Props) {
  const router = useRouter();

  const { addBoard } = useBoards();

  const [canSubmit, setCanSubmit] = useState(false);

  const handleSubmit = ({
    name,
    icon,
  }: {
    name: string;
    icon: BoardIconId;
  }) => {
    const id = generateId();
    addBoard(id, name, icon);
    onClose();
    router.push(`/board/${id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Board</DialogTitle>
        </DialogHeader>
        <BoardForm onSubmit={handleSubmit} onValidityChange={setCanSubmit} />
        <DialogFooter>
          <DialogClose>
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
