import { cva } from "class-variance-authority";

export const loadingSpinnerVariants = cva("animate-spin", {
	variants: {
		size: {
			sm: "w-5 h-5",
			md: "w-7 h-7",
			lg: "w-10 h-10",
		},
	},
	defaultVariants: {
		size: "md",
	},
});
