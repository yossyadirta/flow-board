"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BoardFormValues, boardSchema } from "@/schemas/board.schemas";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { BOARD_ICONS_MAP, BoardIconId } from "./BoardIcons";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

type Props = {
  onSubmit: (values: BoardFormValues) => void;
  defaultValues?: BoardFormValues;
  onValidityChange?: (isValid: boolean) => void;
};

const icons = Object.keys(BOARD_ICONS_MAP) as BoardIconId[];

export function BoardForm({
  onSubmit,
  defaultValues,
  onValidityChange,
}: Props) {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid, isDirty },
  } = useForm<BoardFormValues>({
    resolver: zodResolver(boardSchema),
    mode: "onChange",
    defaultValues: {
      name: defaultValues?.name ?? "",
      icon: defaultValues?.icon ?? "briefcase",
      key: defaultValues?.key ?? "",
    },
  });

  useEffect(() => {
    onValidityChange?.(isDirty && isValid);
  }, [onValidityChange, isDirty, isValid]);

  const selectedIcon = useWatch({
    control,
    name: "icon",
  });

  const isEditMode = !!defaultValues?.key;

  return (
    <form
      id="board-form"
      data-onboarding="board-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <FieldGroup>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="board-name">Name</FieldLabel>

              <Input
                {...field}
                id="board-name"
                placeholder="e.g. Default Board"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="key"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="board-key">Board Key</FieldLabel>

              <Input
                {...field}
                id="board-key"
                placeholder="e.g. MKT"
                disabled={isEditMode}
                maxLength={5}
                aria-invalid={fieldState.invalid}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              />

              <p className="text-[0.8rem] text-muted-foreground mt-1">
                2-5 characters. Used as a prefix for tasks (e.g., MKT-1). <br />
                <span className="font-medium text-foreground/80">
                  Cannot be changed after creation.
                </span>
              </p>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <FieldLabel>Icon</FieldLabel>

          <div className="flex flex-wrap gap-2">
            {icons.map((iconId) => {
              const { emoji } = BOARD_ICONS_MAP[iconId];
              const selected = selectedIcon === iconId;

              return (
                <button
                  key={iconId}
                  type="button"
                  onClick={() =>
                    setValue("icon", iconId, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  aria-pressed={selected}
                  className="rounded-full focus:outline-none"
                >
                  <Avatar
                    className={cn(
                      "h-10 w-10 border transition-colors flex items-center justify-center",
                      selected
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground/40",
                    )}
                  >
                    <AvatarFallback className="bg-transparent text-lg">
                      {emoji}
                    </AvatarFallback>
                  </Avatar>
                </button>
              );
            })}
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}
