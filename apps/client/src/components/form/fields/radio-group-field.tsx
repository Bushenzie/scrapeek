import { type FC } from "react";
import { Label } from "@/components/ui/label/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group/radio-group";
import { useFieldContext } from "@/hooks/use-app-form";
import { ErrorField } from "./error-field";

type RadioGroupFieldProps = {
  label: string;
  options: {
    label: string;
    value: string;
  }[];
  showError?: boolean;
};

export const RadioGroupField: FC<RadioGroupFieldProps> = ({
  label,
  options,
  showError = true,
}) => {
  const field = useFieldContext<string>();

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
            <Label htmlFor={`${option.value}-${index}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
      {showError && <ErrorField fieldMeta={field.getMeta()} />}
    </div>
  );
};
