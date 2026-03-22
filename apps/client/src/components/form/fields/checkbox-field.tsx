import type { FC } from "react"
import { Checkbox } from "@/components/ui/checkbox/checkbox"
import { Label } from "@/components/ui/label/label"
import { useFieldContext } from "@/hooks/use-app-form"
import { ErrorField } from "./error-field"

type CheckboxFieldProps = {
  label: string
  showError?: boolean
}

export const CheckboxField: FC<CheckboxFieldProps> = ({ label, showError = true }) => {
  const field = useFieldContext<boolean>()

  const id = label.toLowerCase().split(" ").join("-")

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={field.state.value}
        onCheckedChange={(checked) => {
          console.log(checked)
          field.handleChange(checked as boolean)
        }}
      />
      <Label htmlFor={id}>{label}</Label>
      {showError && <ErrorField fieldMeta={field.getMeta()} />}
    </div>
  )
}
