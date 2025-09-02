import { createFileRoute } from "@tanstack/react-router";
import { GoBackButton } from "@/components/ui/go-back-button/go-back-button";

export const Route = createFileRoute("/(blueprints)/blueprints/add")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<GoBackButton />
			Hello "/(blueprints)/blueprints/add"!
		</div>
	);
}
