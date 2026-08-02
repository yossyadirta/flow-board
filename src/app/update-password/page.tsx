"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    // Check if the user is actually authenticated
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You are not authorized to view this page or your session expired.");
        router.push("/");
      } else {
        setIsCheckingSession(false);
      }
    };
    
    checkSession();
  }, [router]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      toast.success("Password updated successfully!", {
        position: "top-center"
      });
      
      // Redirect to the dashboard
      router.push("/app");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background">
        <span className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-background p-4">
      <Link href="/" className="flex items-center gap-2 mb-8 absolute top-8 left-8">
        <Image src="/logo.svg" alt="Flowboard" width={32} height={32} />
        <span className="font-bold text-xl">Flowboard</span>
      </Link>
      
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-slate-200/50 dark:border-border/50 shadow-xl rounded-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-center">Reset Password</h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <label className="absolute left-3 top-2 text-[10px] font-semibold tracking-wider text-muted-foreground z-10">
                NEW PASSWORD
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pt-6 pb-2 h-14 bg-slate-100 dark:bg-zinc-900/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-sm"
                disabled={isLoading}
                required
                minLength={6}
              />
            </div>

            <div className="relative">
              <label className="absolute left-3 top-2 text-[10px] font-semibold tracking-wider text-muted-foreground z-10">
                CONFIRM PASSWORD
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pt-6 pb-2 h-14 bg-slate-100 dark:bg-zinc-900/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-sm"
                disabled={isLoading}
                required
                minLength={6}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 mt-4 cursor-pointer bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black rounded-lg text-sm font-medium"
            disabled={isLoading || !password || !confirmPassword}
          >
            {isLoading ? (
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
