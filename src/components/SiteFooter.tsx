import { ExternalLink } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-sm font-semibold">
            Chain<span className="text-arb">Scope</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Built by <span className="text-foreground">Your Name</span> · Arbitrum Builder Pods
          </p>
        </div>
        <a
          href="https://github.com/your-github/chainscope"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-arb"
        >
          <ExternalLink size={14} /> GitHub repo
        </a>
      </div>
    </footer>
  );
}
