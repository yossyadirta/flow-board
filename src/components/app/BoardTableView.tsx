/* eslint-disable react-hooks/incompatible-library */
"use no memo";

import React, { useState, useMemo, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnDef,
  flexRender,
  Row,
} from "@tanstack/react-table";
import {
  AlignLeft,
  ArrowUpDown,
  ImageIcon,
  MoreHorizontal,
  Palette,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, formatDueDate } from "@/lib/utils";
import { Task } from "@/types/task";
import { TASK_STATUS } from "@/schemas/task.schemas";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useIsOverflow } from "@/hooks/useIsOverflow";
import { ModalState } from "@/types/state";

type Props = {
  tasks: Task[];
  modalState: ModalState;
  setModalState: (data: ModalState) => void;
  boardId: string;
};

export const BoardTableView = ({ tasks, setModalState }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useMemo(() => Object.values(tasks), [tasks]);

  const columns: ColumnDef<Task>[] = useMemo(
    () => [
      {
        accessorKey: "key",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="-ml-4 cursor-pointer"
            >
              ID
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const key = row.getValue("key") as string;

          return <span>{key}</span>;
        },
      },
      {
        accessorKey: "title",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="-ml-4 cursor-pointer"
            >
              Task
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => <TitleCell row={row} />,
      },
      {
        accessorKey: "status",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="-ml-4 cursor-pointer"
            >
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const rawStatus = row.getValue("status") as string;
          const status =
            TASK_STATUS.find((item) => item.value === rawStatus)?.label || "";

          let badgeClass =
            "bg-slate-700/15 text-slate-700 border-transparent hover:bg-slate-700/25 dark:text-slate-300 rounded-xsm p-1 px-3";

          if (status === "Doing") {
            badgeClass =
              "bg-blue-700/15 text-blue-700 border-transparent hover:bg-blue-700/25 dark:text-blue-400 rounded-xsm p-1 px-3";
          } else if (status === "Done") {
            badgeClass =
              "bg-emerald-700/15 text-emerald-700 border-transparent hover:bg-emerald-700/25 dark:text-emerald-400 rounded-xsm p-1 px-3";
          }

          return (
            <Badge className={`font-medium ${badgeClass}`}>{status}</Badge>
          );
        },
      },
      {
        accessorKey: "assignee",
        header: () => <span className="ml-4">Assignee</span>,
        cell: ({ row }) => {
          const assignee = row.original.assignee;
          if (!assignee) return <span className="text-muted-foreground px-4">-</span>;
          return (
            <div className="flex items-center gap-2 px-4">
              <Avatar className="w-6 h-6 border border-background shadow-sm shrink-0">
                <AvatarFallback 
                  className="text-white text-[10px]"
                  style={{ backgroundColor: assignee.bg_color || "#9CA3AF" }}
                >
                  {assignee.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm truncate">{assignee.name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "dueDate",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="-ml-4 cursor-pointer"
            >
              Due Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const date = row.getValue("dueDate") as string;
          return (
            <span className="text-muted-foreground">
              {date ? formatDueDate(date) : "-"}
            </span>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const task = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalState({ type: "edit-task", data: task });
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Delete Task:", task.id);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [setModalState],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="flex-1 space-y-4 h-full flex flex-col">
      <ScrollArea className="rounded-md border overflow-hidden">
        <Table className="w-full table-fixed">
          <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn("whitespace-nowrap px-4")}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() =>
                    setModalState({ type: "edit-task", data: row.original })
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 overflow-hidden">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-muted-foreground">
            Rows per page
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-17.5">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="text-sm font-medium text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

const TitleCell = ({ row }: { row: Row<Task> }) => {
  const title = row.getValue("title") as string;
  const description = row.original.description;
  const cover = row.original.cover;

  const textRef = useRef<HTMLSpanElement>(null);
  const isOverflow = useIsOverflow(textRef);

  return (
    <div className="flex flex-row gap-1 items-center">
      {(description || cover) && (
        <div className="flex flex-row items-center gap-1.5 text-muted-foreground">
          {cover && (
            <div className="flex items-center">
              {cover.type === "image" ? (
                <div title="This task has a cover image">
                  <ImageIcon className="h-3.5 w-3.5" />
                </div>
              ) : (
                <div title="This task has a cover color">
                  <Palette className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          )}
          {description && (
            <div
              className="flex items-center"
              title="This task has a description"
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <span
            ref={textRef}
            className="min-w-0 truncate font-medium text-sm block"
          >
            {title}
          </span>
        </TooltipTrigger>

        {isOverflow && (
          <TooltipContent side="right">
            <p>{title}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </div>
  );
};

export default BoardTableView;
