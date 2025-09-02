import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { Undo2 } from "lucide-react";
import { Button } from "../button/button";

export const GoBackButton = () => {
	const router = useRouter();
	const canGoBack = useCanGoBack();

	const handleClick = () => {
		if (!canGoBack) return;

		router.history.back();
	};

	return (
		<Button
			variant={"link"}
			className="text-blueprint-200 hover:no-underline"
			onClick={handleClick}
		>
			<Undo2 /> Go Back
		</Button>
	);
};
