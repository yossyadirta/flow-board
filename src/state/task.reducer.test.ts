import { describe, it, expect } from 'vitest';
import { taskReducer } from './task.reducer';
import { AppState } from '@/types/state';
import { ADD_TASK, DELETE_TASK, UPDATE_TASK_CONTENT, UPDATE_TASK_DRAG_AND_DROP } from './actions';
import { Task } from '@/types/task';

const initialState: AppState = {
  boards: {},
  tasks: {
    'task-1': { id: 'task-1', boardId: 'board-1', title: 'Task 1', status: 'todo', order: 0, key: 'T-1', createdAt: 0 },
    'task-2': { id: 'task-2', boardId: 'board-1', title: 'Task 2', status: 'todo', order: 1, key: 'T-2', createdAt: 0 },
  },
  isMutating: false,
  isFetching: false,
};

describe('task.reducer.ts', () => {
  it('should ADD_TASK to state', () => {
    const newTask: Task = {
      id: 'task-new',
      boardId: 'board-1',
      title: 'New Task',
      status: 'todo',
      order: 2,
      key: 'T-NEW',
      createdAt: 100,
    };

    const newState = taskReducer(initialState, {
      type: ADD_TASK,
      payload: { task: newTask },
    });

    expect(newState.tasks['task-new']).toBeDefined();
    expect(newState.tasks['task-new'].title).toBe('New Task');
  });

  it('should DELETE_TASK from state', () => {
    const newState = taskReducer(initialState, {
      type: DELETE_TASK,
      payload: { taskId: 'task-1' },
    });

    expect(newState.tasks['task-1']).toBeUndefined();
    // Ensure others are intact
    expect(newState.tasks['task-2']).toBeDefined();
  });

  it('should UPDATE_TASK_CONTENT in state', () => {
    const updatedTask: Task = {
      ...initialState.tasks['task-1'],
      title: 'Updated Task 1',
      status: 'in-progress',
    };

    const newState = taskReducer(initialState, {
      type: UPDATE_TASK_CONTENT,
      payload: { task: updatedTask },
    });

    expect(newState.tasks['task-1'].title).toBe('Updated Task 1');
    expect(newState.tasks['task-1'].status).toBe('in-progress');
  });

  it('should UPDATE_TASK_DRAG_AND_DROP and override all tasks', () => {
    // During DND, the entire tasks record is usually provided to reflect the new order
    const newTasksRecord: Record<string, Task> = {
      'task-2': { id: 'task-2', boardId: 'board-1', title: 'Task 2', status: 'done', order: 0, key: 'T-2', createdAt: 0 },
      'task-1': { id: 'task-1', boardId: 'board-1', title: 'Task 1', status: 'done', order: 1, key: 'T-1', createdAt: 0 },
    };

    const newState = taskReducer(initialState, {
      type: UPDATE_TASK_DRAG_AND_DROP,
      payload: { tasks: newTasksRecord },
    });

    // It completely replaces the tasks state
    expect(newState.tasks).toEqual(newTasksRecord);
    expect(newState.tasks['task-2'].status).toBe('done');
    expect(newState.tasks['task-2'].order).toBe(0);
  });
});
