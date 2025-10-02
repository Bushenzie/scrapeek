import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const queryClient = new QueryClient();

  return routerWithQueryClient(
    createTanstackRouter({
      routeTree,
      context: { queryClient },
      defaultPreload: "intent",
      Wrap: (props: { children: React.ReactNode }) => {
        return (
          <QueryClientProvider client={queryClient}>
            {props.children}
          </QueryClientProvider>
        );
      },
    }),
    queryClient
  );
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
