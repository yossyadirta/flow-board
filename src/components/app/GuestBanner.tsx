"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export function GuestBanner() {
  const [isGuest, setIsGuest] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.is_anonymous) {
        setIsGuest(true);
      }
    };
    checkUser();
  }, []);

  const handleSignUp = async () => {
    router.push("/login?link_identity=true");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!isGuest) return null;

  return (
    <div className="fixed bottom-6 right-6 max-w-sm w-full bg-background border border-primary/20 p-4 rounded-xl shadow-2xl z-50 flex flex-col gap-3 animate-in slide-in-from-bottom-5">
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
    </div>
  );
}
