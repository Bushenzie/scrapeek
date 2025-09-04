import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/login")({
  component: LoginPagePage,
});

function LoginPagePage() {
  return <div>Hello "/(auth)/login"!</div>;
}
