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
      <section className="grid gap-10 py-6 md:grid-cols-[1.1fr_1fr] md:items-center md:py-12">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-arb/40 bg-arb/10 px-3 py-1 text-xs font-medium text-arb">
            <span className="h-1.5 w-1.5 rounded-full bg-arb shadow-[0_0_8px_#28a0f0]" />
            Arbitrum · Layer 2 explainer
          </div>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl">
            <span className="text-gradient-hero">Scale Ethereum without leaving it.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            ChainScope is a hands-on tour of Layer 2 — how Arbitrum works, why it exists, and the
            primitives underneath. Read, compare, watch live markets, then mine your own block.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/simulator"
              className="group inline-flex items-center gap-2 rounded-full bg-arb px-5 py-3 text-sm font-semibold text-[#041322] transition hover:brightness-110"
            >
              Try the block simulator
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              to="/concepts"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:border-arb/60 hover:text-arb"
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
      <section className="mt-16 grid gap-6 rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur md:grid-cols-3 md:p-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-arb">The problem</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">Ethereum hit its ceiling</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Block space is finite. As demand grew, fees spiked to double-digit dollars per swap. To
            stay usable, Ethereum needed a way to process more without sacrificing decentralization.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-arb">The answer</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">Arbitrum, an optimistic rollup</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Arbitrum executes transactions off-chain and posts compressed proofs back to Ethereum.
            L1 becomes the settlement layer; L2 becomes the fast, cheap execution layer.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-arb">The payoff</p>
          <h2 className="mt-2 font-display text-2xl font-semibold">Cents, not dollars</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            A swap that costs ~<span className="font-data text-foreground">$15</span> on mainnet
            costs roughly <span className="font-data text-success">$0.10</span> on Arbitrum — same
            wallets, same contracts, same security guarantees.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mt-16">
        <h2 className="font-display text-3xl font-semibold">What makes it work</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur transition hover:border-arb/50 hover:shadow-[0_0_40px_-15px_#28a0f0]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-arb/15 ring-1 ring-arb/40 text-arb">
                <f.icon size={20} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Secondary quick-links */}
      <section className="mt-16 grid gap-5 md:grid-cols-2">
        <Link
          to="/prices"
          className="group rounded-2xl border border-border bg-surface/60 p-6 transition hover:border-arb/50"
        >
          <div className="flex items-center gap-3">
            <Coins className="text-arb" size={20} />
            <h3 className="font-display text-lg font-semibold">Live prices</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Real-time ETH, BTC, and Arbitrum prices from CoinGecko — auto-refreshing.
          </p>
        </Link>
        <Link
          to="/simulator"
          className="group rounded-2xl border border-border bg-surface/60 p-6 transition hover:border-arb/50"
        >
          <div className="flex items-center gap-3">
            <Cpu className="text-arb" size={20} />
            <h3 className="font-display text-lg font-semibold">Block simulator</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
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
