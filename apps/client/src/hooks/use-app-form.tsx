import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { CheckboxField } from "@/components/form/fields/checkbox-field";
import { InputField } from "@/components/form/fields/input-field";
import { SelectField } from "@/components/form/fields/select-field";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    InputField,
    CheckboxField,
    SelectField,
  },
  formComponents: {},
});
