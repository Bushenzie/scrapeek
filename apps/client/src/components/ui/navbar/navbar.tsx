// import { useRouter } from "@tanstack/react-router";

import { Link, useRouter } from "@tanstack/react-router";
import { type ComponentProps, type FC } from "react";
import { useSession } from "@/features/auth/hooks/use-session";
import { authClient } from "@/lib/clients/auth";
import { cn } from "@/lib/utils/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar";
import { Box } from "../box/box";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown/dropdown";
import { LinkButton } from "../link-button/link-button";

type NavbarProps = ComponentProps<"div">;

export const Navbar: FC<NavbarProps> = ({ className }) => {
  const router = useRouter();
  const { isLogged, setIsLogged, user } = useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    setIsLogged(false);
    return router.navigate({ to: "/" });
  };

  return (
    <Box className={cn("flex justify-between items-center p-4", className)}>
      <div className="flex items-center gap-2">
        <LinkButton variant={"link"} size={"sm"} to="/">
          Home
        </LinkButton>
        {isLogged && (
          <LinkButton variant={"link"} size={"sm"} to="/blueprints">
            Blueprints
          </LinkButton>
        )}
      </div>
      {!isLogged ? (
        <LinkButton to="/auth/login">Login</LinkButton>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="cursor-pointer">
              <AvatarImage src={user?.image ?? undefined} />
              <AvatarFallback>{user?.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link to="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </Box>
  );
};
