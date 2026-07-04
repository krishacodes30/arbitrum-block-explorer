import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { PageMotion } from "@/components/PageMotion";

export const Route = createFileRoute("/concepts")({
  head: () => ({
    meta: [
      { title: "Concepts — ChainScope" },
      {
        name: "description",
        content:
          "Side-by-side comparisons of core Web3 concepts: Web2 vs Web3, Ethereum vs Bitcoin, keys, and blockchains vs databases.",
      },
      { property: "og:title", content: "Concepts — ChainScope" },
      { property: "og:description", content: "Core Web3 concepts, compared side-by-side." },
    ],
  }),
  component: Concepts,
});

type Row = { label: string; left: string; right: string };
type Card = {
  title: string;
  leftName: string;
  rightName: string;
  rows: Row[];
};

const cards: Card[] = [
  {
    title: "Web2 vs Web3",
    leftName: "Web2",
    rightName: "Web3",
    rows: [
      { label: "Who owns your data", left: "The platform (Meta, Google)", right: "You — held in your wallet" },
      { label: "Identity", left: "Email + password per site", right: "One wallet, works everywhere" },
      { label: "Backend", left: "Private company servers", right: "Public smart contracts on-chain" },
      { label: "Money", left: "Bank rails, chargebacks", right: "Native, programmable, global" },
    ],
  },
  {
    title: "Ethereum vs Bitcoin",
    leftName: "Bitcoin",
    rightName: "Ethereum",
    rows: [
      { label: "Purpose", left: "Digital gold, store of value", right: "World computer, runs programs" },
      { label: "Programming", left: "Limited scripting", right: "Turing-complete (Solidity)" },
      { label: "Consensus", left: "Proof of Work", right: "Proof of Stake (since 2022)" },
      { label: "Block time", left: "~10 minutes", right: "~12 seconds" },
    ],
  },
  {
    title: "Public Key vs Private Key",
    leftName: "Public key",
    rightName: "Private key",
    rows: [
      { label: "Share it?", left: "Yes — it's your address", right: "Never — it controls the funds" },
      { label: "Purpose", left: "Receive money, verify signatures", right: "Sign transactions, prove ownership" },
      { label: "Analogy", left: "Your account number", right: "The signature on your check" },
      { label: "If leaked", left: "Nothing bad", right: "Funds gone, no recovery" },
    ],
  },
  {
    title: "Blockchain vs Traditional Database",
    leftName: "Traditional DB",
    rightName: "Blockchain",
    rows: [
      { label: "Who can write", left: "Whoever owns the DB", right: "Anyone with a valid transaction" },
      { label: "History", left: "Editable — rows can be deleted", right: "Append-only, cryptographically linked" },
      { label: "Trust model", left: "Trust the operator", right: "Trust math + open verification" },
      { label: "Uptime", left: "Depends on one company", right: "Global, no single point of failure" },
    ],
  },
];

function Concepts() {
  return (
    <PageMotion>
      <header className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-400">
          <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_12px_#38bdf8]" />
          02 · Concepts
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold text-slate-50 sm:text-5xl md:text-6xl">The fundamentals, compared.</h1>
        <p className="mt-6 text-base leading-relaxed text-slate-400 sm:text-lg">
          Four side-by-sides that ground the rest of the site. Not textbook definitions — just
          honest, plain-language contrasts.
        </p>
      </header>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.01, y: -4 }}
            className="group flex flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-800/80 backdrop-blur-md transition-all duration-300 hover:border-sky-500/50 hover:shadow-[0_0_50px_-15px_rgba(56,189,248,0.4)]"
          >
            <div className="border-b border-slate-700 bg-slate-900/40 px-6 py-4 md:px-8 md:py-6">
              <h2 className="font-display text-2xl font-bold text-slate-50">{c.title}</h2>
            </div>

            <div className="flex flex-1 flex-col md:flex-row">
              {/* Left Column */}
              <div className="flex-1 border-b border-slate-700 p-6 md:border-b-0 md:border-r md:p-8">
                <div className="mb-6 inline-block rounded-full bg-slate-700 px-4 py-1.5 text-sm font-bold tracking-wider text-slate-300">
                  {c.leftName}
                </div>
                <div className="flex flex-col gap-6">
                  {c.rows.map((r) => (
                    <div key={r.label}>
                      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">{r.label}</p>
                      <p className="text-base leading-relaxed text-slate-300">{r.left}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column */}
              <div className="flex-1 bg-sky-950/10 p-6 md:p-8">
                <div className="mb-6 inline-block rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-sm font-bold tracking-wider text-sky-400">
                  {c.rightName}
                </div>
                <div className="flex flex-col gap-6">
                  {c.rows.map((r) => (
                    <div key={r.label}>
                      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-sky-600/70">{r.label}</p>
                      <p className="text-base leading-relaxed text-sky-100">{r.right}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </PageMotion>
  );
}
