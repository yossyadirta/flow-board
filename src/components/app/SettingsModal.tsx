"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string | null;
}

export function SettingsModal({ open, onOpenChange, userEmail }: SettingsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) {
      loadProfile();
    }
  }, [open]);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        setName(user.user_metadata.full_name);
      } else {
        setName("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name },
      });

      if (error) throw error;
      toast.success("Profile updated successfully!");
      window.dispatchEvent(new Event("profile-updated"));
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border border-slate-200/50 dark:border-border/50 bg-white dark:bg-zinc-950 shadow-xl p-0 rounded-2xl overflow-hidden gap-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <User className="w-5 h-5" />
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="flex flex-col items-center gap-4 pb-2">
            {/* Read-only Avatar Display */}
            {userEmail ? (
              <div 
                className="w-20 h-20 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold text-3xl uppercase border-2 border-primary/30"
                title={userEmail}
              >
                {userEmail.charAt(0)}
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-muted-foreground border-2 border-slate-200 dark:border-zinc-800">
                <User size={32} />
              </div>
            )}
            <div className="text-sm font-medium text-muted-foreground">
              {userEmail}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Display Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <User size={16} />
                </div>
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 h-11 bg-slate-50 dark:bg-zinc-900/50"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
