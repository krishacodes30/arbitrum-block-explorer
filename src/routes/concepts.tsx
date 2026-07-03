import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
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
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-arb">02 · Concepts</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">The fundamentals, compared.</h1>
        <p className="mt-4 text-muted-foreground">
          Four side-by-sides that ground the rest of the site. Not textbook definitions — just
          honest, plain-language contrasts.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {cards.map((c, i) => (
          <motion.article
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="rounded-2xl border border-border bg-surface/70 p-6 backdrop-blur transition-all duration-300 hover:border-arb/50 hover:shadow-[0_0_50px_-15px_#28a0f0]"
          >
            <h2 className="font-display text-xl font-semibold">{c.title}</h2>
            <div className="mt-5 grid grid-cols-[minmax(0,110px)_1fr_1fr] gap-x-3 text-sm">
              <div />
              <div className="pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {c.leftName}
              </div>
              <div className="pb-2 text-xs font-semibold uppercase tracking-wider text-arb">
                {c.rightName}
              </div>
              {c.rows.map((r) => (
                <ConceptRow key={r.label} row={r} />
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </PageMotion>
  );
}

function ConceptRow({ row }: { row: Row }) {
  return (
    <>
      <div className="border-t border-border/60 py-3 text-xs font-medium text-muted-foreground">
        {row.label}
      </div>
      <div className="border-t border-border/60 py-3 text-sm text-foreground/90">{row.left}</div>
      <div className="border-t border-border/60 py-3 text-sm text-foreground/90">{row.right}</div>
    </>
  );
}
