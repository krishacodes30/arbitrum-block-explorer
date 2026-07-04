import { createFileRoute } from "@tanstack/react-router";

type CoinRow = {
  usd: number;
  usd_24h_change: number;
  sparkline: number[];
};

type MarketItem = {
  id: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: { price: number[] };
};

const IDS = ["bitcoin", "ethereum", "arbitrum", "solana", "matic-network"] as const;

export const Route = createFileRoute("/api/prices")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${IDS.join(",")}&sparkline=true`;
          const res = await fetch(url, {
            headers: { Accept: "application/json" },
          });
          if (!res.ok) {
            return Response.json(
              { error: `Upstream ${res.status}` },
              { status: 502 },
            );
          }
          const rawData = (await res.json()) as MarketItem[];
          const data = rawData.reduce((acc, curr) => {
            acc[curr.id] = {
              usd: curr.current_price,
              usd_24h_change: curr.price_change_percentage_24h,
              sparkline: curr.sparkline_in_7d?.price || [],
            };
            return acc;
          }, {} as Record<string, CoinRow>);
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
