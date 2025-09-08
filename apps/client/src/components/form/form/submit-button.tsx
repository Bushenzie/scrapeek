import { type FC } from "react";
import { Button } from "@/components/ui/button/button";
import { useFormContext } from "@/hooks/use-app-form";

type SubmitButtonProps = {
  btnText?: string;
};

export const SubmitButton: FC<SubmitButtonProps> = ({ btnText }) => {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => [state.isSubmitting, state.isValid]}
      children={([isSubmitting, isValid]) => (
        <Button
          type="submit"
          size={"lg"}
          disabled={!isValid}
          loading={isSubmitting}
        >
          {btnText ?? "Submit"}
        </Button>
      )}
    />
  );
};
