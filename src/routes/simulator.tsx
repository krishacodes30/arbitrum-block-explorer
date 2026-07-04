import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, XCircle, Hammer, StopCircle } from "lucide-react";
import { PageMotion } from "@/components/PageMotion";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Block Simulator — ChainScope" },
      {
        name: "description",
        content:
          "Mine two linked blocks with real SHA-256. See nonces tick live and watch the chain break when you tamper with data.",
      },
      { property: "og:title", content: "Block Simulator — ChainScope" },
      {
        property: "og:description",
        content: "Interactive proof-of-work simulator using the Web Crypto API.",
      },
    ],
  }),
  component: Simulator,
});

const DIFFICULTY_PREFIX = "00"; // hash must start with this

async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hashBuf = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function computeHashSync(data: string, prev: string, nonce: number) {
  return sha256(`${data}|${prev}|${nonce}`);
}

type BlockState = {
  data: string;
  prevHash: string;
  nonce: number;
  hash: string;
  mining: boolean;
};

const GENESIS_HASH = "0".repeat(64);

function Simulator() {
  const [b1, setB1] = useState<BlockState>({
    data: "Alice sends 5 ARB to Bob",
    prevHash: GENESIS_HASH,
    nonce: 0,
    hash: "",
    mining: false,
  });
  const [b2, setB2] = useState<BlockState>({
    data: "Bob sends 2 ARB to Carol",
    prevHash: "",
    nonce: 0,
    hash: "",
    mining: false,
  });

  const [mempool, setMempool] = useState<string[]>([]);
  const [txInput, setTxInput] = useState("");

  const addTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txInput.trim()) return;
    setMempool((prev) => [...prev, txInput.trim()]);
    setTxInput("");
  };

  // Recompute hashes reactively (non-mining) whenever inputs change.
  useEffect(() => {
    let cancelled = false;
    computeHashSync(b1.data, b1.prevHash, b1.nonce).then((h) => {
      if (!cancelled) setB1((s) => ({ ...s, hash: h }));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [b1.data, b1.prevHash, b1.nonce]);

  useEffect(() => {
    let cancelled = false;
    // Block 2's previous hash always tracks block 1's live hash — this is the chain.
    computeHashSync(b2.data, b1.hash, b2.nonce).then((h) => {
      if (!cancelled) setB2((s) => ({ ...s, prevHash: b1.hash, hash: h }));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [b2.data, b2.nonce, b1.hash]);

  const b1Valid = useMemo(() => b1.hash.startsWith(DIFFICULTY_PREFIX), [b1.hash]);
  const b2Valid = useMemo(
    () => b2.hash.startsWith(DIFFICULTY_PREFIX) && b2.prevHash === b1.hash,
    [b2.hash, b2.prevHash, b1.hash],
  );

  const cancelRef = useRef<{ [k: string]: boolean }>({});

  const mine = useCallback(
    async (which: "b1" | "b2") => {
      const setBlock = which === "b1" ? setB1 : setB2;
      const block = which === "b1" ? b1 : b2;
      const prev = which === "b1" ? b1.prevHash : b1.hash;
      
      let currentData = block.data;
      if (which === "b1" && mempool.length > 0) {
        const toInclude = mempool.slice(0, 3);
        currentData = toInclude.join("\n");
        setB1((s) => ({ ...s, data: currentData, nonce: 0 }));
        setMempool((p) => p.slice(3));
      }

      cancelRef.current[which] = false;
      setBlock((s) => ({ ...s, mining: true }));

      let nonce = 0;
      const CHUNK = 500;
      while (true) {
        if (cancelRef.current[which]) break;
        let found = false;
        let localHash = "";
        for (let i = 0; i < CHUNK; i++) {
          const h = await sha256(`${currentData}|${prev}|${nonce}`);
          if (h.startsWith(DIFFICULTY_PREFIX)) {
            localHash = h;
            found = true;
            break;
          }
          nonce++;
        }
        setBlock((s) => ({
          ...s,
          nonce,
          hash: found ? localHash : s.hash,
        }));
        if (found) break;
        // Yield to keep UI responsive
        await new Promise((r) => setTimeout(r, 0));
      }
      setBlock((s) => ({ ...s, mining: false }));
    },
    [b1, b2, mempool],
  );

  const stop = (which: "b1" | "b2") => {
    cancelRef.current[which] = true;
  };

  return (
    <PageMotion>
      <header className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-400">
          <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_12px_#38bdf8]" />
          04 · Block simulator
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold text-slate-50 sm:text-5xl md:text-6xl">
          Mine a block. Break the chain.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-slate-400 sm:text-lg">
          Real SHA-256 from the Web Crypto API. Difficulty target:{" "}
          <span className="font-data font-semibold text-sky-400">hash must start with "{DIFFICULTY_PREFIX}"</span>.
          Edit block 1's data and watch block 2 turn red — this is immutability, in action.
        </p>
      </header>

      <div className="mx-auto mt-16 max-w-2xl rounded-3xl border border-slate-700 bg-slate-800/80 p-6 backdrop-blur-md">
        <h2 className="font-display text-xl font-bold text-slate-50">Transaction Mempool</h2>
        <p className="mt-1 text-sm text-slate-400">Add transactions to the queue. Mining Block 1 pulls the top 3.</p>
        
        <form onSubmit={addTx} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={txInput}
            onChange={(e) => setTxInput(e.target.value)}
            placeholder="e.g., Alice sends 2 ARB to Bob"
            className="flex-1 rounded-xl border border-slate-600 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <button
            type="submit"
            className="rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-bold text-slate-950 transition hover:brightness-110"
          >
            Add to Queue
          </button>
        </form>

        {mempool.length > 0 && (
          <div className="mt-6 flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Pending Queue ({mempool.length})</h3>
            <div className="flex flex-col gap-2">
              <AnimatePresence>
                {mempool.map((tx, i) => (
                  <motion.div
                    key={tx + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm text-slate-300"
                  >
                    <span className="font-data text-xs text-slate-500">#{i + 1}</span>
                    {tx}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto mt-12 flex max-w-2xl flex-col items-stretch gap-6">
        <BlockCard
          index={1}
          block={b1}
          valid={b1Valid}
          onData={(v) => setB1((s) => ({ ...s, data: v, nonce: 0 }))}
          onNonce={(v) => setB1((s) => ({ ...s, nonce: v }))}
          onMine={() => mine("b1")}
          onStop={() => stop("b1")}
        />
        <Connector valid={b1Valid && b2Valid} />
        <BlockCard
          index={2}
          block={b2}
          valid={b2Valid}
          onData={(v) => setB2((s) => ({ ...s, data: v, nonce: 0 }))}
          onNonce={(v) => setB2((s) => ({ ...s, nonce: v }))}
          onMine={() => mine("b2")}
          onStop={() => stop("b2")}
          prevInvalid={b2.prevHash !== b1.hash || !b1Valid}
        />
      </div>

      <div className="mx-auto mt-16 max-w-2xl rounded-3xl border border-slate-700 bg-slate-800/80 p-8 text-base leading-relaxed text-slate-400">
        <p>
          <strong className="text-slate-50">How this works.</strong> Each block's hash is{" "}
          <span className="rounded bg-slate-900 px-2 py-0.5 font-data text-sky-400">SHA256(data + prevHash + nonce)</span>. Mining means
          incrementing nonce until the hash starts with{" "}
          <span className="rounded bg-slate-900 px-2 py-0.5 font-data">{DIFFICULTY_PREFIX}</span>. Block 2's{" "}
          <span className="font-data">prevHash</span> is always block 1's live hash — so if you
          tamper with block 1, block 2's link breaks instantly. To fix the chain you'd have to
          re-mine every block downstream. That's why blockchains are hard to rewrite.
        </p>
      </div>
    </PageMotion>
  );
}

function BlockCard({
  index,
  block,
  valid,
  onData,
  onNonce,
  onMine,
  onStop,
  prevInvalid,
}: {
  index: number;
  block: BlockState;
  valid: boolean;
  onData: (v: string) => void;
  onNonce: (v: number) => void;
  onMine: () => void;
  onStop: () => void;
  prevInvalid?: boolean;
}) {
  const broken = !valid;

  return (
    <motion.div
      layout
      animate={
        broken
          ? {
              boxShadow: [
                "0 0 0px rgba(242,84,91,0)",
                "0 0 22px rgba(242,84,91,0.45)",
                "0 0 0px rgba(242,84,91,0)",
              ],
            }
          : { boxShadow: "0 0 0px rgba(0,0,0,0)" }
      }
      transition={{ duration: 1.4, repeat: broken ? 2 : 0 }}
      className={`relative overflow-hidden rounded-3xl border p-8 backdrop-blur-md transition-colors duration-500 ${
        broken
          ? "border-red-500/50 bg-red-950/20"
          : "border-slate-700 bg-slate-800/80 hover:border-emerald-500/30 hover:shadow-[0_0_30px_-5px_rgba(52,211,153,0.1)]"
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-slate-700 px-3 py-1 text-sm font-bold tracking-widest text-slate-200">
            BLOCK #{index}
          </span>
          {block.mining && (
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-sky-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400" /> mining…
            </span>
          )}
        </div>
        <AnimatePresence mode="wait">
          {valid ? (
            <motion.span
              key="valid"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1.5 text-sm font-bold text-emerald-400"
            >
              <CheckCircle2 size={16} /> VALID
            </motion.span>
          ) : (
            <motion.span
              key="invalid"
              initial={{ scale: 0.8, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1.5 text-sm font-bold tracking-wide text-red-500"
            >
              <XCircle size={16} /> CHAIN BROKEN / INVALID
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 space-y-6">
        <Field label="Data">
          <textarea
            rows={3}
            value={block.data}
            onChange={(e) => onData(e.target.value)}
            className="w-full resize-none rounded-xl border border-slate-600 bg-slate-900/60 p-4 text-base text-slate-200 transition-colors focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </Field>
        <Field label="Previous hash">
          <div
            className={`truncate rounded-xl border p-4 font-data text-sm tracking-tight ${
              prevInvalid
                ? "border-red-500/50 bg-red-950/40 text-red-400"
                : "border-slate-700 bg-slate-900/60 text-slate-500"
            }`}
          >
            {block.prevHash || "—"}
          </div>
        </Field>
        <Field label="Nonce">
          <input
            type="number"
            min={0}
            value={block.nonce}
            onChange={(e) => onNonce(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full rounded-xl border border-slate-600 bg-slate-900/60 p-4 font-data text-base font-bold text-sky-400 tabular-nums transition-colors focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </Field>
        <Field label="Hash">
          <motion.div
            key={block.hash}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            className={`truncate rounded-xl border p-4 font-data text-sm font-bold tracking-tight ${
              valid
                ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-400"
                : "border-red-500/40 bg-red-950/20 text-red-500"
            }`}
          >
            {block.hash || "…"}
          </motion.div>
        </Field>
      </div>

      <div className="mt-8 flex gap-4">
        {block.mining ? (
          <button
            onClick={onStop}
            className="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-6 py-3 font-bold text-red-500 transition-colors hover:bg-red-500/30"
          >
            <StopCircle size={18} /> STOP MINING
          </button>
        ) : (
          <button
            onClick={onMine}
            className="inline-flex w-full justify-center items-center gap-2 rounded-xl bg-sky-500 px-6 py-4 text-base font-bold text-slate-950 transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.4)]"
          >
            <Hammer size={18} /> MINE BLOCK
          </button>
        )}
      </div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function Connector({ valid }: { valid: boolean }) {
  // Purely vertical line for new layout
  return (
    <div className="relative flex h-16 w-full items-center justify-center">
      <div
        className={`h-full w-1 transition-colors duration-300 ${
          valid ? "bg-sky-500" : "bg-red-500 opacity-70"
        }`}
      />
      {valid && (
        <motion.div
          className="absolute h-3 w-3 rounded-full bg-sky-300 shadow-[0_0_12px_#38bdf8]"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: [ -30, 30 ], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}
