import { Button } from "@/components/ui/button/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";
import { authClient } from "@/lib/clients/auth";

export const LoginCard = () => {
  const handleSignIn = () => {
    authClient.signIn.social({
      provider: "github",
      callbackURL: "http://localhost:3000/blueprints",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSignIn}>Sign in with github</Button>
      </CardContent>
    </Card>
  );
};
