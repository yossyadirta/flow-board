"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  TASK_STATUS,
  TaskFormValues,
  taskSchema,
} from "@/schemas/task.schemas";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { formatDueDate } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Image from "next/image";
import { useBoardMembers } from "@/hooks/useBoardMembers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const COLORS = [
  "#ff6565",
  "#f87171",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#34d399",
  "#60a5fa",
  "#818cf8",
  "#a78bfa",
  "#de8bfa",
];

const IMAGES = [
  "/task-cover-1.webp",
  "/task-cover-2.webp",
  "/task-cover-3.webp",
  "/task-cover-4.webp",
  "/task-cover-5.webp",
  "/task-cover-6.webp",
];

type Props = {
  onSubmit: (values: TaskFormValues) => void;
  defaultValues?: Partial<TaskFormValues>;
  onValidityChange?: (isValid: boolean) => void;
  boardId: string;
};

export function TaskForm({ onSubmit, defaultValues, onValidityChange, boardId }: Props) {
  const {
    handleSubmit,
    register,
    control,
    formState: { isValid, isDirty },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    mode: "onChange",
    defaultValues: {
      title: defaultValues?.title ?? "",
      status: defaultValues?.status ?? undefined,
      dueDate: defaultValues?.dueDate
        ? new Date(defaultValues.dueDate)
        : undefined,
      description: defaultValues?.description ?? "",
      assigneeId: defaultValues?.assigneeId ?? undefined,
      cover: defaultValues?.cover ?? { type: "none" },
    },
  });

  const { members } = useBoardMembers(boardId);

  useEffect(() => {
    onValidityChange?.(isDirty && isValid);
  }, [onValidityChange, isDirty, isValid]);

  return (
    <form
      id="board-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-4 flex-col"
    >
      <FieldGroup>
        <Field>
          <Label htmlFor="title">Task</Label>
          <Input {...register("title")} id="title" placeholder="e.g. Study" />
        </Field>
        <Controller
          name="status"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <Label htmlFor="status">Status</Label>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="status"
                  className="w-full"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {TASK_STATUS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <Field>
          <Label htmlFor="description">Description</Label>
          <Textarea
            {...register("description")}
            id="description"
            placeholder="Add a more detailed description..."
            className="w-full rounded-md border px-3 py-2 text-sm resize-none"
          />
        </Field>
        <Controller
          name="assigneeId"
          control={control}
          render={({ field, fieldState }) => (
            <Field>
              <Label htmlFor="assigneeId">Assign To</Label>
              <Select
                name={field.name}
                value={field.value || "unassigned"}
                onValueChange={(val) => field.onChange(val === "unassigned" ? null : val)}
              >
                <SelectTrigger
                  id="assigneeId"
                  className="w-full"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="unassigned" className="text-muted-foreground italic">
                      Unassigned
                    </SelectItem>
                    {members.map((member) => (
                      <SelectItem key={member.user_id} value={member.user_id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-5 h-5">
                            <AvatarFallback
                              className="text-[8px] text-white"
                              style={{ backgroundColor: member.profiles?.bg_color || "#9CA3AF" }}
                            >
                              {(member.profiles?.name || member.profiles?.email || "?").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{member.profiles?.name || member.profiles?.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => {
            const { value, onChange } = field;

            return (
              <Field>
                <FieldLabel>Due Date</FieldLabel>

                <InputGroup>
                  <InputGroupInput
                    value={value ? formatDueDate(value) : ""}
                    placeholder="No due date"
                    readOnly
                  />

                  {value && (
                    <InputGroupButton
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onChange(null)}
                    >
                      ✕
                    </InputGroupButton>
                  )}

                  <InputGroupAddon align="inline-end">
                    <Popover>
                      <PopoverTrigger asChild>
                        <InputGroupButton variant="ghost" size="icon-xs">
                          <CalendarIcon />
                        </InputGroupButton>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={value ?? undefined}
                          onSelect={(date) => onChange(date ?? null)}
                        />
                      </PopoverContent>
                    </Popover>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            );
          }}
        />
        <Controller
          name="cover"
          control={control}
          render={({ field }) => {
            const cover = field.value ?? { type: "none" };

            return (
              <Field>
                <Label>Cover</Label>

                <ToggleGroup
                  type="single"
                  value={cover.type}
                  onValueChange={(val) => {
                    if (!val) return;
                    field.onChange({ type: val });
                  }}
                  className="justify-start"
                >
                  <ToggleGroupItem value="none">None</ToggleGroupItem>
                  <ToggleGroupItem value="color">Color</ToggleGroupItem>
                  <ToggleGroupItem value="image">Image</ToggleGroupItem>
                </ToggleGroup>

                {cover.type === "color" && (
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {COLORS.map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() =>
                          field.onChange({ type: "color", value: c })
                        }
                        className={`w-full h-8 rounded-md border ${cover.value === c ? "ring-2 ring-primary" : ""
                          }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                )}

                {cover.type === "image" && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {IMAGES.map((img) => (
                      <CoverImageItem
                        key={img}
                        img={img}
                        selected={cover.value === img}
                        onClick={() =>
                          field.onChange({ type: "image", value: img })
                        }
                      />
                    ))}
                  </div>
                )}
              </Field>
            );
          }}
        />
      </FieldGroup>
    </form>
  );
}

function CoverImageItem({
  img,
  selected,
  onClick,
}: {
  img: string;
  selected: boolean;
  onClick: () => void;
}) {
  const [loading, setLoading] = useState(true);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-md overflow-hidden border ${selected ? "ring-2 ring-primary" : ""
        }`}
    >
      <div className="relative w-full h-16">
        {loading && <div className="absolute inset-0 bg-muted animate-pulse" />}

        <Image
          src={img}
          alt="cover"
          fill
          className={`object-cover transition-opacity ${loading ? "opacity-0" : "opacity-100"
            }`}
          sizes="120px"
          priority
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
    </button>
  );
}
