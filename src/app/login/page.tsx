"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldSeparator,
} from "@/components/ui/field";
import { Chrome, User, Mail, Lock, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/app");
      }
    };
    checkUser();
  }, [router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (isSignUp && !fullName) {
      toast.error("Please enter your full name");
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/app`,
          },
        });
        if (error) throw error;

        if (data.session) {
          toast.success("Account created! Welcome to Flowboard.", {
            position: "top-center",
          });
          router.push("/app");
        } else {
          toast.success("Account created successfully! Check your email for confirmation.", {
            position: "top-center",
          });
          setIsSignUp(false); // Switch to sign in
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
          redirectTo: `${window.location.origin}/app`,
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
      router.push("/app");
    } catch (err: any) {
      toast.error(err.message || "Guest entry failed");
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden px-4">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-50 dark:opacity-30 mix-blend-multiply animate-blob" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-300 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-50 dark:opacity-30 mix-blend-multiply animate-blob animation-delay-2000" />
      
      <Link href="/" className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors z-20 font-medium">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/logo.svg"
            alt="Flowboard Logo"
            width={64}
            height={64}
            className="mb-3"
          />
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Flowboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Organize workflows seamlessly. Fast & beautiful.
          </p>
        </div>

        <Card className="border border-slate-200/50 dark:border-border/50 bg-white/70 dark:bg-secondary backdrop-blur-xl shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold">
              {isSignUp ? "Create an account" : "Welcome back"}
            </CardTitle>
            <CardDescription>
              {isSignUp
                ? "Enter your details to get started with your new workspace"
                : "Enter your credentials to access your boards"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {isSignUp && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Field>
                      <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                      <div className="relative">
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10"
                          disabled={isLoading}
                        />
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>

              <Field>
                <FieldLabel htmlFor="email">Email address</FieldLabel>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </Field>

              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2 mt-2 cursor-pointer shadow-md hover:shadow-lg transition-all"
                disabled={isLoading || isGoogleLoading || isGuestLoading}
              >
                {isLoading ? (
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isSignUp ? "Create Account" : "Sign In"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="my-4">
              <FieldSeparator>or</FieldSeparator>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                type="button"
                className="w-full flex items-center justify-center gap-2 cursor-pointer"
                onClick={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading || isGuestLoading}
              >
                {isGoogleLoading ? (
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Chrome className="h-4 w-4" />
                    Google
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                type="button"
                className="w-full flex items-center justify-center gap-2 cursor-pointer"
                onClick={handleGuestLogin}
                disabled={isLoading || isGoogleLoading || isGuestLoading}
              >
                {isGuestLoading ? (
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <User className="h-4 w-4" />
                    Guest Mode
                  </>
                )}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex justify-center text-xs md:text-sm">
            <span className="text-muted-foreground mr-1.5">
              {isSignUp ? "Already have an account?" : "New to Flowboard?"}
            </span>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-semibold cursor-pointer"
              disabled={isLoading || isGoogleLoading || isGuestLoading}
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
