# ChainScope

An interactive 4-page Web3 primer built around Arbitrum / Layer 2. Read the concepts, watch live prices, then mine your own block and break the chain.

Built on **TanStack Start** (React 19 + Vite) with Tailwind v4, Framer Motion, SWR, and the Web Crypto API.

## Pages

1. **Home (`/`)** — Landing page: hero, Arbitrum overview (why L2, what it is, real-world payoff), and feature highlights.
2. **Concepts (`/concepts`)** — Side-by-side comparison cards: Web2 vs Web3, Ethereum vs Bitcoin, Public vs Private keys, Blockchain vs Traditional DB.
3. **Live Prices (`/prices`)** — Real-time BTC / ETH / ARB / SOL / MATIC prices from CoinGecko (proxied through a server route to avoid CORS/rate limits). Auto-refreshes every 30s, manual refresh, per-coin filter, and green/red flash on price updates.
4. **Block Simulator (`/simulator`)** — Mine two linked blocks with real **SHA-256** (Web Crypto). Nonces are searched in chunks so the UI never freezes and you can watch the counter tick live. Editing block 1 instantly invalidates block 2 — immutability made visible.

## Run locally

```bash
bun install
bun run dev
```

Open http://localhost:8080.

## Stack notes

- `src/routes/api/prices.ts` — server route handler that proxies CoinGecko.
- `src/routes/simulator.tsx` — chunked async mining loop (500 hashes / tick, `await setTimeout(0)` between chunks) so the tab stays responsive and cancellable.
- Design tokens live in `src/styles.css` (`@theme inline`) — Arbitrum blue (`#28A0F0`), success green (`#2ED9A3`), danger red (`#F2545B`).
- Fonts: **Space Grotesk** (display), **Plus Jakarta Sans** (body), **JetBrains Mono** (all computed data — hashes, nonces, prices).
- `prefers-reduced-motion` is respected globally (animation & transition durations collapsed).

## Known issues / would improve

- CoinGecko's free tier is rate-limited; a heavy refresh loop can occasionally 429. A short in-memory cache on the server route would smooth this out.
- The mining difficulty (`"00"` prefix) is intentionally low so mining resolves in a second or two. Turning it up to `"000"` or `"0000"` shows the exponential cost of PoW nicely.
- Sparklines and a full "look up any coin" search box (autocomplete) were left out for scope.

## Submission

- **Batch:** _Arbitrum Builder Pods_
- **Author:** _Your Name_ (replace in `SiteFooter.tsx` and here)
- **GitHub:** _https://github.com/your-github/chainscope_
