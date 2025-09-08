import { useStore } from "@tanstack/react-form";
import { type FC } from "react";
import type { ZodError } from "zod";
import { Label } from "@/components/ui/label/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group/radio-group";
import { useFieldContext } from "@/hooks/use-app-form";

type RadioGroupFieldProps = {
  label: string;
  options: {
    label: string;
    value: string;
  }[];
};

export const RadioGroupField: FC<RadioGroupFieldProps> = ({
  label,
  options,
}) => {
  const field = useFieldContext<string>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <RadioGroup
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
      >
        {options.map((option, index) => (
          <div className="flex items-center gap-2" key={index}>
            <RadioGroupItem
              value={option.value}
              id={`${option.value}-${index}`}
            />
            <Label>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
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
