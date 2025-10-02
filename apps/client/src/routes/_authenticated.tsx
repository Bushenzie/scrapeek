import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  component: () => <Outlet />,
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: "/auth/login" });
    }
  },
});
