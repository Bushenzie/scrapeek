export type ToastProps = {
	id: string | number;
	title: string;
	description?: string;
	action?: {
		btnText: string;
		onClick: () => void;
	};
	//   asyncFn?: {
	//     promise: Promise<any>;
	//     loading?: string;
	//     error?: string;
	//     success?: {
	//       title: string;
	//       description?: string;
	//     };
	//   };
};
