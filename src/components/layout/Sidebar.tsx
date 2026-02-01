"use client";

import React from "react";
import { useBoards } from "@/app/hooks/useBoards";
import { useTheme } from "next-themes";
import Link from "next/link";

const Sidebar = () => {
  const { boards, addBoard, deleteBoard } = useBoards();
  const { setTheme } = useTheme();

  const handleAddBoard = () => {
    addBoard("Baru", "icon");
  };

  const handleDeleteBoard = (boardId: string) => {
    deleteBoard(boardId);
  };

  return (
    <div className="flex justify-between flex-col p-4 gap-4 h-full">
      <div>Flow Board</div>
      <div className="flex-1 overflow-auto p-2">
        <ul>
          <li>
            Board
            <ul>
              {boards.map((item) => {
                return (
                  <li key={item.id}>
                    <Link href={`/board/${item.id}`}>{item.title}</Link>
                    <button onClick={() => handleDeleteBoard(item.id)}>
                      Delete Board
                    </button>
                  </li>
                );
              })}
              <li onClick={handleAddBoard}>Add Board</li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="flex flex-row justify-between">
        <button onClick={() => setTheme("light")}>Light</button>
        <button onClick={() => setTheme("dark")}>Dark</button>
      </div>
    </div>
  );
};

export default Sidebar;
