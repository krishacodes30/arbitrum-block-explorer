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

const COINGECKO_IDS = COINS.map((c) => c.id).join(",");
const COINGECKO_URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINGECKO_IDS}&sparkline=true`;

type CoinData = { usd: number; usd_24h_change: number; sparkline: number[] };
type ApiResp = {
  data: Record<string, CoinData>;
  fetchedAt: number;
};

/**
 * Fetcher with fallback: tries the server proxy first (/api/prices),
 * then falls back to direct CoinGecko fetch (CORS-friendly, no API key needed).
 */
async function priceFetcher(): Promise<ApiResp> {
  // Try server proxy first
  try {
    const res = await fetch("/api/prices");
    if (res.ok) {
      const json = await res.json();
      if (json?.data) return json as ApiResp;
    }
  } catch {
    // Server proxy unavailable — fall through to direct fetch
  }

  // Fallback: fetch directly from CoinGecko (works in browser, no API key)
  const res = await fetch(COINGECKO_URL, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`CoinGecko returned ${res.status}`);
  }
  const rawArray = (await res.json()) as any[];
  const data = rawArray.reduce((acc, curr) => {
    acc[curr.id] = {
      usd: curr.current_price,
      usd_24h_change: curr.price_change_percentage_24h,
      sparkline: curr.sparkline_in_7d?.price || [],
    };
    return acc;
  }, {} as Record<string, CoinData>);
  return { data, fetchedAt: Date.now() };
}

function Prices() {
  const { data, error, isLoading, mutate, isValidating } = useSWR<ApiResp>(
    "crypto-prices",
    priceFetcher,
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
      <header className="flex flex-wrap items-end justify-between gap-8 pb-12 pt-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-400">
            <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_12px_#38bdf8]" />
            03 · Live prices
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold text-slate-50 sm:text-5xl md:text-6xl">
            Markets, right now.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Prices proxied through a Next-style route handler to CoinGecko. Auto-refreshing every 30
            seconds — hit refresh for an immediate pull.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter coins…"
            className="w-48 rounded-full border border-slate-700 bg-slate-800/80 px-5 py-3.5 text-sm text-slate-200 placeholder:text-slate-500 transition-colors focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <button
            onClick={() => mutate()}
            disabled={isValidating}
            className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3.5 text-sm font-bold tracking-wide text-slate-950 transition-all duration-300 hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.4)] disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            <RefreshCw
              size={16}
              className={isValidating ? "animate-spin" : ""}
            />
            Refresh Feed
          </button>
        </div>
      </header>

      {data?.fetchedAt && (
        <p className="mt-4 text-sm text-slate-400">
          Last updated{" "}
          <span className="font-data font-medium text-slate-200">
            {new Date(data.fetchedAt).toLocaleTimeString()}
          </span>
        </p>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-sm text-red-500">
          Couldn't load prices. Try refreshing.
        </div>
      )}

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && !data
          ? Array.from({ length: 5 }).map((_, i) => <PriceSkeleton key={i} />)
          : filtered.map((coin) => {
              const coinData = data?.data?.[coin.id];
              return (
                <PriceCard
                  key={coin.id}
                  coin={coin}
                  price={coinData?.usd}
                  change={coinData?.usd_24h_change}
                  sparkline={coinData?.sparkline}
                />
              );
            })}
      </div>
    </PageMotion>
  );
}

function PriceCard({
  coin,
  price,
  change,
  sparkline,
}: {
  coin: Coin;
  price?: number;
  change?: number;
  sparkline?: number[];
}) {
  const up = (change ?? 0) >= 0;
  const prevPrice = useRef<number | undefined>(price);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  let pathD = "";
  if (sparkline && sparkline.length > 0) {
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const range = max - min || 1;
    pathD = sparkline
      .map((val, i) => {
        const x = (i / (sparkline.length - 1)) * 100;
        const y = 40 - ((val - min) / range) * 40;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }

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
      className="group rounded-3xl border border-slate-700 bg-slate-800/80 p-8 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-sky-500/50 hover:shadow-[0_0_40px_-15px_rgba(56,189,248,0.3)]"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-xl font-bold text-slate-50">{coin.name}</p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-slate-400">
            {coin.symbol}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${
            up ? "bg-emerald-400/15 text-emerald-400" : "bg-red-500/15 text-red-500"
          }`}
        >
          {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change != null ? `${change.toFixed(2)}%` : "—"}
        </span>
      </div>
      <div className="mt-10 h-10 flex items-end justify-between gap-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={price ?? "loading"}
            initial={{ opacity: 0, y: 6 }}
            animate={{
              opacity: 1,
              y: 0,
              color:
                flash === "up" ? "#34d399" : flash === "down" ? "#ef4444" : "#e2e8f0",
            }}
            transition={{ duration: 0.4 }}
            className="font-data text-3xl font-extrabold tracking-tight"
          >
            {price != null
              ? `$${price.toLocaleString("en-US", {
                  maximumFractionDigits: price < 10 ? 4 : 2,
                })}`
              : "—"}
          </motion.p>
        </AnimatePresence>
        
        {/* Sparkline Chart */}
        <div className="h-10 w-24">
          {pathD && (
            <svg viewBox="0 -2 100 44" className="h-full w-full overflow-visible">
              <path
                d={pathD}
                fill="none"
                stroke={up ? "#34d399" : "#ef4444"}
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
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
