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

      cancelRef.current[which] = false;
      setBlock((s) => ({ ...s, mining: true }));

      let nonce = 0;
      const CHUNK = 500;
      while (true) {
        if (cancelRef.current[which]) break;
        let found = false;
        let localHash = "";
        for (let i = 0; i < CHUNK; i++) {
          const h = await sha256(`${block.data}|${prev}|${nonce}`);
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
    [b1, b2],
  );

  const stop = (which: "b1" | "b2") => {
    cancelRef.current[which] = true;
  };

  return (
    <PageMotion>
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-arb">04 · Block simulator</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
          Mine a block. Break the chain.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Real SHA-256 from the Web Crypto API. Difficulty target:{" "}
          <span className="font-data text-arb">hash must start with "{DIFFICULTY_PREFIX}"</span>.
          Edit block 1's data and watch block 2 turn red — this is immutability, in action.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_60px_1fr] lg:items-stretch">
        <BlockCard
          index={1}
          block={b1}
          valid={b1Valid}
          onData={(v) => setB1((s) => ({ ...s, data: v, nonce: 0 }))}
          onMine={() => mine("b1")}
          onStop={() => stop("b1")}
        />
        <Connector valid={b1Valid && b2Valid} />
        <BlockCard
          index={2}
          block={b2}
          valid={b2Valid}
          onData={(v) => setB2((s) => ({ ...s, data: v, nonce: 0 }))}
          onMine={() => mine("b2")}
          onStop={() => stop("b2")}
          prevInvalid={b2.prevHash !== b1.hash || !b1Valid}
        />
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface/60 p-6 text-sm text-muted-foreground">
        <p>
          <span className="text-foreground">How this works.</span> Each block's hash is{" "}
          <span className="font-data text-arb">SHA256(data + prevHash + nonce)</span>. Mining means
          incrementing nonce until the hash starts with{" "}
          <span className="font-data">{DIFFICULTY_PREFIX}</span>. Block 2's{" "}
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
  onMine,
  onStop,
  prevInvalid,
}: {
  index: number;
  block: BlockState;
  valid: boolean;
  onData: (v: string) => void;
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
      className={`relative rounded-2xl border p-6 backdrop-blur transition-colors ${
        broken
          ? "border-danger/60 bg-danger/5"
          : "border-success/40 bg-surface/70"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-arb/15 px-2 py-0.5 text-xs font-semibold text-arb">
            BLOCK #{index}
          </span>
          {block.mining && (
            <span className="inline-flex items-center gap-1 text-xs text-arb">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-arb" /> mining…
            </span>
          )}
        </div>
        <AnimatePresence mode="wait">
          {valid ? (
            <motion.span
              key="valid"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-xs font-semibold text-success"
            >
              <CheckCircle2 size={12} /> valid
            </motion.span>
          ) : (
            <motion.span
              key="invalid"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1 rounded-full bg-danger/15 px-2 py-1 text-xs font-semibold text-danger"
            >
              <XCircle size={12} /> invalid
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 space-y-4">
        <Field label="Data">
          <input
            value={block.data}
            onChange={(e) => onData(e.target.value)}
            className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm focus:border-arb/60 focus:outline-none"
          />
        </Field>
        <Field label="Previous hash">
          <div
            className={`truncate rounded-md border px-3 py-2 font-data text-xs ${
              prevInvalid
                ? "border-danger/50 bg-danger/5 text-danger"
                : "border-border bg-background/60 text-muted-foreground"
            }`}
          >
            {block.prevHash || "—"}
          </div>
        </Field>
        <Field label="Nonce">
          <div className="rounded-md border border-border bg-background/60 px-3 py-2 font-data text-sm text-arb tabular-nums">
            {block.nonce.toLocaleString()}
          </div>
        </Field>
        <Field label="Hash">
          <motion.div
            key={block.hash}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            className={`truncate rounded-md border px-3 py-2 font-data text-xs ${
              valid
                ? "border-success/40 bg-success/5 text-success"
                : "border-danger/40 bg-danger/5 text-danger"
            }`}
          >
            {block.hash || "…"}
          </motion.div>
        </Field>
      </div>

      <div className="mt-5 flex gap-2">
        {block.mining ? (
          <button
            onClick={onStop}
            className="inline-flex items-center gap-2 rounded-full border border-danger/50 bg-danger/10 px-4 py-2 text-sm font-semibold text-danger"
          >
            <StopCircle size={14} /> Stop
          </button>
        ) : (
          <button
            onClick={onMine}
            className="inline-flex items-center gap-2 rounded-full bg-arb px-4 py-2 text-sm font-semibold text-[#041322] transition hover:brightness-110"
          >
            <Hammer size={14} /> Mine block
          </button>
        )}
      </div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Connector({ valid }: { valid: boolean }) {
  // Vertical divider on mobile, horizontal signal-line on desktop
  return (
    <div className="relative flex items-center justify-center py-4 lg:py-0">
      <svg
        viewBox="0 0 60 200"
        className="hidden h-full w-16 lg:block"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={valid ? "#28a0f0" : "#f2545b"} stopOpacity="0.1" />
            <stop offset="50%" stopColor={valid ? "#28a0f0" : "#f2545b"} stopOpacity="1" />
            <stop offset="100%" stopColor={valid ? "#28a0f0" : "#f2545b"} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <line
          x1="0"
          y1="100"
          x2="60"
          y2="100"
          stroke={valid ? "#28a0f0" : "#f2545b"}
          strokeWidth={valid ? 2 : 2.5}
          strokeDasharray={valid ? "0" : "6 6"}
          opacity={0.9}
        />
        {valid && (
          <motion.circle
            r="4"
            cy="100"
            fill="#28a0f0"
            initial={{ cx: 0, opacity: 0 }}
            animate={{ cx: [0, 60], opacity: [0, 1, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </svg>
      <div
        className={`h-16 w-0.5 lg:hidden ${
          valid ? "bg-arb" : "bg-danger"
        } ${valid ? "" : "opacity-70"}`}
      />
    </div>
  );
}
