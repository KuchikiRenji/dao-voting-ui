'use client';

import { clsx } from "clsx";
import { useAccount, useConnect } from "wagmi";

import { useVote } from "@/hooks/useVote";
import { useVotingPower } from "@/hooks/useVotingPower";
import type { GovernorState } from "@/lib/governance";
import { formatVotes } from "@/lib/formatters";

type Props = {
  proposalId: bigint;
  state: GovernorState;
};

const BUTTONS = [
  { label: "For", intent: "positive" as const, actionKey: "voteFor" },
  { label: "Against", intent: "negative" as const, actionKey: "voteAgainst" },
  { label: "Abstain", intent: "neutral" as const, actionKey: "voteAbstain" },
] as const;

export function VoteButtons({ proposalId, state }: Props) {
  const { isConnected } = useAccount();
  const { connectors, connectAsync, isPending: isConnecting } = useConnect();
  const { data: power } = useVotingPower();
  const {
    voteFor,
    voteAgainst,
    voteAbstain,
    isVoting,
    error,
    txHash,
  } = useVote(proposalId);

  const isActive = state === "Active";
  const disabled = !isActive || isVoting || !isConnected;

  const handlers = {
    voteFor,
    voteAgainst,
    voteAbstain,
  };

  async function handleConnect() {
    if (!connectors.length) return;
    try {
      await connectAsync({ connector: connectors[0] });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">
            Voting power
          </p>
          <p className="text-2xl font-semibold text-white">
            {power !== undefined ? formatVotes(power, 18) : "Connect wallet"}
          </p>
        </div>
        {!isConnected ? (
          <button
            type="button"
            onClick={handleConnect}
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting…" : "Connect wallet"}
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {BUTTONS.map((button) => (
          <button
            key={button.label}
            type="button"
            className={clsx(
              "rounded-xl px-4 py-3 text-sm font-semibold transition",
              button.intent === "positive" &&
                "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30",
              button.intent === "negative" &&
                "bg-rose-500/20 text-rose-200 hover:bg-rose-500/30",
              button.intent === "neutral" &&
                "bg-slate-800 text-slate-200 hover:bg-slate-700",
              disabled && "cursor-not-allowed opacity-60",
            )}
            disabled={disabled}
            onClick={() => handlers[button.actionKey]()}
          >
            {isVoting ? "Submitting…" : button.label}
          </button>
        ))}
      </div>

      {!isActive ? (
        <p className="mt-3 text-xs text-slate-400">
          Voting is only available while the proposal is Active.
        </p>
      ) : null}

      {error ? (
        <p className="mt-3 text-xs text-rose-300">{error}</p>
      ) : null}
      {txHash ? (
        <p className="mt-2 text-xs text-emerald-300">
          Tx submitted: {txHash.slice(0, 8)}…{txHash.slice(-6)}
        </p>
      ) : null}
    </div>
  );
}

