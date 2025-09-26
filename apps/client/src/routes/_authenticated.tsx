import { createFileRoute, Outlet } from "@tanstack/react-router";
import { authenticatedLoad } from "@/features/auth/utils/authenticated-load";

export const Route = createFileRoute("/_authenticated")({
  component: () => <Outlet />,
  beforeLoad: () => authenticatedLoad({ to: "/auth/login" }),
});
