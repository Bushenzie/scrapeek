import { createFileRoute, redirect, useSearch } from "@tanstack/react-router"
import { Box } from "@/components/ui/box/box"
import { GoBackButton } from "@/components/ui/go-back-button/go-back-button"
import { Separator } from "@/components/ui/separator/separator"
import { APIBlueprintForm } from "@/features/blueprints/components/forms/api-blueprint-form"
import { DynamicBlueprintForm } from "@/features/blueprints/components/forms/dynamic-blueprint-form"
import { StaticBlueprintForm } from "@/features/blueprints/components/forms/static-blueprint-form"
import { blueprintTypeSelectSchema } from "@/features/blueprints/schemas/blueprint-type"

export const Route = createFileRoute("/_authenticated/blueprints/add")({
  head: () => ({
    meta: [{ title: "Scrapeek - add blueprint" }],
  }),
  validateSearch: blueprintTypeSelectSchema,
  onError: () => {
    throw redirect({ to: "/blueprints" })
  },
  component: AddBlueprintPage,
})

function AddBlueprintPage() {
  const { type } = useSearch({ from: "/_authenticated/blueprints/add" })
  return (
    <div>
      <GoBackButton fallbackTo=".." />
      <Box>
        <div className="flex items-start flex-col gap-2 n p-6">
          <h1 className="text-2xl">Add blueprint</h1>
        </div>
        <Separator />
        <div className="p-6">
          {type === "api" && <APIBlueprintForm />}
          {type === "static" && <StaticBlueprintForm />}
          {type === "dynamic" && <DynamicBlueprintForm />}
        </div>
      </Box>
    </div>
  )
}
