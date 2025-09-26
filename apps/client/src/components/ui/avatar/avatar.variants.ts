import { cva } from "class-variance-authority";

export const avatarVariants = cva(
  "relative border border-blueprint-400 flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "size-8",
        md: "size-9",
        lg: "size-10",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);
