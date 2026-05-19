import { createFileRoute } from "@tanstack/react-router"
import { Box } from "@/components/ui/box/box"
import { Separator } from "@/components/ui/separator/separator"
import { PublicBlueprintsList } from "@/features/blueprints/components/public-blueprints-list"

export const Route = createFileRoute("/_authenticated/blueprints/browse")({
  head: () => ({
    meta: [{ title: "Scrapeek - public blueprints" }],
  }),
  component: BlueprintBrowsePage,
})

function BlueprintBrowsePage() {
  return (
    <Box className="w-full">
      <h1 className="text-2xl p-6">Public Blueprints</h1>
      <Separator />
      <PublicBlueprintsList />
    </Box>
  )
}
