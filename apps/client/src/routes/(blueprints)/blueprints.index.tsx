import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { useBlueprints } from "@/api/use-blueprints";

export const Route = createFileRoute("/(blueprints)/blueprints/")({
  component: RouteComponent,
});

async function RouteComponent() {
  const { data } = useBlueprints();

  return (
    <div className="w-screen h-screen">
      {/* {data?.data?.map((item: { name: string; id: string }) => (
        <h1 key={item.id}>{item.name}</h1>
      ))} */}
    </div>
  );
}
