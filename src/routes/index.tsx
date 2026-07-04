import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Zap, Shield, Layers, ArrowRight, Cpu, Coins } from "lucide-react";
import { PageMotion } from "@/components/PageMotion";

export const Route = createFileRoute("/")({
  component: Home,
});

const features = [
  {
    icon: Zap,
    title: "Instant, cheap transactions",
    body: "Arbitrum batches thousands of transactions off-chain, cutting fees by ~90% while inheriting Ethereum's security.",
  },
  {
    icon: Shield,
    title: "Ethereum-grade security",
    body: "Optimistic rollup fraud proofs settle every batch back on Ethereum L1 — no new trust assumptions.",
  },
  {
    icon: Layers,
    title: "Full EVM compatibility",
    body: "Any Solidity contract that runs on Ethereum runs on Arbitrum unchanged. Same tools, same wallets.",
  },
];

function Home() {
  return (
    <PageMotion>
      {/* Hero */}
      <section className="grid gap-12 py-12 md:grid-cols-[1.1fr_1fr] md:items-center md:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-400">
            <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_12px_#38bdf8]" />
            Arbitrum · Layer 2 explainer
          </div>
          <h1 className="mt-8 font-display text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl md:text-7xl">
            <span className="text-gradient-hero">Scale Ethereum without leaving it.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg sm:leading-relaxed">
            ChainScope is a hands-on tour of Layer 2 — how Arbitrum works, why it exists, and the
            primitives underneath. Read, compare, watch live markets, then mine your own block.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/simulator"
              className="group inline-flex items-center gap-3 rounded-full bg-sky-500 px-6 py-3.5 text-base font-semibold text-slate-950 transition-all duration-300 hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.4)]"
            >
              Try the block simulator
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              to="/concepts"
              className="inline-flex items-center gap-3 rounded-full border border-slate-700 bg-slate-800/50 px-6 py-3.5 text-base font-semibold text-slate-200 transition-all duration-300 hover:scale-[1.02] hover:border-sky-500/50 hover:bg-slate-800 hover:text-sky-400"
            >
              Browse concepts
            </Link>
          </div>
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-md"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <ChainIllustration />
        </motion.div>
      </section>

      {/* Why L2 */}
      <section className="mt-24">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-slate-50 md:text-4xl">Why Ethereum needed Layer 2</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
            Mainnet is the most secure settlement layer in the world, but it was never designed to be cheap. 
            Scaling required a paradigm shift.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-700 bg-slate-800/80 p-8 backdrop-blur-md transition-all duration-300 hover:border-slate-600 hover:shadow-xl hover:shadow-slate-900/50">
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-400">Gas Fees</p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-slate-50">Priced Out</h3>
            <p className="mt-4 text-base leading-relaxed text-slate-400">
              During peak demand, simple swaps cost double-digit dollars, pricing out everyday users. 
              Layer 2 bundles these transactions, dividing the cost among thousands.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-800/80 p-8 backdrop-blur-md transition-all duration-300 hover:border-slate-600 hover:shadow-xl hover:shadow-slate-900/50">
            <p className="text-sm font-bold uppercase tracking-widest text-sky-400">Congestion</p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-slate-50">The Bottleneck</h3>
            <p className="mt-4 text-base leading-relaxed text-slate-400">
              Ethereum processes ~15 transactions per second globally. Layer 2 networks process execution 
              off-chain instantly, completely bypassing the mainnet traffic jam.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-800/80 p-8 backdrop-blur-md transition-all duration-300 hover:border-slate-600 hover:shadow-xl hover:shadow-slate-900/50">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">The Payoff</p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-slate-50">100x Cheaper</h3>
            <p className="mt-4 text-base leading-relaxed text-slate-400">
              A transaction that costs <span className="font-data text-slate-200">$15.00</span> on mainnet 
              costs roughly <span className="font-data text-emerald-400">$0.10</span> on Arbitrum — while completely inheriting L1 security.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mt-24">
        <h2 className="font-display text-3xl font-bold text-slate-50 md:text-4xl">What makes it work</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group rounded-3xl border border-slate-700 bg-slate-800/80 p-8 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-sky-500/50 hover:shadow-[0_0_40px_-15px_rgba(56,189,248,0.4)]"
            >
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-sky-500/15 ring-1 ring-sky-400/40 text-sky-400">
                <f.icon size={28} />
              </div>
              <h3 className="mt-6 font-display text-xl font-bold text-slate-50">{f.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-slate-400">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Secondary quick-links */}
      <section className="mt-24 grid gap-8 md:grid-cols-2">
        <Link
          to="/prices"
          className="group rounded-3xl border border-slate-700 bg-slate-800/80 p-8 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-sky-500/50 hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.2)]"
        >
          <div className="flex items-center gap-4">
            <Coins className="text-sky-400" size={28} />
            <h3 className="font-display text-2xl font-bold text-slate-50">Live prices</h3>
          </div>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            Real-time ETH, BTC, and Arbitrum prices from CoinGecko — auto-refreshing.
          </p>
        </Link>
        <Link
          to="/simulator"
          className="group rounded-3xl border border-slate-700 bg-slate-800/80 p-8 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-sky-500/50 hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.2)]"
        >
          <div className="flex items-center gap-4">
            <Cpu className="text-sky-400" size={28} />
            <h3 className="font-display text-2xl font-bold text-slate-50">Block simulator</h3>
          </div>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            Mine two linked blocks with real SHA-256. Change block 1 and watch the chain break.
          </p>
        </Link>
      </section>
    </PageMotion>
  );
}

function ChainIllustration() {
  return (
    <svg viewBox="0 0 400 380" className="h-auto w-full" role="img" aria-label="Chain of blocks">
      <defs>
        <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#28a0f0" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#28a0f0" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${60 + i * 20}, ${40 + i * 90})`}>
          <rect
            width="220"
            height="90"
            rx="14"
            fill="url(#g1)"
            stroke="#28a0f0"
            strokeOpacity="0.5"
          />
          <text x="18" y="30" fill="#8892a6" fontSize="10" fontFamily="JetBrains Mono">
            block #{i + 1}
          </text>
          <text x="18" y="55" fill="#e7ecf4" fontSize="13" fontFamily="JetBrains Mono">
            0x{(Math.random().toString(16).slice(2, 10))}…
          </text>
          <text x="18" y="75" fill="#2ed9a3" fontSize="10" fontFamily="JetBrains Mono">
            ✓ valid
          </text>
        </g>
      ))}
      <path
        d="M170 130 L190 220 M190 220 L210 310"
        stroke="#28a0f0"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        opacity="0.6"
        fill="none"
      />
    </svg>
  );
}
