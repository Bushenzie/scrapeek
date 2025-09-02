import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import css from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: css,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="bg-blueprint-900 font-mono text-blueprint-100">
				<div className="w-full max-w-[1280px] mx-auto px-4 py-8">
					{children}
				</div>
				<div className="absolute -z-10 inset-0 h-full w-full bg-[linear-gradient(to_right,var(--color-blueprint-700)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-blueprint-700)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
				<Scripts />
			</body>
		</html>
	);
}
