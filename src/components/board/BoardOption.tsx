"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, PencilIcon, TrashIcon } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: () => void;
  onDelete: () => void;
  onUpdate: () => void;
};

export function BoardOption({ open, onOpenChange, onDelete, onUpdate }: Props) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem onClick={onUpdate}>
          <PencilIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
