import { useStore } from "@tanstack/react-form";
import { type FC } from "react";
import type { ZodError } from "zod";
import { Label } from "@/components/ui/label/label";
import { Textarea } from "@/components/ui/textarea/textarea";
import { useFieldContext } from "@/hooks/use-app-form";

type TextareaFieldProps = {
  label: string;
};

export const TextareaField: FC<TextareaFieldProps> = ({ label }) => {
  const field = useFieldContext<string>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Textarea
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
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
