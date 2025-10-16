// import { Link } from "@tanstack/react-router";
import { Plus, ThumbsUp } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar/avatar";
import { Box } from "@/components/ui/box/box";
import { Button } from "@/components/ui/button/button";
import { useUpvoteBlueprint } from "../api/mutations/use-upvote-blueprint";
import { usePublicBlueprints } from "../api/queries/use-public-blueprints";

export const PublicBlueprintsList = () => {
  const { mutate: upvoteBlueprint } = useUpvoteBlueprint();
  const { data: blueprints } = usePublicBlueprints({ page: 1 });

  return (
    <div className="grid grid-cols-3 p-2 gap-2 w-full">
      {blueprints.length === 0 && (
        <span className="text-blueprint-200 text-center col-span-full my-4">
          No public blueprints found
        </span>
      )}
      {blueprints?.length > 0 &&
        blueprints?.map((blueprint) => (
          // <Link
          //   key={blueprint.id}
          //   to="/blueprints/$blueprintId/preview"
          //   params={{
          //     blueprintId: blueprint.id,
          //   }}
          // >
          <Box className="p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg">{blueprint.name}</h2>
                <div className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarImage src={blueprint?.user?.image ?? undefined} />
                    <AvatarFallback>
                      {blueprint?.user?.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs text-blueprint-200">
                    {blueprint.user?.name}
                  </p>
                </div>
              </div>
              <span className="text-blueprint-200 line-clamp-3 text-xs">
                {blueprint.description}
              </span>
            </div>
            <div className="flex mt-6 gap-2 justify-end">
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={async () => {
                  await upvoteBlueprint(blueprint.id);
                }}
                className="flex items-center justify-center"
              >
                <ThumbsUp className="size-4" />
                <span className="text-md">{blueprint.upvotes}</span>
              </Button>
              <Button variant={"outline"} size={"sm"}>
                <Plus className="size-4" />
                <span className="text-md">Add to library</span>
              </Button>
            </div>
          </Box>
          // </Link>
        ))}
    </div>
  );
};
