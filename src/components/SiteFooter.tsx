import { ExternalLink } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-sm font-bold text-slate-50">
            Chain<span className="text-sky-400">Scope</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Built by <span className="text-slate-300">Krisha Patel</span> · Arbitrum Builder Pods
          </p>
        </div>
        <a
          href="https://github.com/krishacodes30/arbitrum-block-explorer"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-sky-400"
        >
          <ExternalLink size={14} /> GitHub repo
        </a>
      </div>
    </footer>
  );
}
