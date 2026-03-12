import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import type { badgeVariants } from "./badge.variants";

export type BadgeProps = ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean };
