import { useStore } from "@tanstack/react-form";
import { type FC } from "react";
import type { ZodError } from "zod";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { useFieldContext } from "@/hooks/use-app-form";

type NumberFieldProps = {
  label: string;
};

export const NumberField: FC<NumberFieldProps> = ({ label }) => {
  const field = useFieldContext<number>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Input
        type="number"
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
      />
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
