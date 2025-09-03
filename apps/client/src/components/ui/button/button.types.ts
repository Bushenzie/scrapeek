import type { ComponentProps } from "react";
import type { buttonVariants } from "./button.variants";
import type { VariantProps } from "class-variance-authority";

export type ButtonProps = ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	};
