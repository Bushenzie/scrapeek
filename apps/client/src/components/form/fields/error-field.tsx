import type { AnyFieldMeta } from "@tanstack/react-form"
import type { FC } from "react"
import type { ZodError } from "zod"

type ErrorFieldProps = {
  fieldMeta: AnyFieldMeta
}

export const ErrorField: FC<ErrorFieldProps> = ({ fieldMeta }) => {
  if (fieldMeta.isTouched || fieldMeta.errors.length > 0) return null

  return fieldMeta.errors.map((error: ZodError, index) => (
    <span key={index} className="text-red-600">
      {error.message}
    </span>
  ))
}
