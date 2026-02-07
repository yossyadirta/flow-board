"use client";

import { Board } from "@/types/board";
import { useAppState } from "./useAppState";
import { ADD_BOARD, DELETE_BOARD, UPDATE_BOARD } from "@/state/actions";
import { BoardIconId } from "@/components/board/BoardIcons";

export const useBoards = () => {
  const { state, dispatch } = useAppState();

  const boards = Object.values(state.boards);

  const addBoard = (id: string, name: string, icon: BoardIconId) => {
    const board: Board = {
      id,
      name,
      icon,
      createdAt: Date.now(),
    };

    dispatch({
      type: ADD_BOARD,
      payload: {
        board,
      },
    });
  };

  const deleteBoard = (boardId: string) => {
    dispatch({
      type: DELETE_BOARD,
      payload: {
        boardId,
      },
    });
  };

  const updateBoard = (board: Board) => {
    dispatch({
      type: UPDATE_BOARD,
      payload: {
        board,
      },
    });
  };

  return {
    boards,
    addBoard,
    deleteBoard,
    updateBoard,
  };
};
