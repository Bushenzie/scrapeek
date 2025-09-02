import { createFileRoute } from "@tanstack/react-router";
import { GoBackButton } from "@/components/ui/go-back-button/go-back-button";

export const Route = createFileRoute(
	"/(blueprints)/blueprints_/$blueprintId/edit",
)({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<GoBackButton />
			Hello "/(blueprints)/blueprints/$blueprintId/edit"!
		</div>
	);
}
