import type { VariantProps } from "class-variance-authority";
import type {
	ComponentProps,
	ReactNode,
} from "react";
import type { buttonVariants } from "./button.variants";

export type ButtonProps =
	ComponentProps<"button"> &
		VariantProps<
			typeof buttonVariants
		> & {
			asChild?: boolean;
			icon?: ReactNode;
			loading?: boolean;
		};
