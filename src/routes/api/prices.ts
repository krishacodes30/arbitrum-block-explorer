import { createFileRoute } from "@tanstack/react-router";

type CoinRow = {
  usd: number;
  usd_24h_change: number;
};

const IDS = ["bitcoin", "ethereum", "arbitrum", "solana", "matic-network"] as const;

export const Route = createFileRoute("/api/prices")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const url = `https://api.coingecko.com/api/v3/simple/price?ids=${IDS.join(",")}&vs_currencies=usd&include_24hr_change=true`;
          const res = await fetch(url, {
            headers: { Accept: "application/json" },
          });
          if (!res.ok) {
            return Response.json(
              { error: `Upstream ${res.status}` },
              { status: 502 },
            );
          }
          const data = (await res.json()) as Record<string, CoinRow>;
          return Response.json(
            { data, fetchedAt: Date.now() },
            {
              headers: {
                "Cache-Control": "public, max-age=15, s-maxage=15",
              },
            },
          );
        } catch (e) {
          return Response.json({ error: (e as Error).message }, { status: 500 });
        }
      },
    },
  },
});
