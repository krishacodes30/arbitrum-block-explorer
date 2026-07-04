import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { BackgroundFX } from "@/components/BackgroundFX";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold">404</h1>
        <p className="mt-4 text-muted-foreground">This block doesn't exist on the chain.</p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-arb px-4 py-2 text-sm font-semibold text-[#041322] transition hover:brightness-110"
        >
          Go home
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try refreshing or head back home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-arb px-4 py-2 text-sm font-semibold text-[#041322]"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ChainScope — Arbitrum & Layer 2 explorer" },
      {
        name: "description",
        content:
          "An interactive Web3 primer: Arbitrum overview, core concepts, live crypto prices, and a hands-on block mining simulator.",
      },
      { name: "author", content: "ChainScope" },
      { property: "og:title", content: "ChainScope — Arbitrum & Layer 2 explorer" },
      {
        property: "og:description",
        content:
          "Explore Arbitrum, compare Web3 concepts, watch live prices, and mine your own blocks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <BackgroundFX />
        <div className="relative z-10 flex min-h-screen flex-col">
          <SiteNav />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 md:py-16">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
      </div>
    </QueryClientProvider>
  );
}
