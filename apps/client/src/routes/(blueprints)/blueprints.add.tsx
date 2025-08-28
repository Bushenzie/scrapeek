import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(blueprints)/blueprints/add')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(blueprints)/blueprints/add"!</div>
}
