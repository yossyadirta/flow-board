import { ModalState } from "@/types/state";
import { Task, TaskStatus } from "@/types/task";
import { Card } from "@/components/ui/card";
import TaskItem from "./TaskItem";
import { PlusIcon } from "lucide-react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import { useEffect, useRef, useState } from "react";
import { useOnboardingContext } from "@/context/OnboardingContext";

type Props = {
  status: {
    label: string;
    value: TaskStatus;
  };
  modalState: ModalState;
  tasks: Task[];
  setModalState: (data: ModalState) => void;
  boardId: string;
  activeId?: string | null;
  derived: {
    totalDoneTask: number;
    totalInprogressTask: number;
    totalTask: number;
    totalTodoTask: number;
  };
};

const TaskColumn = ({
  status,
  tasks,
  modalState,
  setModalState,
  boardId,
  activeId,
  derived,
}: Props) => {
  const { setNodeRef } = useDroppable({
    id: status.value,
  });

  const { addTask } = useTasks();
  const { signalEvent, isOnboarding } = useOnboardingContext();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isAdding) inputRef.current?.focus();
  }, [isAdding]);

  const handleCreateTask = () => {
    if (title.trim()) {
      addTask({ boardId, title: title.trim(), status: status.value });
      setTitle("");
      signalEvent("task-created");
    }
    setIsAdding(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateTask();
    }
    if (e.key === "Escape") {
      setIsAdding(false);
      setTitle("");
    }
  };

  const columnTasks = tasks
    .filter((item) => item.status === status.value && boardId === item.boardId)
    .sort((a, b) => a.order - b.order);

  const count =
    status.value === "todo"
      ? derived.totalTodoTask
      : status.value === "in-progress"
        ? derived.totalInprogressTask
        : status.value === "done"
          ? derived.totalDoneTask
          : 0;

  return (
    <Card
      ref={setNodeRef}
      id={status.value}
      data-onboarding={`col-${status.value}`}
      className="p-3 flex flex-col h-auto max-h-full overflow-hidden gap-3 bg-secondary border-0"
    >
      <div className="shrink-0 flex items-center justify-between py-1">
        <span className="text-md font-medium pt-1">{status.label}</span>
        <span className="ml-2 px-2 py-0.5 rounded-full text-sm text-muted-foreground">
          {count}
        </span>
      </div>

      <ScrollArea className="min-h-0 -mr-3 pr-3 overflow-hidden grid">
        <div className="flex flex-col gap-2 pb-2">
          <SortableContext
            items={columnTasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {columnTasks.map((item) => (
              <TaskItem
                data={item}
                modalState={modalState}
                setModalState={setModalState}
                key={item.id}
                activeId={activeId}
              />
            ))}
          </SortableContext>
          {isAdding && (
            <Card
              data-onboarding="task-input"
              className="p-4 border-0 bg-card shadow-md rounded-xl animate-in fade-in zoom-in duration-200"
            >
              <textarea
                ref={inputRef}
                placeholder="What needs to be done?"
                className="
                  w-full 
                  bg-transparent 
                  border-none 
                  resize-none 
                  text-sm 
                  p-0 
                  overflow-hidden 
                  min-h-10 
                  placeholder:text-muted-foreground/50
                  focus:outline-none 
                  focus:ring-0 
                  focus-visible:ring-0 
                  focus-visible:outline-none
                "
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={onKeyDown}
                onBlur={() => {
                  if (title.trim()) {
                    handleCreateTask();
                  } else {
                    setIsAdding(false);
                    setTitle("");
                  }
                }}
              />
            </Card>
          )}
        </div>
      </ScrollArea>

      <Button
        data-onboarding={`add-task-btn-${status.value}`}
        onClick={() => {
          setIsAdding(true);
          signalEvent("add-task-clicked");
        }}
        variant="outline"
        className="shrink-0 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-0 bg-transparent! hover:bg-transparent focus:ring-0 data-[state=open]:bg-transparent p-0! justify-start shadow-none h-auto"
      >
        <PlusIcon size={16} />
        Add New Task
      </Button>
    </Card>
  );
};

export default TaskColumn;
