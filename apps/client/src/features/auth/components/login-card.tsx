import { Button } from "@/components/ui/button/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/card"
import { authClient } from "@/lib/clients/auth"

export const LoginCard = () => {
  const handleSignIn = (provider: "github" | "gitlab" | "google") => {
    authClient.signIn.social({
      callbackURL: "http://localhost:3000/blueprints",
      provider,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 w-full">
          <Button size={"lg"} onClick={() => handleSignIn("github")}>
            Sign in with Github
          </Button>
          <Button size={"lg"} onClick={() => handleSignIn("gitlab")}>
            Sign in with Gitlab
          </Button>
          <Button size={"lg"} onClick={() => handleSignIn("google")}>
            Sign in with Google
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
