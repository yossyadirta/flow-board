import React, { useRef, useState } from "react";
import { Task } from "@/types/task";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OptionDropdown } from "@/components/ui/option-dropdown";
import { ModalState } from "@/types/state";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, TextAlignStart } from "lucide-react";
import { formatDueDate } from "@/lib/utils";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useIsOverflow } from "@/hooks/useIsOverflow";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Props = {
  data: Task;
  modalState: ModalState;
  setModalState: (data: ModalState) => void;
  isOverlay?: boolean;
  activeId?: string | null;
  disableDnD?: boolean;
  customBadge?: React.ReactNode;
  hideAssignee?: boolean;
};

const TaskItem = ({
  data,
  modalState,
  setModalState,
  isOverlay,
  activeId,
  disableDnD,
  customBadge,
  hideAssignee,
}: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: data.id,
    });

  const [loading, setLoading] = useState(true);
  const textRef = useRef<HTMLDivElement>(null);
  const isOverflow = useIsOverflow(textRef);

  const style = !isOverlay && !disableDnD
    ? {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: activeId === data.id ? 0 : 1,
    }
    : undefined;

  const isMenuOpen =
    modalState.type === "option-task" && modalState.taskId === data.id;

  return (
    <Card
      className="group relative cursor-pointer border-0 bg-card text-card-foreground rounded-xl shadow-sm transition-all overflow-hidden py-0 gap-0"
      ref={!isOverlay && !disableDnD ? setNodeRef : undefined}
      style={style}
      {...(!isOverlay && !disableDnD ? attributes : {})}
      {...(!isOverlay && !disableDnD ? listeners : {})}
    >
      <div
        className={`absolute top-3 right-3 z-20 transition-opacity duration-200 ${isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
      >
        <OptionDropdown
          key={data.id}
          open={
            modalState.type === "option-task" && modalState.taskId === data.id
          }
          onOpenChange={() => {
            if (
              modalState.type === "option-task" &&
              modalState.taskId === data.id
            ) {
              setModalState({ type: null });
            } else {
              setModalState({ type: "option-task", taskId: data.id });
            }
          }}
          onDelete={() =>
            setModalState({ type: "delete-task", taskId: data.id })
          }
          onUpdate={() => setModalState({ type: "edit-task", data: data })}
          btnSize="xs"
        />
      </div>

      {data.cover && (
        <div className="w-full relative">
          {data.cover.type === "color" && (
            <div
              className="w-full h-2"
              style={{ backgroundColor: data.cover.value }}
            />
          )}

          {data.cover.type === "image" && (
            <div className="relative w-full h-32">
              <Image
                src={data.cover.value}
                alt="Task Cover"
                fill
                className={`object-cover transition-opacity ${loading ? "opacity-0" : "opacity-100"
                  }`}
                priority
                onLoad={() => setLoading(false)}
              />
            </div>
          )}
        </div>
      )}

      <div className="p-4 pt-3 flex flex-col gap-2.5">
        {customBadge && (
          <div className="flex justify-start">
            {customBadge}
          </div>
        )}

        <CardHeader className="p-0 gap-0">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <CardTitle
                  className="flex-1 min-w-0 truncate font-medium text-sm leading-tight pr-6 text-left"
                  ref={textRef}
                >
                  {data?.title}
                </CardTitle>
              </TooltipTrigger>

              {isOverflow && (
                <TooltipContent side="right">{data?.title}</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </CardHeader>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center">
            {(data?.description || data?.dueDate) && (
              <CardDescription className="text-xs flex items-center gap-2">
                {data?.dueDate && (
                  <span className="flex flex-row gap-1 items-center">
                    <Clock className="h-3 w-3" />
                    {formatDueDate(data?.dueDate)}
                  </span>
                )}
                {data?.description && <TextAlignStart className="h-3 w-3" />}
              </CardDescription>
            )}
          </div>
          
          {!hideAssignee && data.assignee && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="w-5 h-5 border border-background shadow-sm ml-2 shrink-0">
                    <AvatarFallback 
                      className="text-white text-[8px]"
                      style={{ backgroundColor: data.assignee.bg_color || "#9CA3AF" }}
                    >
                      {data.assignee.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="text-xs">Assigned to {data.assignee.name}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskItem;
