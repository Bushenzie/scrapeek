import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/blueprints/_/$blueprintId/preview',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/blueprints/_/$blueprintId/preview"!</div>
}
