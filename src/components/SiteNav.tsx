import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, Wallet, Loader2 } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/concepts", label: "Concepts" },
  { to: "/prices", label: "Live Prices" },
  { to: "/simulator", label: "Simulator" },
] as const;

export function SiteNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  // Wallet Simulation State
  const [walletStatus, setWalletStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [showWalletModal, setShowWalletModal] = useState(false);
  
  const connectWallet = (walletName: string) => {
    setShowWalletModal(false);
    setWalletStatus("connecting");
    setTimeout(() => {
      setWalletStatus("connected");
    }, 2000);
  };

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-500/15 ring-1 ring-sky-400/40">
            <span className="h-3 w-3 rounded-sm bg-sky-400 shadow-[0_0_12px_#38bdf8]" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-slate-50">
            Chain<span className="text-sky-400">Scope</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = path === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className="relative rounded-full px-4 py-2 text-sm font-bold tracking-wide text-slate-400 transition-colors hover:text-slate-50"
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-sky-500/15 ring-1 ring-sky-400/40"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative ${active ? "text-sky-400" : ""}`}>{l.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => walletStatus === "disconnected" && setShowWalletModal(true)}
            disabled={walletStatus === "connecting"}
            className={`hidden md:inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${
              walletStatus === "connected"
                ? "bg-slate-800 text-sky-400 ring-1 ring-sky-500/50"
                : "bg-sky-500 text-slate-950 hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_0_20px_-5px_rgba(56,189,248,0.4)]"
            }`}
          >
            {walletStatus === "disconnected" && (
              <>
                <Wallet size={16} /> Connect Wallet
              </>
            )}
            {walletStatus === "connecting" && (
              <>
                <Loader2 size={16} className="animate-spin" /> Connecting...
              </>
            )}
            {walletStatus === "connected" && (
              <>
                <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                0x71C...9A23
              </>
            )}
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-md border border-slate-700 bg-slate-800 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} className="text-slate-200" /> : <Menu size={18} className="text-slate-200" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/60 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-slate-50"
                    activeProps={{ className: "block rounded-md px-3 py-2 text-sm font-bold text-sky-400 bg-sky-500/10" }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              
              {/* Mobile Connect Wallet Button */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: links.length * 0.05 }}
                className="mt-2 border-t border-slate-700 pt-2"
              >
                <button
                  onClick={() => walletStatus === "disconnected" && setShowWalletModal(true)}
                  disabled={walletStatus === "connecting"}
                  className={`flex w-full items-center justify-center gap-2 rounded-md px-3 py-3 text-sm font-bold transition-all duration-300 ${
                    walletStatus === "connected"
                      ? "bg-slate-800 text-sky-400"
                      : "bg-sky-500 text-slate-950"
                  }`}
                >
                  {walletStatus === "disconnected" && (
                    <>
                      <Wallet size={16} /> Connect Wallet
                    </>
                  )}
                  {walletStatus === "connecting" && (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Connecting...
                    </>
                  )}
                  {walletStatus === "connected" && (
                    <>
                      <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                      0x71C...9A23
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

    <AnimatePresence>
      {showWalletModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWalletModal(false)}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <h3 className="font-display text-lg font-bold text-slate-50">Connect Wallet</h3>
              <button onClick={() => setShowWalletModal(false)} className="rounded-full p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <button onClick={() => connectWallet("MetaMask")} className="flex items-center justify-between rounded-xl p-4 text-left font-semibold text-slate-200 hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-orange-500/20 text-orange-500 grid place-items-center">🦊</div>
                  MetaMask
                </div>
                <span className="text-xs font-bold text-slate-500">Popular</span>
              </button>
              <button onClick={() => connectWallet("Coinbase")} className="flex items-center justify-between rounded-xl p-4 text-left font-semibold text-slate-200 hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-500 grid place-items-center">🛡️</div>
                  Coinbase Wallet
                </div>
              </button>
              <button onClick={() => connectWallet("Phantom")} className="flex items-center justify-between rounded-xl p-4 text-left font-semibold text-slate-200 hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-500/20 text-purple-500 grid place-items-center">👻</div>
                  Phantom
                </div>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
