import { useStore } from "@tanstack/react-form"
import type { FC } from "react"
import { Label } from "@/components/ui/label/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select"
import { useFieldContext } from "@/hooks/use-app-form"
import { ErrorField } from "./error-field"

type SelectFieldProps = {
  label: string
  triggerLabel: string
  options: {
    label: string
    value: string
  }[]
  showError?: boolean
}

export const SelectField: FC<SelectFieldProps> = ({
  label,
  triggerLabel,
  options,
  showError = true,
}) => {
  const field = useFieldContext<string>()

  const currentValue = useStore(field.store, (state) => state.value)

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>{label}</Label>
      <Select value={field.state.value} onValueChange={(val) => field.handleChange(val as string)}>
        <SelectTrigger className="w-full">
          <SelectValue>
            {currentValue ? options.find((val) => val.value === currentValue)?.label : triggerLabel}
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
      {showError && <ErrorField fieldMeta={field.getMeta()} />}
    </div>
  )
}
