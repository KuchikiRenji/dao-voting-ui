import { clsx } from "clsx";

import type { VoteBreakdown } from "@/lib/governance";
import { formatVotes, formatPercent } from "@/lib/formatters";

type Props = {
  votes: VoteBreakdown;
  quorum?: bigint;
  compact?: boolean;
};

const SUPPORT_ORDER: Array<keyof VoteBreakdown> = [
  "for",
  "against",
  "abstain",
];

export function VoteStats({ votes, quorum, compact }: Props) {
  const total = votes.for + votes.against + votes.abstain;

  return (
    <div className="space-y-3">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-800">
        {SUPPORT_ORDER.map((key) => {
          const value = votes[key];
          const width =
            total === 0n ? 0 : Number((value * 100n) / (total || 1n));
          const color =
            key === "for"
              ? "bg-emerald-500"
              : key === "against"
                ? "bg-rose-500"
                : "bg-slate-500";

          return (
            <div
              key={key}
              className={clsx("transition-all", color)}
              style={{ width: `${width}%` }}
            />
          );
        })}
      </div>

      <div
        className={clsx(
          "grid gap-2 text-xs text-slate-300",
          compact ? "grid-cols-2" : "grid-cols-3",
        )}
      >
        {SUPPORT_ORDER.map((key) => (
          <div key={key} className="flex flex-col rounded-md bg-slate-900/40 p-3">
            <span className="uppercase tracking-wide text-[10px] text-slate-400">
              {key}
            </span>
            <span className="text-lg font-semibold text-white">
              {formatVotes(votes[key])}
            </span>
            <span className="text-[11px] text-slate-400">
              {formatPercent(votes[key], total || 1n)}
            </span>
          </div>
        ))}
        {quorum ? (
          <div className="rounded-md bg-amber-500/10 p-3 text-[11px]">
            <p className="font-semibold text-amber-300">Quorum</p>
            <p className="text-white">{formatVotes(quorum)}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}


