"use client";

import React from "react";
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/components/layout/Sidebar"), {
  ssr: false,
});

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-64">
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-hidden bg-secondary flex flex-col p-4  rounded-md m-5 gap-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
