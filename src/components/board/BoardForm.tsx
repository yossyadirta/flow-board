import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BoardFormValues, boardSchema } from "@/schemas/board.schemas";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BOARD_ICONS_MAP, BoardIconId } from "./BoardIcons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
    register,
    control,
    setValue,
    formState: { isValid },
  } = useForm<BoardFormValues>({
    resolver: zodResolver(boardSchema),
    mode: "onChange",
    defaultValues: {
      name: defaultValues?.name ?? "",
      icon: defaultValues?.icon,
    },
  });

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [onValidityChange, isValid]);

  const selectedIcon = useWatch({
    control: control,
    name: "icon",
  });

  return (
    <form
      id="board-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex gap-4 flex-col"
    >
      <FieldGroup>
        <Field>
          <Label htmlFor="board-name">Name</Label>
          <Input
            id="board-name"
            {...register("name")}
            placeholder="e.g. Default Board"
          />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field>
          <Label>Icon</Label>
          <div className="flex gap-2 flex-wrap">
            {icons.map((iconId) => {
              const { emoji, bg } = BOARD_ICONS_MAP[iconId];
              const selected = selectedIcon === iconId;

              return (
                <button
                  key={iconId}
                  type="button"
                  onClick={() => setValue("icon", iconId)}
                  aria-pressed={selected}
                  className="rounded-full focus:outline-none"
                >
                  <Avatar
                    className={cn(
                      "h-10 w-10 flex items-center justify-center border transition-colors  ",
                      selected
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground/40",
                    )}
                    style={{ backgroundColor: bg }}
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
