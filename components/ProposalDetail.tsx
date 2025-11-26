'use client';

import Link from "next/link";

import { ProposalTimeline } from "@/components/ProposalTimeline";
import { VoteButtons } from "@/components/VoteButtons";
import { VoteStats } from "@/components/VoteStats";
import { NETWORK } from "@/constants/governorConfig";
import { useProposal } from "@/hooks/useProposal";
import { formatAddress, formatTimeRemaining } from "@/lib/formatters";

type Props = {
  proposalId: string;
};

export function ProposalDetail({ proposalId }: Props) {
  const { data, isLoading, isError, refetch } = useProposal(proposalId);

  if (isLoading) {
    return (
      <div className="h-80 animate-pulse rounded-2xl border border-slate-900/60 bg-slate-900/30" />
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-6 text-center text-sm text-rose-100">
        <p className="font-semibold">Unable to load proposal</p>
        <p className="mt-1 text-rose-200/80">
          Confirm the proposal exists on {NETWORK.name}.
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

  return (
    <div className="space-y-8">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <span className="rounded-full border border-slate-700 px-3 py-1 uppercase tracking-wide text-slate-200">
            #{data.id.toString()}
          </span>
          <span className="text-slate-300">{data.state}</span>
          <span>•</span>
          <span>
            Ends {formatTimeRemaining(data.endTimestamp)} (block{" "}
            {data.deadlineBlock.toString()})
          </span>
          <Link
            href="/dao"
            className="ml-auto text-emerald-300 underline-offset-2 hover:underline"
          >
            Back to proposals
          </Link>
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-white">{data.title}</h1>
        <p className="mt-2 text-sm text-slate-400">
          Proposed by {formatAddress(data.proposer)}
        </p>
      </header>

      <VoteStats votes={data.votes} />
      <VoteButtons proposalId={data.id} state={data.state} />
      <ProposalTimeline
        state={data.state}
        startTimestamp={data.startTimestamp}
        endTimestamp={data.endTimestamp}
      />

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <p className="text-sm font-semibold text-slate-300">Description</p>
        <p className="mt-3 whitespace-pre-wrap text-slate-200">
          {data.description}
        </p>
      </section>
    </div>
  );
}


