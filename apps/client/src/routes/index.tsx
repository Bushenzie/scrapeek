import { Button } from "@/components/ui/button/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Homepage,
});

function Homepage() {
  return (
    <div>
      <Button>test</Button>
    </div>
  );
}
