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
  userProfile?: { name: string, bg_color: string } | null;
}

export function SettingsModal({ open, onOpenChange, userEmail, userProfile }: SettingsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [bgColor, setBgColor] = useState("#3B82F6");

  const PREDEFINED_COLORS = [
    "#EF4444", "#F97316", "#F59E0B", "#10B981",
    "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"
  ];

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
      } else if (userProfile?.name) {
        setName(userProfile.name);
      } else {
        setName("");
      }

      if (userProfile?.bg_color) {
        setBgColor(userProfile.bg_color);
      } else {
        setBgColor(PREDEFINED_COLORS[Math.floor(Math.random() * PREDEFINED_COLORS.length)]);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Update the profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ name: name, bg_color: bgColor })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Update auth metadata for redundancy
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: name },
      });

      if (authError) throw authError;
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
            {userEmail ? (
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-3xl uppercase text-white shadow-sm transition-colors"
                style={{ backgroundColor: bgColor }}
                title={name || userEmail}
              >
                {(name || userEmail).charAt(0)}
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
                  placeholder={userEmail ? "Your Name" : "Guest User (Cannot Edit)"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 h-11 bg-slate-50 dark:bg-zinc-900/50"
                  disabled={isLoading || !userEmail}
                />
              </div>
              {!userEmail && (
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-2 font-medium">
                  Guest users cannot update their profile. Please log in with Google to enable editing.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Avatar Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {PREDEFINED_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    disabled={isLoading || !userEmail}
                    className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${bgColor === color ? "border-foreground scale-110" : "border-transparent hover:scale-110"
                      } ${!userEmail ? "opacity-50 cursor-not-allowed" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setBgColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-medium"
            disabled={isLoading || !userEmail}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
