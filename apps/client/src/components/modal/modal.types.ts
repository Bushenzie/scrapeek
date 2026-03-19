import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { ButtonProps } from "../ui/button/button.types";

export type ModalProps = {
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
		content: string | ReactNode;
		props?: ButtonProps;
	} | null;
	state?: {
		open: boolean;
		setOpen: Dispatch<SetStateAction<boolean>>;
	};
	overlayClose?: boolean;
	isDropdownMenuItem?: boolean;
};
