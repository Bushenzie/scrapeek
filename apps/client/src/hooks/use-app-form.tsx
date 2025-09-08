import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { CheckboxField } from "@/components/form/fields/checkbox-field";
import { NumberField } from "@/components/form/fields/number-field";
import { RadioGroupField } from "@/components/form/fields/radio-group-field";
import { SelectField } from "@/components/form/fields/select-field";
import { TextField } from "@/components/form/fields/text-field";
import { TextareaField } from "@/components/form/fields/textarea-field";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    NumberField,
    CheckboxField,
    SelectField,
    RadioGroupField,
    TextareaField,
  },
  formComponents: {},
});
