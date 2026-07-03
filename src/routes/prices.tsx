import { createFileRoute } from "@tanstack/react-router";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PageMotion } from "@/components/PageMotion";

export const Route = createFileRoute("/prices")({
  head: () => ({
    meta: [
      { title: "Live Prices — ChainScope" },
      {
        name: "description",
        content: "Real-time crypto prices for ETH, BTC, ARB, SOL and MATIC from CoinGecko.",
      },
      { property: "og:title", content: "Live Prices — ChainScope" },
      { property: "og:description", content: "Live ETH, BTC and Arbitrum prices from CoinGecko." },
    ],
  }),
  component: Prices,
});

type Coin = { id: string; name: string; symbol: string };
const COINS: Coin[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "arbitrum", name: "Arbitrum", symbol: "ARB" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "matic-network", name: "Polygon", symbol: "MATIC" },
];

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type ApiResp = {
  data: Record<string, { usd: number; usd_24h_change: number }>;
  fetchedAt: number;
};

function Prices() {
  const { data, error, isLoading, mutate, isValidating } = useSWR<ApiResp>(
    "/api/prices",
    fetcher,
    { refreshInterval: 30_000, revalidateOnFocus: false },
  );

  const [query, setQuery] = useState("");
  const filtered = COINS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.symbol.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <PageMotion>
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-arb">03 · Live prices</p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Markets, right now.
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Prices proxied through a Next-style route handler to CoinGecko. Auto-refreshing every 30
            seconds — hit refresh for an immediate pull.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter coins…"
            className="rounded-full border border-border bg-surface/70 px-4 py-2 text-sm placeholder:text-muted-foreground focus:border-arb/60 focus:outline-none"
          />
          <button
            onClick={() => mutate()}
            disabled={isValidating}
            className="inline-flex items-center gap-2 rounded-full bg-arb px-4 py-2 text-sm font-semibold text-[#041322] transition hover:brightness-110 disabled:opacity-60"
          >
            <RefreshCw
              size={14}
              className={isValidating ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </header>

      {data?.fetchedAt && (
        <p className="mt-4 text-xs text-muted-foreground">
          Last updated{" "}
          <span className="font-data text-foreground/80">
            {new Date(data.fetchedAt).toLocaleTimeString()}
          </span>
        </p>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
          Couldn't load prices. Try refreshing.
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && !data
          ? Array.from({ length: 5 }).map((_, i) => <PriceSkeleton key={i} />)
          : filtered.map((coin) => (
              <PriceCard
                key={coin.id}
                coin={coin}
                price={data?.data?.[coin.id]?.usd}
                change={data?.data?.[coin.id]?.usd_24h_change}
              />
            ))}
      </div>
    </PageMotion>
  );
}

function PriceCard({
  coin,
  price,
  change,
}: {
  coin: Coin;
  price?: number;
  change?: number;
}) {
  const up = (change ?? 0) >= 0;
  const prevPrice = useRef<number | undefined>(price);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (price == null) return;
    if (prevPrice.current != null && price !== prevPrice.current) {
      setFlash(price > prevPrice.current ? "up" : "down");
      const id = setTimeout(() => setFlash(null), 700);
      prevPrice.current = price;
      return () => clearTimeout(id);
    }
    prevPrice.current = price;
  }, [price]);

  return (
    <motion.div
      layout
      className="rounded-2xl border border-border bg-surface/70 p-5 backdrop-blur transition hover:border-arb/50"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-lg font-semibold">{coin.name}</p>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {coin.symbol}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
            up ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
          }`}
        >
          {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change != null ? `${change.toFixed(2)}%` : "—"}
        </span>
      </div>
      <div className="mt-6 h-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={price ?? "loading"}
            initial={{ opacity: 0, y: 6 }}
            animate={{
              opacity: 1,
              y: 0,
              color:
                flash === "up" ? "#2ed9a3" : flash === "down" ? "#f2545b" : "#e7ecf4",
            }}
            transition={{ duration: 0.4 }}
            className="font-data text-2xl font-semibold tracking-tight"
          >
            {price != null
              ? `$${price.toLocaleString("en-US", {
                  maximumFractionDigits: price < 10 ? 4 : 2,
                })}`
              : "—"}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function PriceSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-700/50" />
          <div className="h-3 w-10 animate-pulse rounded bg-slate-700/40" />
        </div>
        <div className="h-6 w-14 animate-pulse rounded-full bg-slate-700/40" />
      </div>
      <div className="mt-6 h-10">
        <div className="h-7 w-32 animate-pulse rounded bg-slate-700/50" />
      </div>
    </div>
  );
}
