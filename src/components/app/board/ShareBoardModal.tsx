"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, X, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useBoardMembers } from "@/hooks/useBoardMembers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ShareBoardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardId: string;
  currentUserId: string | null;
  boardOwnerId: string | null;
}

export const ShareBoardModal = ({ 
  open, 
  onOpenChange, 
  boardId,
  currentUserId,
  boardOwnerId
}: ShareBoardModalProps) => {
  const [email, setEmail] = useState("");
  const { members, inviteMember, removeMember, isInviting, isLoading } = useBoardMembers(boardId);

  const isOwner = currentUserId === boardOwnerId;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    try {
      await inviteMember(email.trim());
      toast.success("User invited successfully!");
      setEmail("");
    } catch (error: any) {
      toast.error(error.message || "Failed to invite user");
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await removeMember(userId);
      toast.success("Member removed");
    } catch (error: any) {
      toast.error("Failed to remove member");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl bg-white dark:bg-zinc-950 border-slate-200/50 dark:border-border/50">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <UserPlus className="w-5 h-5 text-primary" />
            Share Board
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {!isOwner && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-500 rounded-lg text-xs font-medium">
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
              <p>You are a member of this board. Only the owner can invite or remove members.</p>
            </div>
          )}

          {isOwner && (
            <form onSubmit={handleInvite} className="space-y-3">
              <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Invite via Email
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter exact email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-zinc-900/50"
                  disabled={isInviting}
                  type="email"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isInviting || !email.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                  {isInviting ? "..." : "Invite"}
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Current Members
            </label>
            <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading members...</p>
              ) : members.length === 0 ? (
                <p className="text-sm text-muted-foreground">No members yet.</p>
              ) : (
                members.map((member) => (
                  <div key={member.user_id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 border-2 border-background shadow-sm">
                        <AvatarFallback 
                          className="text-white text-[10px]"
                          style={{ backgroundColor: member.profiles?.bg_color || "#9CA3AF" }}
                        >
                          {member.profiles?.name?.charAt(0).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium leading-none">
                          {member.profiles?.name || "Unknown User"}
                          {currentUserId === member.user_id && " (You)"}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {member.role === "owner" ? "Owner" : member.profiles?.email || "Member"}
                        </span>
                      </div>
                    </div>
                    {isOwner && member.role !== "owner" && (
                      <button
                        onClick={() => handleRemove(member.user_id)}
                        className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors"
                        title="Remove member"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
