import type { VariantProps } from "class-variance-authority";
import type {
	ComponentProps,
	Dispatch,
	ReactNode,
	SetStateAction,
} from "react";
import type { buttonVariants } from "../ui/button/button.variants";

export type ModalProps =
	{
		title: string;
		description?: string;
		children?: ReactNode;
		submitBtn?: {
			text?: string;
			disabled?: boolean;
			onSubmit?: () => void;
		};
		cancelBtn?: {
			text?: string;
		};
		trigger?: {
			text:
				| string
				| ReactNode;
			props?: VariantProps<
				typeof buttonVariants
			> &
				ComponentProps<"button">;
		} | null;
		state?: {
			open: boolean;
			setOpen: Dispatch<
				SetStateAction<boolean>
			>;
		};
		overlayClose?: boolean;
	};
