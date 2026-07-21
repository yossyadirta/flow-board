"use client";

import React, { useEffect, useEffectEvent, useState } from "react";
import { useBoards } from "@/hooks/useBoards";
import { useTheme } from "next-themes";
import Image from "next/image";
import { AddBoardModal } from "@/components/app/board/AddBoardModal";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroupLabel, SidebarTrigger } from "@/components/ui/sidebar";
import { GuestBanner } from "@/components/app/GuestBanner";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Clipboard, SearchIcon, SunMoon, LogOut } from "lucide-react";
import { ProfileDropdown } from "@/components/app/ProfileDropdown";
import BoardMenuItem from "@/components/app/BoardMenuItem";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <>
      <SidebarProvider
        style={{ "--sidebar-width": "360px" } as React.CSSProperties}
      >
        <Sidebar className="h-screen p-4 bg-background">
          <div className="flex h-full bg-secondary rounded-2xl">
            {/* RAIL MENU */}
            <div className="flex flex-col justify-between py-2 mr-0">
              <div className="w-16 flex flex-col items-center gap-4">
                <Link href="/app">
                  <button className="p-2 rounded-lg hover:bg-accent flex flex-col align-middle justify-center text-[0.75rem] gap-1.5 font-medium items-center cursor-pointer">
                    <Image
                      src="/logo.svg"
                      alt="Flowboard"
                      width={32}
                      height={32}
                    />
                  </button>
                </Link>
                <Link href="/app">
                  <button className="p-2 rounded-lg hover:bg-accent flex flex-col align-middle justify-center text-[0.75rem] gap-1.5 font-medium items-center bg-background cursor-pointer">
                    <Clipboard
                      className="flex justify-center items-center text-center text-[0.5rem]"
                      size={21}
                    />
                    Boards
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
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-lg hover:bg-accent cursor-pointer"
                  title="Toggle Theme"
                >
                  <SunMoon />
                </button>
                <div className="mb-2">
                  <ProfileDropdown userEmail={userEmail} />
                </div>
              </div>
            </div>

            {/* SUB MENU */}
            <div className="flex-1 flex flex-col bg-background m-2 rounded-2xl ml-0 overflow-hidden">
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
  );
}
