'use client';

import { ProposalCard } from "@/components/ProposalCard";
import { NETWORK } from "@/constants/governorConfig";
import { useProposals } from "@/hooks/useProposals";

export function ProposalList() {
  const { data, isLoading, isError, refetch } = useProposals();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="h-48 animate-pulse rounded-2xl border border-slate-900/60 bg-slate-900/30"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-6 text-center text-sm text-rose-100">
        <p className="font-semibold">Unable to load proposals</p>
        <p className="mt-1 text-rose-200/80">
          Check your connection or switch to {NETWORK.name}.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-full bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 text-center text-sm text-slate-300">
        <p className="font-semibold">No proposals yet</p>
        <p className="mt-1 text-slate-400">
          Create the first proposal to kick off governance.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((proposal) => (
        <ProposalCard key={proposal.id.toString()} proposal={proposal} />
      ))}
    </div>
  );
}

