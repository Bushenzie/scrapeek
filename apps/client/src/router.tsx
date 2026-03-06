import { MutationCache, QueryClient, QueryClientProvider, type QueryKey } from "@tanstack/react-query";
import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { toast } from "./components/ui/toasts/toast";
import { routeTree } from "./routeTree.gen";

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidatesQuery?: QueryKey;
      successMessage?: string;
      errorMessage?: string;
    };
  }
}


export const getRouter = () => {
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onError: (_error, _variables, _context, mutation) => {
        if (mutation.meta?.errorMessage) {
          toast({ title: "Error occured", description: mutation.meta?.errorMessage })
        }
      },
      onSuccess: (_error, _variables, _context, mutation) => {
        if (mutation.meta?.successMessage) {
          toast({ title: "Success", description: mutation.meta?.successMessage })
        }
      },
      onSettled: (_data, _error, _variables, _context, mutation) => {
        if (mutation.meta?.invalidatesQuery) {
          queryClient.invalidateQueries({
            queryKey: mutation.meta?.invalidatesQuery,
          });
        }
      }
    })
  });

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
