"use client";

import React, { useEffect, useEffectEvent, useState } from "react";
import { useBoards } from "@/hooks/useBoards";
import { generateProfileColor } from "@/lib/avatar";
import { useTheme } from "next-themes";
import Image from "next/image";
import { AddBoardModal } from "@/components/app/board/AddBoardModal";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroupLabel, SidebarTrigger } from "@/components/ui/sidebar";
import { GuestBanner } from "@/components/app/GuestBanner";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Clipboard,
  ListTodo,
  SunMoon,
  SearchIcon,
  LayoutDashboard
} from "lucide-react";
import { ProfileDropdown } from "@/components/app/ProfileDropdown";
import { NotificationBell } from "@/components/app/NotificationBell";
import BoardMenuItem from "@/components/app/BoardMenuItem";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OnboardingProvider } from "@/providers/OnboardingProvider";
import { cn } from "@/lib/utils";
import { TasksSubMenu } from "@/components/app/task/TasksSubMenu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { boards } = useBoards();
  const { theme, setTheme } = useTheme();

  const [isMounted, setIsMounted] = useState(false);
  const [isOpenAddBoardModal, setIsOpenAddBoardModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ name: string, bg_color: string } | null>(null);
  const [search, setSearch] = useState("");

  const keyword = search.toLowerCase().trim();
  const filteredBoards = boards
    .filter((board) => {
      if (!keyword) return true;
      return board.name?.toLowerCase().includes(keyword);
    })
    .sort((a, b) => {
      if (!keyword) return 0;

      const aStarts = a.name.toLowerCase().startsWith(keyword);
      const bStarts = b.name.toLowerCase().startsWith(keyword);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });

  const favoriteBoards = filteredBoards.filter((b) => b.isFavorite);

  const isTasksPage = pathname.startsWith("/app/tasks");

  const handleUpdateMounted = useEffectEvent(() => {
    setIsMounted(true);
  });

  useEffect(() => {
    handleUpdateMounted();

    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        await supabase.auth.signOut();
        router.push("/");
      } else {
        setUserEmail(data.user.email ?? null);
        const { data: profile } = await supabase
          .from("profiles")
          .select("name, bg_color")
          .eq("id", data.user.id)
          .single();

        let finalBgColor = profile?.bg_color;

        // Auto-fix for existing users who haven't re-logged in
        if (profile && !profile.bg_color && data.user.email) {
          finalBgColor = generateProfileColor(data.user.email);
          await supabase.from("profiles").update({ bg_color: finalBgColor }).eq("id", data.user.id);
        }

        if (profile) {
          setUserProfile({ name: profile.name, bg_color: finalBgColor });
        }
      }
    };
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUserEmail(session.user.email ?? null);
        }
      }
    );

    const handleProfileUpdate = () => checkAuth();
    window.addEventListener("profile-updated", handleProfileUpdate);

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener("profile-updated", handleProfileUpdate);
    };
  }, [router]);

  if (!isMounted) return null;

  return (
    <OnboardingProvider>
      <>
        <SidebarProvider
          style={{
            "--sidebar-width": "316px",
            "--sidebar-width-icon": "96px"
          } as React.CSSProperties}
        >
          <Sidebar collapsible="icon" className="h-screen p-4 pr-0 bg-background group-data-[state=collapsed]:p-4">
            <div className="flex h-full bg-secondary rounded-2xl overflow-hidden relative">

              {/* RAIL MENU */}
              <div className="flex flex-col justify-between py-2 mr-0">
                <div className="w-16 flex flex-col items-center gap-4">
                  <SidebarTrigger className="w-10 h-10 mt-1 rounded-md bg-transparent text-muted-foreground flex items-center justify-center hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer shrink-0" />
                  <Link href="/app">
                    <button className={cn(
                      "p-2 w-14 rounded-lg flex flex-col align-middle justify-center text-[0.65rem] gap-1 font-medium items-center cursor-pointer transition-colors",
                      pathname === "/app"
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}>
                      <LayoutDashboard
                        className="flex justify-center items-center text-center"
                        size={18}
                        strokeWidth={2}
                      />
                      Dashboard
                    </button>
                  </Link>
                  <Link href="/app/board">
                    <button className={cn(
                      "p-2 w-14 rounded-lg flex flex-col align-middle justify-center text-[0.65rem] gap-1 font-medium items-center cursor-pointer transition-colors",
                      pathname.startsWith("/app/board")
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}>
                      <Clipboard
                        className="flex justify-center items-center text-center"
                        size={18}
                        strokeWidth={2}
                      />
                      Boards
                    </button>
                  </Link>
                  <Link href="/app/tasks">
                    <button className={cn(
                      "p-2 w-14 rounded-lg flex flex-col align-middle justify-center text-[0.65rem] gap-1 font-medium items-center cursor-pointer transition-colors",
                      pathname.startsWith("/app/tasks")
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}>
                      <ListTodo
                        className="flex justify-center items-center text-center"
                        size={18}
                        strokeWidth={2}
                      />
                      Tasks
                    </button>
                  </Link>
                  {/* <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-lg hover:bg-accent flex flex-col align-middle justify-center text-[0.75rem] gap-1.5 font-medium items-center cursor-pointer"
                >
                  <SunMoon />
                </button> */}
                </div>
                <div className="w-16 flex flex-col items-center gap-4">
                  <div className="flex flex-col gap-2">
                    <NotificationBell />
                    <button
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="w-10 h-10 rounded-md bg-transparent text-muted-foreground flex items-center justify-center hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer shrink-0"
                      title="Toggle Theme"
                    >
                      <SunMoon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mb-2">
                    <ProfileDropdown userEmail={userEmail} userProfile={userProfile} />
                  </div>
                </div>
              </div>

              {/* SUB MENU (Hidden when collapsed) */}
              <div className="flex-1 flex flex-col bg-background m-2 rounded-2xl ml-0 overflow-hidden group-data-[collapsible=icon]:hidden">
                {isTasksPage ? (
                  <TasksSubMenu />
                ) : (
                  <>
                    {/* SEARCH BOX */}
                    <div className="p-3 shrink-0">
                      <InputGroup className="border-0">
                        <InputGroupInput
                          placeholder="Search boards..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />

                        <InputGroupAddon>
                          <SearchIcon className="text-muted-foreground" />
                        </InputGroupAddon>
                      </InputGroup>
                    </div>

                    <SidebarGroup>
                      <SidebarMenu>
                        <SidebarMenuButton
                          onClick={() => setIsOpenAddBoardModal(true)}
                          className="cursor-pointer"
                        >
                          <span className="text-muted-foreground font-medium">
                            + Add Board
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenu>
                    </SidebarGroup>

                    {/* BOARD LIST */}
                    <ScrollArea className="flex-1 min-h-0 [&>div>div]:block!">
                      <SidebarContent>
                        {favoriteBoards?.length > 0 && (
                          <SidebarGroup>
                            <SidebarGroupLabel>Favorites</SidebarGroupLabel>
                            <SidebarMenu>
                              {favoriteBoards.map((board) => (
                                <BoardMenuItem
                                  item={board}
                                  pathname={pathname}
                                  key={board.id}
                                  isFavoriteSection
                                />
                              ))}
                            </SidebarMenu>
                          </SidebarGroup>
                        )}
                        <SidebarGroup>
                          <SidebarGroupLabel>All Boards</SidebarGroupLabel>
                          <SidebarMenu>
                            {filteredBoards.length > 0 ? (
                              filteredBoards.map((board) => (
                                <BoardMenuItem
                                  key={board.id}
                                  item={board}
                                  pathname={pathname}
                                />
                              ))
                            ) : (
                              <SidebarMenuItem>
                                <SidebarMenuButton className="cursor-default hover:bg-transparent">
                                  <span className="flex-1 min-w-0 truncate text-muted-foreground">
                                    No boards yet
                                  </span>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            )}
                          </SidebarMenu>
                        </SidebarGroup>
                      </SidebarContent>
                    </ScrollArea>
                  </>
                )}
              </div>
            </div>
          </Sidebar>
          <SidebarInset className="h-screen overflow-hidden flex flex-col flex-1">
            <GuestBanner />
            <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 md:hidden">
              <Link href="/app" className="flex items-center gap-2">
                <Image src="/logo.svg" alt="Flowboard" width={28} height={28} />
                <span className="font-bold text-lg">Flowboard</span>
              </Link>
              <SidebarTrigger />
            </header>
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>

        <AddBoardModal
          open={isOpenAddBoardModal}
          onClose={() => setIsOpenAddBoardModal(false)}
        />
      </>
    </OnboardingProvider>
  );
}
