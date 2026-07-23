"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/AuthModal";
import { Info } from "lucide-react";
import { useOnboardingContext } from "@/context/OnboardingContext";

export function GuestBanner() {
  const [isGuest, setIsGuest] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const router = useRouter();
  const { isOnboarding } = useOnboardingContext();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsGuest(user?.is_anonymous ?? false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignUp = async () => {
    setAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.clear(); // Clear any local caches to ensure a fresh state
    router.push("/");
  };

  if (!isGuest || isOnboarding) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-full sm:max-w-sm bg-background border border-primary/20 p-4 rounded-xl shadow-2xl z-50 flex flex-col gap-3 animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0">
          <Info size={18} />
        </div>
        <div>
          <h4 className="font-semibold text-sm">Guest Mode</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Your data is temporary and will be lost if you clear your browser data.
          </p>
        </div>
      </div>
      <div className="flex gap-2 justify-end mt-1">
        <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-xs h-8">
          Leave
        </Button>
        <Button size="sm" onClick={handleSignUp} className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground">
          Save Progress
        </Button>
      </div>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
