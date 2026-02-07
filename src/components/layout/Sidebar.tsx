"use client";

import React, { useState } from "react";
import { useBoards } from "@/hooks/useBoards";
import { useTheme } from "next-themes";
import Link from "next/link";
import { AddBoardModal } from "../board/AddBoardModal";

const Sidebar = () => {
  const { boards } = useBoards();
  const { setTheme } = useTheme();

  const [isOpenAddBoardModal, setIsOpenAddBoardModal] = useState(false);

  return (
    <>
      <div className="flex justify-between flex-col p-4 gap-4 h-full">
        <div>Flow Board</div>
        <div className="flex-1 overflow-auto p-2">
          <ul>
            {boards.map((item) => {
              return (
                <li key={`${item.id}_${item.createdAt}`}>
                  <Link href={`/board/${item.id}`}>{item.name}</Link>
                </li>
              );
            })}
            <li onClick={() => setIsOpenAddBoardModal(true)}>Add Board</li>
          </ul>
        </div>
        <div className="flex flex-row justify-between">
          <button onClick={() => setTheme("light")}>Light</button>
          <button onClick={() => setTheme("dark")}>Dark</button>
        </div>
      </div>
      <AddBoardModal
        open={isOpenAddBoardModal}
        onClose={() => setIsOpenAddBoardModal(false)}
      />
    </>
  );
};

export default Sidebar;
