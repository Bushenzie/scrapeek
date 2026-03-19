import { createFileRoute, redirect } from "@tanstack/react-router"
import { LoginCard } from "@/features/auth/components/login-card"

export const Route = createFileRoute("/auth/login")({
  component: LoginPagePage,
  beforeLoad: async ({ context }) => {
    if (context.session) {
      throw redirect({ to: "/" })
    }
  },
})

function LoginPagePage() {
  return (
    <div className="flex items-center justify-center">
      <LoginCard />
    </div>
  )
}
