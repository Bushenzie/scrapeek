import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(blueprints)/blueprints_/$blueprintId/edit',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(blueprints)/blueprints/$blueprintId/edit"!</div>
}
