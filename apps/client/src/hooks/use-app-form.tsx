import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { InputField } from "@/components/form/input-field";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    InputField,
  },
  formComponents: {},
});
