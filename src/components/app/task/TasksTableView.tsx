"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  AlignLeft,
  ArrowUpDown,
  ImageIcon,
  CheckCircle2,
  Circle,
  Timer,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, formatDueDate } from "@/lib/utils";
import { Task } from "@/types/task";
import { Board } from "@/types/board";
import { BOARD_ICONS_MAP } from "@/components/app/board/BoardIcons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Props = {
  tasks: Task[];
  boards: Board[];
  onTaskClick: (task: Task) => void;
};

const STATUS_CONFIG = {
  "todo": { label: "To Do", icon: Circle, color: "text-muted-foreground", bg: "bg-muted" },
  "in-progress": { label: "In Progress", icon: Timer, color: "text-blue-500", bg: "bg-blue-500/10" },
  "done": { label: "Done", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
};

export const TasksTableView = ({ tasks, boards, onTaskClick }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const getBoardDetails = (boardId: string) => {
    const board = boards.find((b) => b.id === boardId);
    if (!board) return { name: "Unknown Board", icon: "briefcase" };
    return { name: board.name, icon: board.icon };
  };

  const columns: ColumnDef<Task>[] = useMemo(
    () => [
      {
        accessorKey: "key",
        header: ({ column }) => {
          return (
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="flex items-center gap-2 hover:text-foreground/80 transition-colors cursor-pointer font-medium"
            >
              ID
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>
          );
        },
        cell: ({ row }) => {
          return <span className="font-medium text-muted-foreground">{row.getValue("key")}</span>;
        },
      },
      {
        id: "board",
        accessorFn: (row) => getBoardDetails(row.boardId).name,
        header: ({ column }) => {
          return (
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="flex items-center gap-2 hover:text-foreground/80 transition-colors cursor-pointer font-medium"
            >
              Board
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>
          );
        },
        cell: ({ row }) => {
          const boardConfig = getBoardDetails(row.original.boardId);
          const boardEmoji = BOARD_ICONS_MAP[boardConfig.icon as keyof typeof BOARD_ICONS_MAP]?.emoji || "💼";
          return (
            <div className="flex items-center gap-1.5 py-0.5 rounded-md bg-secondary/50 text-secondary-foreground font-medium w-max text-xs">
              <span>{boardEmoji}</span>
              <span className="truncate max-w-[120px]">{boardConfig.name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "title",
        header: ({ column }) => {
          return (
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="flex items-center gap-2 hover:text-foreground/80 transition-colors cursor-pointer font-medium"
            >
              Task
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>
          );
        },
        cell: ({ row }) => {
          const task = row.original;
          return (
            <div className="flex flex-col gap-1 max-w-[400px]">
              <span className={cn("font-medium truncate", task.status === "done" && "line-through text-muted-foreground")}>
                {task.title}
              </span>
              <div className="flex items-center gap-2 text-muted-foreground">
                {task.description && <AlignLeft className="w-3 h-3" />}
                {task.cover?.type !== "none" && <ImageIcon className="w-3 h-3" />}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => {
          return (
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="flex items-center gap-2 hover:text-foreground/80 transition-colors cursor-pointer font-medium"
            >
              Status
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>
          );
        },
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG["todo"];
          const StatusIcon = config.icon;

          return (
            <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full w-max text-xs font-medium border", config.bg)}>
              <StatusIcon className={cn("w-3.5 h-3.5", config.color)} />
              <span>{config.label}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "dueDate",
        header: ({ column }) => {
          return (
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="flex items-center gap-2 hover:text-foreground/80 transition-colors cursor-pointer font-medium"
            >
              Due Date
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>
          );
        },
        cell: ({ row }) => {
          const dueDate = row.getValue("dueDate") as string;
          if (!dueDate) return <span className="text-muted-foreground">-</span>;

          const isOverdue = new Date(dueDate) < new Date() && row.original.status !== "done";
          return (
            <span className={cn(isOverdue && "text-destructive font-medium")}>
              {formatDueDate(new Date(dueDate))}
            </span>
          );
        },
      },
    ],
    [boards]
  );

  const table = useReactTable({
    data: tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1 rounded-md border m-6 mt-4">
        <Table>
          <TableHeader className="bg-secondary/50 sticky top-0 z-10 backdrop-blur-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onTaskClick(row.original)}
                  className="cursor-pointer hover:bg-accent/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
