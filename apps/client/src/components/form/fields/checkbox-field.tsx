import { useStore } from "@tanstack/react-form";
import { type FC } from "react";
import type { ZodError } from "zod";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { Label } from "@/components/ui/label/label";
import { useFieldContext } from "@/hooks/use-app-form";

type CheckboxFieldProps = {
  label: string;
};

export const CheckboxField: FC<CheckboxFieldProps> = ({ label }) => {
  const field = useFieldContext<boolean>();

  const id = label.toLowerCase().split(" ").join("-");
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={field.state.value}
        onCheckedChange={(checked) => {
          console.log(checked);
          field.handleChange(checked as boolean);
        }}
      />
      <Label htmlFor={id}>{label}</Label>
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
