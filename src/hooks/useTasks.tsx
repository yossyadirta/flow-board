"use client";

import { Task, TaskCover, TaskStatus } from "@/types/task";
import { Board } from "@/types/board";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useTasks = () => {
  const queryClient = useQueryClient();

  // Query to fetch all tasks accessible to the user
  const { data: mappedTasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("order", { ascending: true });

      if (error) throw error;

      return (data || []).map((task: any) => ({
        id: task.id,
        key: task.key,
        title: task.title,
        status: task.status as TaskStatus,
        boardId: task.board_id,
        order: task.order,
        createdAt: new Date(task.created_at).getTime(),
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        cover: task.cover ? (task.cover as TaskCover) : { type: "none" },
        description: task.description || undefined,
      }));
    },
  });

  // Create a record mapped by ID for backward compatibility
  const tasks = mappedTasks.reduce((acc, task) => {
    acc[task.id] = task;
    return acc;
  }, {} as Record<string, Task>);

  // Add Task Mutation
  const addTaskMutation = useMutation({
    mutationFn: async ({
      boardId,
      title,
      status,
      dueDate,
      description,
      cover,
      key,
      order,
    }: {
      boardId: string;
      title: string;
      status: TaskStatus;
      dueDate?: Date;
      description?: string;
      cover?: TaskCover;
      key: string;
      order: number;
    }) => {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          board_id: boardId,
          title,
          status,
          due_date: dueDate ? dueDate.toISOString() : null,
          description: description || null,
          cover: cover || { type: "none" },
          key,
          order,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      const optimisticTask: Task = {
        id: `temp-${Date.now()}`,
        boardId: newTask.boardId,
        title: newTask.title,
        status: newTask.status,
        dueDate: newTask.dueDate,
        description: newTask.description,
        cover: newTask.cover || { type: "none" },
        key: newTask.key,
        order: newTask.order,
        createdAt: Date.now(),
      };

      queryClient.setQueryData<Task[]>(["tasks"], (old) => {
        return old ? [...old, optimisticTask] : [optimisticTask];
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["boards"] }); // Because of task count trigger updates
    },
  });

  // Update Task Content Mutation (optimistic update)
  const updateTaskContentMutation = useMutation({
    mutationFn: async (task: Task) => {
      const { error } = await supabase
        .from("tasks")
        .update({
          title: task.title,
          status: task.status,
          due_date: task.dueDate ? task.dueDate.toISOString() : null,
          description: task.description || null,
          cover: task.cover || { type: "none" },
          order: task.order,
        })
        .eq("id", task.id);

      if (error) throw error;
    },
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (old) =>
        old ? old.map((t) => (t.id === updatedTask.id ? updatedTask : t)) : []
      );

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Update Task Drag and Drop Mutation (optimistic update for bulk tasks reordering)
  const updateTaskDragAndDropMutation = useMutation({
    mutationFn: async (updatedTasksRecord: Record<string, Task>) => {
      const payload = Object.values(updatedTasksRecord).map((task) => ({
        id: task.id,
        board_id: task.boardId,
        title: task.title,
        status: task.status,
        due_date: task.dueDate ? task.dueDate.toISOString() : null,
        description: task.description || null,
        cover: task.cover || { type: "none" },
        order: task.order,
        key: task.key,
      }));

      const { error } = await supabase.from("tasks").upsert(payload);
      if (error) throw error;
    },
    onMutate: async (updatedTasksRecord) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks"]);

      queryClient.setQueryData<Task[]>(["tasks"], (old) => {
        if (!old) return [];
        return old.map((t) => {
          const updated = updatedTasksRecord[t.id];
          return updated ? updated : t;
        });
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Delete Task Mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["boards"] }); // Because of task count trigger updates
    },
  });

  const addTask = async ({
    boardId,
    title,
    status,
    dueDate,
    description,
    cover,
  }: {
    boardId: string;
    title: string;
    status: TaskStatus;
    dueDate?: Date;
    description?: string;
    cover?: TaskCover;
  }) => {
    // Get board details to construct key
    const boards = queryClient.getQueryData<Board[]>(["boards"]) || [];
    let board = boards.find((b) => b.id === boardId);
    
    if (!board) {
      const { data } = await supabase.from("boards").select("*").eq("id", boardId).single();
      if (data) {
        board = {
          id: data.id,
          key: data.key,
          icon: data.icon as any,
          name: data.name,
          createdAt: new Date(data.created_at).getTime(),
          isFavorite: data.is_favorite,
          taskCounter: data.task_counter,
        };
      }
    }
    
    if (!board) return;

    const sameColumnTasks = mappedTasks.filter(
      (task) => task.boardId === boardId && task.status === status
    );
    const maxOrder =
      sameColumnTasks.length > 0
        ? Math.max(...sameColumnTasks.map((t) => t.order))
        : -1;
    const newOrder = maxOrder + 1;
    const newCounter = board.taskCounter + 1;
    const key = `${board.key}-${newCounter}`;

    await addTaskMutation.mutateAsync({
      boardId,
      title,
      status,
      dueDate,
      description,
      cover,
      key,
      order: newOrder,
    });
  };

  const updateTaskContent = async (task: Task) => {
    await updateTaskContentMutation.mutateAsync(task);
  };

  const updateTaskDragAndDrop = async (updatedTasks: Record<string, Task>) => {
    await updateTaskDragAndDropMutation.mutateAsync(updatedTasks);
  };

  const deleteTask = async (taskId: string) => {
    await deleteTaskMutation.mutateAsync(taskId);
  };

  return {
    tasks,
    mappedTasks,
    addTask,
    updateTaskContent,
    updateTaskDragAndDrop,
    deleteTask,
    isLoading,
  };
};
