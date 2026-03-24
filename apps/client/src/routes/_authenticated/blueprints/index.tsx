import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { Box } from "@/components/ui/box/box"
import { LoadingSpinner } from "@/components/ui/loading-spinner/loading-spinner"
import { Separator } from "@/components/ui/separator/separator"
import { BlueprintList } from "@/features/blueprints/components/blueprint-list"
import { CreateBlueprintDialog } from "@/features/blueprints/components/modals/create-blueprint-modal"

export const Route = createFileRoute("/_authenticated/blueprints/")({
  head: () => ({
    meta: [{ title: "Scrapeek - blueprints" }],
  }),
  component: BlueprintsPage,
})

function BlueprintsPage() {
  return (
    <Box className="w-full">
      <div className="flex justify-between p-6">
        <h1 className="text-2xl">Blueprints</h1>
        <div className="flex gap-2 items-center">
          <CreateBlueprintDialog />
        </div>
      </div>
      <Separator />
      <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto" />}>
        <BlueprintList />
      </Suspense>
    </Box>
  )
}
