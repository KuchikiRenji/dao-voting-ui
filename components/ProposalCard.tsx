import Link from "next/link";

import type { GovernorProposal } from "@/lib/governance";
import { formatAddress, formatTimeRemaining } from "@/lib/formatters";
import { VoteStats } from "@/components/VoteStats";

type Props = {
  proposal: GovernorProposal;
};

export function ProposalCard({ proposal }: Props) {
  return (
    <Link
      href={`/dao/${proposal.id.toString()}`}
      className="block rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg shadow-black/30 transition hover:border-emerald-400/60 hover:bg-slate-900"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm uppercase tracking-wide text-slate-400">
          #{proposal.id.toString()}
        </p>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
          {proposal.state}
        </span>
      </div>

      <h3 className="mt-3 text-xl font-semibold text-white">{proposal.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate-400">
        {proposal.description}
      </p>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
        <span>Proposed by {formatAddress(proposal.proposer)}</span>
        <span>{formatTimeRemaining(proposal.endTimestamp)}</span>
      </div>

      <div className="mt-6">
        <VoteStats votes={proposal.votes} compact />
      </div>
    </Link>
  );
}


