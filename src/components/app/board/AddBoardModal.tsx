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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BoardIconId } from "./BoardIcons";
import { useOnboardingContext } from "@/context/OnboardingContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AddBoardModal({ open, onClose }: Props) {
  const router = useRouter();

  const { addBoard } = useBoards();
  const { signalEvent } = useOnboardingContext();

  const [canSubmit, setCanSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async ({
    name,
    icon,
    key,
  }: {
    name: string;
    icon: BoardIconId;
    key: string;
  }) => {
    setIsSubmitting(true);
    try {
      await addBoard({ key, name, icon });
      onClose();
      signalEvent("board-created");
      router.push(`/app/${key}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <DialogContent 
        className="sm:max-w-sm" 
        data-onboarding="board-modal"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add Board</DialogTitle>
        </DialogHeader>
        <BoardForm onSubmit={handleSubmit} onValidityChange={setCanSubmit} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="board-form" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
