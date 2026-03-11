import type { BlueprintWithRelations } from "@scrapeek/db/validators";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Plus, ThumbsUp } from "lucide-react";
import { type FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar/avatar";
import { Badge } from "@/components/ui/badge/badge";
import { Box } from "@/components/ui/box/box";
import { Button } from "@/components/ui/button/button";
import { authClient } from "@/lib/clients/auth";
import { useUpvoteBlueprint } from "../api/blueprints.mutations";
import { blueprintUpvotesOptions } from "../api/blueprints.queries";

type PublicBlueprintListItemProps = {
  blueprint: BlueprintWithRelations;
};

export const PublicBlueprintListItem: FC<PublicBlueprintListItemProps> = ({ blueprint }) => {
  const { data: session } = authClient.useSession();
  const { mutate: upvoteBlueprint } = useUpvoteBlueprint();
  const { data: upvotes } = useQuery(blueprintUpvotesOptions(blueprint.id));

  return (
    <Box className="p-5 h-48 grid grid-rows-4">
      <div className="space-y-3 row-span-3">
        <div className="flex items-center justify-between">
          <Link
            key={blueprint.id}
            to="/blueprints/$blueprintId/preview"
            className="text-lg font-medium truncate"
            params={{
              blueprintId: blueprint.id,
            }}
          >
            {blueprint.name}
          </Link>
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage src={blueprint?.user?.image ?? undefined} />
              <AvatarFallback>{blueprint?.user?.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <p className="text-xs text-blueprint-200">{blueprint?.user?.name}</p>
          </div>
        </div>
        <span className="text-blueprint-200 line-clamp-3 text-xs">
          {blueprint.description || "No description provided."}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <Badge>{blueprint.type.toUpperCase()}</Badge>
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant={
              upvotes?.find((upvote) => upvote.userId === session?.user.id) !== undefined ? "primary" : "outline"
            }
            size={"sm"}
            onClick={async () => {
              await upvoteBlueprint(blueprint.id);
            }}
            className="flex items-center justify-center"
          >
            <ThumbsUp className="size-4" />
            <span className="text-md">{blueprint.upvotes?.blueprintId}</span>
          </Button>
          <Button variant={"outline"} size={"sm"} disabled>
            <Plus className="size-4" />
            <span className="text-md">Add to library</span>
          </Button>
        </div>
      </div>
    </Box>
  );
};
