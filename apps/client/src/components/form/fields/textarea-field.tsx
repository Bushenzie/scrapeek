import type { FC } from "react"
import { Label } from "@/components/ui/label/label"
import { Textarea } from "@/components/ui/textarea/textarea"
import { useFieldContext } from "@/hooks/use-app-form"
import { ErrorField } from "./error-field"

type TextareaFieldProps = {
  label: string
  showError?: boolean
}

export const TextareaField: FC<TextareaFieldProps> = ({ label, showError = true }) => {
  const field = useFieldContext<string>()

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Textarea
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {showError && <ErrorField fieldMeta={field.getMeta()} />}
    </div>
  )
}
