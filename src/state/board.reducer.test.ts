import { describe, it, expect } from 'vitest';
import { boardReducer } from './board.reducer';
import { AppState } from '@/types/state';
import { ADD_BOARD, DELETE_BOARD, TOGGLE_FAVORITE_BOARD, UPDATE_BOARD } from './actions';
import { Board } from '@/types/board';
import { Task } from '@/types/task';

// Setup Initial Mock State
const initialState: AppState = {
  boards: {
    'board-1': { id: 'board-1', name: 'Old Board', key: 'OLD', icon: 'gear', createdAt: 0, isFavorite: false, taskCounter: 1 },
  },
  tasks: {
    'task-1': { id: 'task-1', boardId: 'board-1', title: 'Task 1', status: 'todo', order: 0, key: 'T-1', createdAt: 0 },
    'task-2': { id: 'task-2', boardId: 'board-2', title: 'Task 2', status: 'done', order: 0, key: 'T-2', createdAt: 0 }, // Belongs to a different board
  },
  isMutating: false,
  isFetching: false,
};

describe('board.reducer.ts', () => {
  it('should ADD_BOARD to state', () => {
    const newBoard: Board = {
      id: 'board-new',
      name: 'New Board',
      key: 'NEW',
      icon: 'rocket',
      createdAt: 100,
      isFavorite: true,
      taskCounter: 0,
    };

    const newState = boardReducer(initialState, {
      type: ADD_BOARD,
      payload: { board: newBoard },
    });

    // Verify board was added
    expect(newState.boards['board-new']).toBeDefined();
    expect(newState.boards['board-new'].name).toBe('New Board');

    // Verify existing boards remain intact
    expect(newState.boards['board-1']).toBeDefined();
  });

  it('should UPDATE_BOARD in state', () => {
    const updatedBoard: Board = {
      ...initialState.boards['board-1'],
      name: 'Updated Board Name',
    };

    const newState = boardReducer(initialState, {
      type: UPDATE_BOARD,
      payload: { board: updatedBoard },
    });

    expect(newState.boards['board-1'].name).toBe('Updated Board Name');
  });

  it('should TOGGLE_FAVORITE_BOARD in state', () => {
    const newState = boardReducer(initialState, {
      type: TOGGLE_FAVORITE_BOARD,
      payload: { boardId: 'board-1' },
    });

    // Was false, should be true
    expect(newState.boards['board-1'].isFavorite).toBe(true);

    const toggleAgainState = boardReducer(newState, {
      type: TOGGLE_FAVORITE_BOARD,
      payload: { boardId: 'board-1' },
    });

    // Was true, should be false again
    expect(toggleAgainState.boards['board-1'].isFavorite).toBe(false);
  });

  it('should do nothing if toggling favorite on non-existent board', () => {
    const newState = boardReducer(initialState, {
      type: TOGGLE_FAVORITE_BOARD,
      payload: { boardId: 'does-not-exist' },
    });

    // State reference should be exactly the same
    expect(newState).toBe(initialState);
  });

  it('should DELETE_BOARD and cascade delete its associated tasks', () => {
    const newState = boardReducer(initialState, {
      type: DELETE_BOARD,
      payload: { boardId: 'board-1' },
    });

    // Board should be gone
    expect(newState.boards['board-1']).toBeUndefined();

    // Associated tasks should be gone
    expect(newState.tasks['task-1']).toBeUndefined();

    // Unrelated tasks should remain
    expect(newState.tasks['task-2']).toBeDefined();
  });
});
