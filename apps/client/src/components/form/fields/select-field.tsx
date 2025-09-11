import { useStore } from "@tanstack/react-form";
import { type FC } from "react";
import type { ZodError } from "zod";
import { Label } from "@/components/ui/label/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import { useFieldContext } from "@/hooks/use-app-form";

type SelectFieldProps = {
  label: string;
  triggerLabel: string;
  options: {
    label: string;
    value: string;
  }[];
};

export const SelectField: FC<SelectFieldProps> = ({
  label,
  triggerLabel,
  options,
}) => {
  const field = useFieldContext<string>();

  const currentValue = useStore(field.store, (state) => state.value);
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>{label}</Label>
      <Select
        value={field.state.value}
        onValueChange={(val) => field.handleChange(val)}
      >
        <SelectTrigger className="w-full">
          <SelectValue>
            {currentValue ? currentValue : triggerLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={index} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.length > 0 && (
        <>
          {errors.map((error: ZodError) => (
            <span className="text-red-600">{error.message}</span>
          ))}
        </>
      )}
    </div>
  );
};
