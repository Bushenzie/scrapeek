import type { FC } from "react"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import { useFieldContext } from "@/hooks/use-app-form"
import { ErrorField } from "./error-field"

type NumberFieldProps = {
  label: string
  showError?: boolean
}

export const NumberField: FC<NumberFieldProps> = ({ label, showError = true }) => {
  const field = useFieldContext<number>()

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>{label}</Label>
      <Input
        type="number"
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
      />
      {showError && <ErrorField fieldMeta={field.getMeta()} />}
    </div>
  )
}
