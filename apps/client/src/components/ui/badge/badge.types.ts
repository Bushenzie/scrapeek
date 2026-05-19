import type { useRender } from "@base-ui/react"
import type { VariantProps } from "class-variance-authority"
import type { badgeVariants } from "./badge.variants"

export type BadgeProps = useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>
