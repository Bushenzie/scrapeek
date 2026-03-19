import type { Option } from "@/types/common";

export type MultiSelectProps = {
	options: Option[];
	label?: string;
	placeholder?: string;
	notFoundText?: string;
	value?: Option[];
	onChange?: (value: Option[]) => void;
};
