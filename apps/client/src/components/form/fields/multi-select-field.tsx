import { type FC } from "react";
import { Label } from "@/components/ui/label/label";
import { MultiSelect } from "@/components/ui/multi-select/multi-select";
import { useFieldContext } from "@/hooks/use-app-form";
import type { Option } from "@/types/common";
import { ErrorField } from "./error-field";

type MultiSelectFieldProps = {
  label: string;
  notFoundText?: string
  placeholder?: string
  options: Option[];
  showError?: boolean;
};

export const MultiSelectField: FC<MultiSelectFieldProps> = ({
  label,
  options,
  notFoundText,
  placeholder,
  showError = true,
}) => {
  const field = useFieldContext<Option[]>();

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <MultiSelect
        value={field.state.value}
        options={options}
        notFoundText={notFoundText}
        placeholder={placeholder}
        onChange={(val) => field.handleChange(val)}
        />
      {showError && <ErrorField fieldMeta={field.getMeta()} />}
    </div>
  );
};
