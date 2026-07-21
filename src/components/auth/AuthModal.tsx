"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { FieldSeparator } from "@/components/ui/field";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const resetState = () => {
    setStep(1);
    setIsSignUp(true);
    setEmail("");
    setPassword("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetState();
    }
    onOpenChange(newOpen);
  };

  const handleContinueWithEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setStep(2);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/app`,
          },
        });
        if (error) throw error;

        if (data.session) {
          toast.success("Account created! Welcome to Flowboard.", {
            position: "top-center",
          });
          handleOpenChange(false);
          router.push("/app");
        } else {
          toast.success("Account created successfully! Check your email for confirmation.", {
            position: "top-center",
          });
          setIsSignUp(false); // Switch to sign in for convenience
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Logged in successfully!", {
          position: "top-center",
        });
        handleOpenChange(false);
        router.push("/app");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/app`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || "Failed to login with Google");
      setIsGoogleLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsGuestLoading(true);
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      toast.success("Welcome! Entered as Guest.", {
        position: "top-center",
      });
      handleOpenChange(false);
      router.push("/app");
    } catch (err: any) {
      toast.error(err.message || "Guest entry failed");
      setIsGuestLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md border border-slate-200/50 dark:border-border/50 bg-white dark:bg-zinc-950 shadow-xl p-8 rounded-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to Flowboard
          </DialogTitle>
          <div className="text-xs text-center text-muted-foreground mt-4 px-4 leading-relaxed">
            By clicking "Continue with Google" or "Create account", you
            agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and acknowledge the <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </div>
        </DialogHeader>

        <div className="space-y-3">
          <Button
            variant="outline"
            type="button"
            className="w-full flex items-center justify-center gap-2 cursor-pointer h-12 border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-lg text-sm font-medium"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading || isGuestLoading}
          >
            {isGoogleLoading ? (
              <span className="h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <Button
            variant="outline"
            type="button"
            className="w-full flex items-center justify-center gap-2 cursor-pointer h-12 border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-lg text-sm font-medium"
            onClick={handleGuestLogin}
            disabled={isLoading || isGoogleLoading || isGuestLoading}
          >
            {isGuestLoading ? (
              <span className="h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              "Continue as Guest"
            )}
          </Button>
        </div>

        <div className="my-6">
          <FieldSeparator className="text-muted-foreground/60">or</FieldSeparator>
        </div>

        {step === 1 ? (
          <form onSubmit={handleContinueWithEmail} className="space-y-4">
            <div className="relative">
              <label className="absolute left-3 top-2 text-[10px] font-semibold tracking-wider text-muted-foreground z-10">
                EMAIL
              </label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pt-6 pb-2 h-14 bg-slate-100 dark:bg-zinc-900/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-sm"
                disabled={isLoading}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 cursor-pointer bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black rounded-lg text-sm font-medium"
              disabled={isLoading || !email}
            >
              Continue with email
            </Button>
          </form>
        ) : (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <label className="absolute left-3 top-2 text-[10px] font-semibold tracking-wider text-muted-foreground z-10">
                  EMAIL
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pt-6 pb-2 h-14 bg-slate-100 dark:bg-zinc-900/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-sm"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="relative">
                <label className="absolute left-3 top-2 text-[10px] font-semibold tracking-wider text-muted-foreground z-10">
                  PASSWORD
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pt-6 pb-2 h-14 bg-slate-100 dark:bg-zinc-900/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary rounded-lg text-sm"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 mt-2 cursor-pointer bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black rounded-lg text-sm font-medium"
              disabled={isLoading || !password}
            >
              {isLoading ? (
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isSignUp ? (
                "Create account"
              ) : (
                "Log in"
              )}
            </Button>
          </form>
        )}

        {step === 2 && (
          <div className="mt-6 flex justify-center text-sm">
            <span className="text-muted-foreground mr-1.5">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-semibold cursor-pointer"
              disabled={isLoading}
            >
              {isSignUp ? "Log in" : "Create account"}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
