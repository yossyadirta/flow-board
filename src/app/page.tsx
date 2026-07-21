"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { DemoSection } from "@/components/landing/DemoSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TechSection } from "@/components/landing/TechSection";
import { CTAFooter } from "@/components/landing/CTAFooter";
import { AuthModal } from "@/components/auth/AuthModal";

const LandingPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const router = useRouter();

  const handleLaunchApp = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.push("/app");
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <main className="relative w-full overflow-x-hidden bg-background text-foreground">
        <Navbar onLaunchApp={handleLaunchApp} />
        <HeroSection onLaunchApp={handleLaunchApp} />
        <DemoSection />
        <FeaturesSection />
        <TechSection />
        <CTAFooter />
      </main>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default LandingPage;
