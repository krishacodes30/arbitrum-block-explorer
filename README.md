# ChainScope

🚀 **Live Demo:** https://arbitrum-block-explorerweb.vercel.app/simulator

An interactive 4-page Web3 primer built around Arbitrum / Layer 2. Read the concepts, watch live prices, then mine your own block and break the chain.

Built on **TanStack Start** (React 19 + Vite) with Tailwind v4, Framer Motion, SWR, and the Web Crypto API.

## Pages

1. **Home (`/`)** — Landing page: hero, Arbitrum overview (why L2, what it is, real-world payoff), and feature highlights.
2. **Concepts (`/concepts`)** — Side-by-side comparison cards: Web2 vs Web3, Ethereum vs Bitcoin, Public vs Private keys, Blockchain vs Traditional DB.
3. **Live Prices (`/prices`)** — Real-time BTC / ETH / ARB / SOL / MATIC prices from CoinGecko (with server proxy + client-side fallback). Auto-refreshes every 30s, manual refresh, per-coin filter, and green/red flash on price updates.
4. **Block Simulator (`/simulator`)** — Mine two linked blocks with real **SHA-256** (Web Crypto). Nonces are searched in chunks so the UI never freezes and you can watch the counter tick live. Editing block 1 instantly invalidates block 2 — immutability made visible.

## How to Run Locally

### Using npm

```bash
npm install
npm run dev
