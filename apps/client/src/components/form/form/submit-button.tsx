import { type FC } from "react";
import { Button } from "@/components/ui/button/button";
import { useFormContext } from "@/hooks/use-app-form";

type SubmitButtonProps = {
  btnText?: string;
  onClick?: () => void;
};

export const SubmitButton: FC<SubmitButtonProps> = ({ btnText, onClick }) => {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => [state.isSubmitting, state.isValid]}
      children={([isSubmitting, isValid]) => (
        <Button
          type="submit"
          size={"lg"}
          onClick={onClick}
          disabled={!isValid}
          loading={isSubmitting}
        >
          {btnText ?? "Submit"}
        </Button>
      )}
    />
  );
};
