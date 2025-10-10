// import { useRouter } from "@tanstack/react-router";

import { Link, useRouter } from "@tanstack/react-router";
import { type ComponentProps, type FC } from "react";
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
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();

    return router.navigate({ to: "/" });
  };

  if (isPending || !session) {
    return null;
  }

  return (
    <Box className={cn("flex justify-between items-center p-4", className)}>
      <div className="flex items-center gap-2">
        <LinkButton variant={"link"} size={"sm"} to="/">
          Dashboard
        </LinkButton>
        <LinkButton variant={"link"} size={"sm"} to="/blueprints">
          Blueprints
        </LinkButton>
        <LinkButton variant={"link"} size={"sm"} to="/blueprints/browse">
          Browse
        </LinkButton>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="cursor-pointer">
            <AvatarImage src={session?.user?.image ?? undefined} />
            <AvatarFallback>{session?.user?.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link to="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Box>
  );
};
