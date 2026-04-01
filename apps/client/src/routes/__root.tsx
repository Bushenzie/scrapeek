import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router"
import { Navbar } from "@/components/ui/navbar/navbar"
import { Toaster } from "@/components/ui/toasts/toasts"
import { TooltipProvider } from "@/components/ui/tooltip/tooltip"
import { getSession } from "@/features/auth/utils/get-session"
import css from "../styles.css?url"

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const session = await getSession()
    return session
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Scrapeek",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: css,
      },
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-blueprint-900 font-mono text-blueprint-100">
        <TooltipProvider>
          <Toaster />
          <div className="w-full max-w-[1280px] space-y-4 h-full mx-auto px-4 py-8">
            <Navbar />
            {children}
          </div>
          <div className="absolute -z-10 inset-0 min-h-full w-full bg-[linear-gradient(to_right,var(--color-blueprint-700)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-blueprint-700)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
        </TooltipProvider>
        <Scripts />
      </body>
    </html>
  )
}
