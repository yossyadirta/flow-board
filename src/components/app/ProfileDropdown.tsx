"use client";

import React, { useState } from "react";
import { User, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { SettingsModal } from "@/components/app/SettingsModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export function ProfileDropdown({ 
  userEmail,
  userProfile 
}: { 
  userEmail: string | null;
  userProfile?: { name: string, bg_color: string } | null;
}) {
  const router = useRouter();
  const [isOpenSettingsModal, setIsOpenSettingsModal] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="w-10 h-10 rounded-md bg-transparent text-muted-foreground flex items-center justify-center hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer shrink-0"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="right" className="w-48 ml-2">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Account</p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {userEmail || "Guest User"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsOpenSettingsModal(true)} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await supabase.auth.signOut();
              localStorage.clear();
              window.location.href = "/";
            }}
            className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/30"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsModal
        open={isOpenSettingsModal}
        onOpenChange={setIsOpenSettingsModal}
        userEmail={userEmail}
        userProfile={userProfile}
      />
    </>
  );
}
