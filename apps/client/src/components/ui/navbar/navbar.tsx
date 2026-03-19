// import { useRouter } from "@tanstack/react-router";

import { Link, useRouter } from "@tanstack/react-router"
import type { ComponentProps, FC } from "react"
import { cn } from "@/lib/class"
import { authClient } from "@/lib/clients/auth"
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar"
import { Box } from "../box/box"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown/dropdown"
import { LinkButton } from "../link-button/link-button"

type NavbarProps = ComponentProps<"div">

export const Navbar: FC<NavbarProps> = ({ className }) => {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const handleSignOut = async () => {
    await authClient.signOut()

    return router.navigate({ to: "/" })
  }

  if (isPending || !session) {
    return null
  }

  return (
    <Box className={cn("flex justify-between items-center p-4", className)}>
      <div className="flex items-center gap-2">
        <LinkButton
          variant={"link"}
          size={"sm"}
          to="/"
          activeOptions={{
            exact: true,
          }}
          activeProps={{
            className: "underline",
          }}
        >
          Dashboard
        </LinkButton>
        <LinkButton
          variant={"link"}
          size={"sm"}
          to="/blueprints"
          activeOptions={{
            exact: true,
          }}
          activeProps={{
            className: "underline",
          }}
        >
          Blueprints
        </LinkButton>
        <LinkButton
          variant={"link"}
          size={"sm"}
          to="/groups"
          activeOptions={{
            exact: true,
          }}
          activeProps={{
            className: "underline",
          }}
        >
          Groups
        </LinkButton>
        <LinkButton
          variant={"link"}
          size={"sm"}
          to="/blueprints/browse"
          activeOptions={{
            exact: true,
          }}
          activeProps={{
            className: "underline",
          }}
        >
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
  )
}
